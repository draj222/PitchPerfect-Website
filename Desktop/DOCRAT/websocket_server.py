#!/usr/bin/env python3
import asyncio
import json
import logging
import random
import os
import datetime
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
import time
import requests
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import websockets
import signal
import sys

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("websocket_server")

# Create FastAPI app
app = FastAPI(title="Sustainability Data WebSocket Server")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class AirQualityReading(BaseModel):
    aqi: int
    status: str
    location: str
    timestamp: str

class NewsItem(BaseModel):
    headline: str
    source: str
    url: str
    timestamp: str

class SustainabilityScore(BaseModel):
    overall_score: int
    categories: Dict[str, int]
    timestamp: str

# Constants
NEWS_API_KEY = os.getenv('NEWS_API_KEY', '')
PORT = int(os.getenv('WEBSOCKET_PORT', 8765))
HOST = os.getenv('WEBSOCKET_HOST', 'localhost')

# Store connected clients
connected_clients = set()

# Mock data for sustainability scores
sustainability_data = {
    "overall": 76,
    "water": 82,
    "energy": 78,
    "emissions": 64,
    "waste": 80
}

# Air quality data storage (simulated historical data)
air_quality_history = []

# Initialize with some historical data
for i in range(24):
    air_quality_history.append({
        'timestamp': (datetime.datetime.now() - datetime.timedelta(hours=24-i)).isoformat(),
        'aqi': random.randint(20, 120)
    })

# News cache
news_cache = []
last_news_fetch = datetime.datetime.now() - datetime.timedelta(hours=1)

# Connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_count = 0
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_count += 1
        logger.info(f"Client connected. Total connections: {self.connection_count}")
        
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.connection_count -= 1
            logger.info(f"Client disconnected. Total connections: {self.connection_count}")
    
    async def broadcast(self, message: Dict[str, Any]):
        """Send a message to all connected clients"""
        disconnected_websockets = []
        for websocket in self.active_connections:
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to client: {e}")
                disconnected_websockets.append(websocket)
        
        # Clean up disconnected websockets
        for ws in disconnected_websockets:
            self.disconnect(ws)

# Initialize the connection manager
manager = ConnectionManager()

# Mock data generation functions
def generate_mock_air_quality() -> Dict[str, Any]:
    """Generate mock air quality data"""
    aqi_value = random.randint(30, 180)
    
    if aqi_value <= 50:
        status = "Good"
    elif aqi_value <= 100:
        status = "Moderate"
    elif aqi_value <= 150:
        status = "Unhealthy for Sensitive Groups"
    elif aqi_value <= 200:
        status = "Unhealthy"
    elif aqi_value <= 300:
        status = "Very Unhealthy"
    else:
        status = "Hazardous"
    
    return {
        "aqi": aqi_value,
        "status": status,
        "location": "City Center",
        "timestamp": datetime.datetime.now().isoformat()
    }

def generate_mock_news() -> Dict[str, Any]:
    """Generate mock sustainability news"""
    headlines = [
        "City Announces New Green Building Standards",
        "Local Company Achieves Carbon Neutrality",
        "Community Garden Initiative Expands to 10 New Locations",
        "Public Transit Ridership Up 15% This Quarter",
        "Solar Panel Installation Program Exceeds Goals",
        "New Bike Lanes Approved for Downtown Area",
        "Water Conservation Efforts Show Promising Results",
        "Tree Planting Initiative Reaches 10,000 Trees Milestone"
    ]
    
    sources = ["City News", "Environmental Times", "Green Report", "Sustainability Now", "EcoWatch"]
    
    return {
        "headline": random.choice(headlines),
        "source": random.choice(sources),
        "url": "https://example.com/news/sustainability",
        "timestamp": datetime.datetime.now().isoformat()
    }

def generate_mock_sustainability_score() -> Dict[str, Any]:
    """Generate mock sustainability scores"""
    categories = {
        "Air Quality": random.randint(65, 95),
        "Water Quality": random.randint(70, 90),
        "Waste Management": random.randint(60, 85),
        "Energy Efficiency": random.randint(55, 80),
        "Green Space": random.randint(75, 98),
        "Transportation": random.randint(50, 75)
    }
    
    # Calculate overall score as average of categories
    overall_score = round(sum(categories.values()) / len(categories))
    
    return {
        "overall_score": overall_score,
        "categories": categories,
        "timestamp": datetime.datetime.now().isoformat()
    }

# API functions
async def get_air_quality_data() -> Dict[str, Any]:
    """
    Fetch real air quality data or generate mock data if API key not available
    """
    api_key = os.getenv("AIRQUALITY_API_KEY")
    if not api_key:
        logger.info("No AirQuality API key found, using mock data")
        return generate_mock_air_quality()
    
    try:
        # Example API call to air quality API
        response = requests.get(
            f"https://api.waqi.info/feed/here/?token={api_key}",
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok" and "data" in data:
                aqi = data["data"]["aqi"]
                
                if aqi <= 50:
                    status = "Good"
                elif aqi <= 100:
                    status = "Moderate"
                elif aqi <= 150:
                    status = "Unhealthy for Sensitive Groups"
                elif aqi <= 200:
                    status = "Unhealthy"
                elif aqi <= 300:
                    status = "Very Unhealthy"
                else:
                    status = "Hazardous"
                
                return {
                    "aqi": aqi,
                    "status": status,
                    "location": data["data"].get("city", {}).get("name", "Unknown Location"),
                    "timestamp": datetime.datetime.now().isoformat()
                }
        
        logger.warning(f"Failed to get air quality data: {response.status_code}")
        return generate_mock_air_quality()
        
    except Exception as e:
        logger.error(f"Error fetching air quality data: {e}")
        return generate_mock_air_quality()

async def get_sustainability_news() -> Dict[str, Any]:
    """
    Fetch sustainability news or generate mock news if API key not available
    """
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        logger.info("No News API key found, using mock news")
        return generate_mock_news()
    
    try:
        # Example API call to news API for sustainability news
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params={
                "q": "sustainability OR climate OR environment",
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 1,
                "apiKey": api_key
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok" and data.get("articles"):
                article = data["articles"][0]
                return {
                    "headline": article.get("title", "Sustainability News Update"),
                    "source": article.get("source", {}).get("name", "News Source"),
                    "url": article.get("url", "https://example.com"),
                    "timestamp": article.get("publishedAt", datetime.datetime.now().isoformat())
                }
        
        logger.warning(f"Failed to get news data: {response.status_code}")
        return generate_mock_news()
        
    except Exception as e:
        logger.error(f"Error fetching news data: {e}")
        return generate_mock_news()

async def get_sustainability_score() -> Dict[str, Any]:
    """Generate sustainability score data"""
    # This would typically come from a real data source or calculation
    # For now, we'll use mock data
    return generate_mock_sustainability_score()

# Routes
@app.get("/")
async def root():
    return {"message": "Sustainability Data WebSocket Server"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    # Send initial data
    initial_data = {
        "type": "initial_data",
        "data": {
            "air_quality": await get_air_quality_data(),
            "news": await get_sustainability_news(),
            "sustainability_score": await get_sustainability_score()
        }
    }
    await websocket.send_json(initial_data)
    
    # Set up the periodic update task
    update_task = None
    
    try:
        # Function to send periodic updates
        async def send_updates():
            update_interval = 30  # seconds
            while True:
                await asyncio.sleep(update_interval)
                
                # Randomly choose which update to send
                update_type = random.choice(["air_quality", "news", "sustainability"])
                
                if update_type == "air_quality":
                    data = await get_air_quality_data()
                    await manager.broadcast({
                        "type": "air_quality_update",
                        "data": data
                    })
                    
                elif update_type == "news":
                    data = await get_sustainability_news()
                    await manager.broadcast({
                        "type": "news_update",
                        "data": data
                    })
                    
                elif update_type == "sustainability":
                    data = await get_sustainability_score()
                    await manager.broadcast({
                        "type": "sustainability_score_update",
                        "data": data
                    })
        
        # Start the update task
        update_task = asyncio.create_task(send_updates())
        
        # Keep the connection alive and handle client messages
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                logger.info(f"Received message from client: {message}")
                
                # Handle client message here if needed
                # For now we'll just echo it back
                await websocket.send_json({
                    "type": "echo",
                    "data": message
                })
                
            except json.JSONDecodeError:
                logger.warning(f"Received invalid JSON: {data}")
    
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)
        if update_task:
            update_task.cancel()
            try:
                await update_task
            except asyncio.CancelledError:
                pass

async def register(websocket):
    """Register a new client."""
    connected_clients.add(websocket)
    logger.info(f"New client connected. Total clients: {len(connected_clients)}")
    
    # Send initial data
    await send_initial_data(websocket)

async def unregister(websocket):
    """Unregister a client."""
    connected_clients.remove(websocket)
    logger.info(f"Client disconnected. Total clients: {len(connected_clients)}")

async def send_to_all(message):
    """Send a message to all connected clients."""
    if connected_clients:
        await asyncio.gather(
            *[client.send(json.dumps(message)) for client in connected_clients],
            return_exceptions=True
        )

async def send_initial_data(websocket):
    """Send initial data to a newly connected client."""
    try:
        # Send air quality data
        latest_air_quality = generate_air_quality_data()
        await websocket.send(json.dumps({
            "type": "air_quality",
            "data": latest_air_quality,
            "history": air_quality_history
        }))
        
        # Send sustainability scores
        await websocket.send(json.dumps({
            "type": "sustainability_score",
            "data": sustainability_data,
            "timestamp": datetime.datetime.now().isoformat()
        }))
        
        # Send news
        news = await fetch_news()
        await websocket.send(json.dumps({
            "type": "news_update",
            "data": news
        }))
        
        # Send a welcome message
        await websocket.send(json.dumps({
            "type": "notification",
            "message": "Connected to real-time sustainability data stream",
            "level": "success"
        }))
        
        # Send an insight
        await websocket.send(json.dumps({
            "type": "insight",
            "data": {
                "text": "Based on current trends, air quality is expected to improve over the next 24 hours.",
                "timestamp": datetime.datetime.now().isoformat(),
                "category": "air_quality"
            }
        }))
    except Exception as e:
        logger.error(f"Error sending initial data: {e}")

def generate_air_quality_data():
    """Generate simulated air quality data."""
    current_time = datetime.datetime.now()
    
    # Get the last value or generate a new one
    last_value = air_quality_history[-1]['aqi'] if air_quality_history else random.randint(30, 100)
    
    # Generate a new value that's not too far from the last one
    new_value = max(1, min(300, last_value + random.randint(-10, 10)))
    
    # Create the data point
    data_point = {
        'timestamp': current_time.isoformat(),
        'aqi': new_value,
        'location': 'City Center',
        'status': get_aqi_status(new_value)
    }
    
    # Add to history, keeping only the last 24 hours
    air_quality_history.append({
        'timestamp': data_point['timestamp'],
        'aqi': data_point['aqi']
    })
    
    # Keep only the last 24 hours
    if len(air_quality_history) > 24:
        air_quality_history.pop(0)
        
    return data_point

def get_aqi_status(aqi):
    """Get the status description based on AQI value."""
    if aqi <= 50:
        return {"label": "Good", "description": "Air quality is satisfactory, and air pollution poses little or no risk."}
    elif aqi <= 100:
        return {"label": "Moderate", "description": "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution."}
    elif aqi <= 150:
        return {"label": "Unhealthy for Sensitive Groups", "description": "Members of sensitive groups may experience health effects. The general public is less likely to be affected."}
    elif aqi <= 200:
        return {"label": "Unhealthy", "description": "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects."}
    elif aqi <= 300:
        return {"label": "Very Unhealthy", "description": "Health alert: The risk of health effects is increased for everyone."}
    else:
        return {"label": "Hazardous", "description": "Health warning of emergency conditions: everyone is more likely to be affected."}

def update_sustainability_data():
    """Update sustainability scores with small random changes."""
    global sustainability_data
    
    for key in sustainability_data:
        # Update with a small random change
        delta = random.randint(-2, 3)
        sustainability_data[key] = max(0, min(100, sustainability_data[key] + delta))
    
    return {
        "data": sustainability_data,
        "timestamp": datetime.datetime.now().isoformat()
    }

async def fetch_news():
    """Fetch sustainability news from NewsAPI or return cached results."""
    global news_cache, last_news_fetch
    
    # If we have cached news and it's less than 30 minutes old, use it
    current_time = datetime.datetime.now()
    if news_cache and (current_time - last_news_fetch).total_seconds() < 1800:
        return news_cache
    
    # If no API key or no internet, use mock data
    if not NEWS_API_KEY:
        logger.warning("NEWS_API_KEY not set, using mock news data")
        return generate_mock_news()
    
    try:
        url = f"https://newsapi.org/v2/everything?q=sustainability+OR+climate+change+OR+environment&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            articles = response.json().get('articles', [])
            processed_news = []
            
            for article in articles:
                processed_news.append({
                    "title": article.get('title', 'No title'),
                    "url": article.get('url', '#'),
                    "source": article.get('source', {}).get('name', 'Unknown source'),
                    "published_at": article.get('publishedAt', current_time.isoformat())
                })
            
            # Update cache and timestamp
            news_cache = processed_news
            last_news_fetch = current_time
            return processed_news
        else:
            logger.error(f"Failed to fetch news: {response.status_code}")
            return generate_mock_news()
            
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        return generate_mock_news()

def generate_mock_news():
    """Generate mock news when API is unavailable."""
    current_time = datetime.datetime.now().isoformat()
    
    mock_news = [
        {
            "title": "New Renewable Energy Project Launched in Pacific Northwest",
            "url": "#",
            "source": "Sustainability Times",
            "published_at": current_time
        },
        {
            "title": "Climate Change Report Shows Accelerating Effects in Coastal Regions",
            "url": "#",
            "source": "Environmental Review",
            "published_at": current_time
        },
        {
            "title": "Corporate Sustainability Initiatives Leading to Measurable Improvements",
            "url": "#",
            "source": "Business & Environment",
            "published_at": current_time
        },
        {
            "title": "Urban Farming Initiatives Expanding in Major Cities",
            "url": "#",
            "source": "Green Living Today",
            "published_at": current_time
        },
        {
            "title": "Water Conservation Technologies Show Promise in Drought-Affected Areas",
            "url": "#",
            "source": "Water Resource Weekly",
            "published_at": current_time
        }
    ]
    return mock_news

async def generate_insights():
    """Generate periodic insights based on the data."""
    insights = [
        "Air quality has improved by 15% compared to last week's measurements.",
        "Energy efficiency increased by 3% due to recent solar panel installations.",
        "Water conservation efforts have reduced consumption by 7% month-over-month.",
        "Waste recycling rates have exceeded targets by 10% for the second consecutive month.",
        "Carbon emissions are trending downward in line with the annual reduction goals.",
        "The sustainability score has shown consistent improvement over the last 30 days.",
        "Recent policy changes have positively impacted local air quality measurements.",
        "Renewable energy sources now account for 35% of total energy consumption.",
        "Sustainable transportation initiatives have reduced traffic-related emissions by 12%."
    ]
    
    categories = ["air_quality", "energy", "water", "waste", "emissions", "general"]
    
    return {
        "text": random.choice(insights),
        "timestamp": datetime.datetime.now().isoformat(),
        "category": random.choice(categories)
    }

async def data_update_loop():
    """Periodically update and broadcast data to all connected clients."""
    while True:
        try:
            # Only send updates if there are connected clients
            if connected_clients:
                # Update air quality every 1 minute
                if random.random() < 0.2:  # 20% chance of update each loop iteration
                    air_quality_data = generate_air_quality_data()
                    await send_to_all({
                        "type": "air_quality",
                        "data": air_quality_data
                    })
                
                # Update sustainability scores every 2-5 minutes
                if random.random() < 0.1:  # 10% chance of update each loop iteration
                    sustainability_update = update_sustainability_data()
                    await send_to_all({
                        "type": "sustainability_score",
                        "data": sustainability_update["data"],
                        "timestamp": sustainability_update["timestamp"]
                    })
                
                # Update news every 30 minutes
                if random.random() < 0.05:  # 5% chance of update each loop iteration
                    news = await fetch_news()
                    await send_to_all({
                        "type": "news_update",
                        "data": news
                    })
                    
                # Generate insights occasionally
                if random.random() < 0.05:  # 5% chance each iteration
                    insight = await generate_insights()
                    await send_to_all({
                        "type": "insight",
                        "data": insight
                    })
                    
        except Exception as e:
            logger.error(f"Error in data update loop: {e}")
            
        # Wait for 1 minute before the next potential update
        await asyncio.sleep(60)

async def handle_client(websocket, path):
    """Handle a client connection."""
    await register(websocket)
    try:
        async for message in websocket:
            # Parse the message
            try:
                data = json.loads(message)
                # Handle client messages (if any)
                if data.get("type") == "ping":
                    await websocket.send(json.dumps({"type": "pong", "timestamp": datetime.datetime.now().isoformat()}))
            except json.JSONDecodeError:
                logger.warning(f"Received invalid JSON: {message}")
    except websockets.exceptions.ConnectionClosed:
        logger.info("Connection closed")
    finally:
        await unregister(websocket)

async def main():
    """Start the WebSocket server and the data update loop."""
    stop = asyncio.Future()
    
    # Start the data update loop
    data_loop_task = asyncio.create_task(data_update_loop())
    
    # Start the WebSocket server
    server = await websockets.serve(handle_client, HOST, PORT)
    
    logger.info(f"WebSocket server started on ws://{HOST}:{PORT}")
    
    # Handle shutdown gracefully
    def signal_handler():
        logger.info("Shutdown signal received, closing server...")
        for task in [data_loop_task]:
            task.cancel()
        stop.set_result(None)
        
    # Register signal handlers
    for sig in (signal.SIGINT, signal.SIGTERM):
        asyncio.get_event_loop().add_signal_handler(sig, signal_handler)
    
    try:
        await stop
    finally:
        server.close()
        await server.wait_closed()
        logger.info("Server shut down complete")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped by keyboard interrupt")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1) 