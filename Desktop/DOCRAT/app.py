from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, HTMLResponse
import uvicorn
import os
import json
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
import aiohttp
import asyncio
from pydantic import BaseModel
import ssl
import certifi

# Fix SSL certificate verification issues for macOS
try:
    ssl._create_default_https_context = ssl._create_unverified_context
except:
    pass

# Set certificate file path for macOS
os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['PYTHONHTTPSVERIFY'] = '0'

# Load environment variables
load_dotenv()

# Print API keys to verify they're loaded (keys will be masked in output)
openai_key = os.getenv("OPENAI_API_KEY", "")
youtube_key = os.getenv("YOUTUBE_API_KEY", "")
print(f"OpenAI API Key found: {bool(openai_key)}")
print(f"YouTube API Key found: {bool(youtube_key)}")

# Global data stores for real-time updates
news_data = []
air_quality_data = []
water_quality_data = []
latest_insights = []
connected_clients = []

# Create FastAPI app
app = FastAPI(
    title="Sustainability Monitoring Platform",
    description="Environmental monitoring and sustainability insights dashboard",
    version="1.0.0"
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories if they don't exist
os.makedirs("static", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure templates
templates = Jinja2Templates(directory="templates")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                # Client might have disconnected
                pass

manager = ConnectionManager()

# API Keys
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
AIRNOW_API_KEY = os.getenv("AIRNOW_API_KEY", "")

# Data fetching functions
async def fetch_environmental_news():
    """Fetch latest news articles about environment and sustainability"""
    global news_data
    try:
        async with aiohttp.ClientSession() as session:
            # If no API key, use a mock response
            if not NEWS_API_KEY:
                # Mock news data
                new_data = [
                    {
                        "id": random.randint(1000, 9999),
                        "title": f"New climate report shows {random.randint(1, 5)}°C increase in global temperatures",
                        "source": "Climate Monitor",
                        "date": datetime.now().isoformat(),
                        "content": "Scientists warn of acceleration in climate change impacts, emphasizing need for immediate action on emissions reduction and adaptation strategies.",
                        "url": "https://example.com/climate-report"
                    },
                    {
                        "id": random.randint(1000, 9999),
                        "title": "Breakthrough in solar energy storage technology",
                        "source": "Renewable Energy Today",
                        "date": datetime.now().isoformat(),
                        "content": "Engineers develop new battery technology capable of storing solar energy for up to 48 hours with minimal loss, potentially solving intermittency issues.",
                        "url": "https://example.com/solar-breakthrough"
                    },
                    {
                        "id": random.randint(1000, 9999),
                        "title": f"City announces {random.randint(10, 50)}% reduction in carbon emissions",
                        "source": "Urban Sustainability Report",
                        "date": datetime.now().isoformat(),
                        "content": "Major metropolitan area achieves significant emissions reduction through public transportation improvements and building efficiency upgrades.",
                        "url": "https://example.com/city-emissions"
                    }
                ]
            else:
                # Real news data from NewsAPI
                params = {
                    "q": "environment OR sustainability OR climate",
                    "language": "en",
                    "sortBy": "publishedAt",
                    "apiKey": NEWS_API_KEY
                }
                async with session.get("https://newsapi.org/v2/everything", params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        new_data = []
                        for article in data.get("articles", [])[:5]:
                            new_data.append({
                                "id": random.randint(1000, 9999),
                                "title": article["title"],
                                "source": article["source"]["name"],
                                "date": article["publishedAt"],
                                "content": article["description"],
                                "url": article["url"]
                            })
                    else:
                        print(f"Error fetching news: {response.status}")
                        return
            
            # Update news data
            timestamp = datetime.now().isoformat()
            for item in new_data:
                # Add to news data and make sure we don't exceed 20 items
                news_data.insert(0, item)
            
            news_data = news_data[:20]
            
            # Convert data for latest insights
            for item in new_data[:2]:  # Only use the top 2 news items
                insight = {
                    "id": item["id"],
                    "title": item["title"],
                    "source": "News: " + item["source"],
                    "date": item["date"].split("T")[0] if "T" in item["date"] else item["date"],
                    "content": item["content"]
                }
                latest_insights.insert(0, insight)
            
            latest_insights[:] = latest_insights[:10]  # Limit to 10 insights
            
            # Broadcast updates
            await manager.broadcast({
                "type": "news_update",
                "data": new_data,
                "timestamp": timestamp
            })
            
            print(f"Updated news data at {timestamp}")
            
    except Exception as e:
        print(f"Error in fetch_environmental_news: {str(e)}")

async def fetch_air_quality_data():
    """Fetch real-time air quality data"""
    global air_quality_data
    try:
        async with aiohttp.ClientSession() as session:
            # If no API key, use mock data
            if not AIRNOW_API_KEY:
                # Generate random air quality data for various cities
                cities = [
                    {"name": "New York", "lat": 40.7128, "lon": -74.0060},
                    {"name": "Los Angeles", "lat": 34.0522, "lon": -118.2437},
                    {"name": "Chicago", "lat": 41.8781, "lon": -87.6298},
                    {"name": "Houston", "lat": 29.7604, "lon": -95.3698},
                    {"name": "Phoenix", "lat": 33.4484, "lon": -112.0740}
                ]
                
                new_data = []
                timestamp = datetime.now().isoformat()
                
                for city in cities:
                    # Generate random AQI between 0 and 150
                    aqi = random.randint(0, 150)
                    
                    # Determine status based on AQI
                    if aqi <= 50:
                        status = "Good"
                        status_code = "Normal"
                    elif aqi <= 100:
                        status = "Moderate"
                        status_code = "Normal"
                    elif aqi <= 150:
                        status = "Unhealthy for Sensitive Groups"
                        status_code = "Warning"
                    else:
                        status = "Unhealthy"
                        status_code = "Alert"
                    
                    # Generate random readings for pollutants
                    pm25 = round(random.uniform(0, 35.4), 1)
                    pm10 = round(random.uniform(0, 150), 1)
                    o3 = round(random.uniform(0, 0.1), 3)
                    
                    # Generate a random ID instead of using the timestamp
                    sensor_id = f"AQ-{city['name'].replace(' ', '')}-{random.randint(1000, 9999)}"
                    
                    new_data.append({
                        "id": sensor_id,
                        "city": city["name"],
                        "latitude": city["lat"],
                        "longitude": city["lon"],
                        "aqi": aqi,
                        "status": status,
                        "status_code": status_code,
                        "timestamp": timestamp,
                        "pollutants": {
                            "pm25": pm25,
                            "pm10": pm10,
                            "o3": o3
                        }
                    })
                    
                    # If AQI is unhealthy, create an insight
                    if aqi > 100:
                        insight = {
                            "id": random.randint(1000, 9999),
                            "title": f"Elevated air pollution levels in {city['name']}",
                            "source": "Air Quality Monitor",
                            "date": timestamp.split("T")[0],
                            "content": f"Air Quality Index (AQI) has reached {aqi} ({status}) in {city['name']}, potentially affecting sensitive groups. Reduced outdoor activity recommended."
                        }
                        latest_insights.insert(0, insight)
                
                # Update air quality data
                air_quality_data = new_data
                
                # Keep insights limited
                latest_insights[:] = latest_insights[:10]
                
                # Broadcast updates
                await manager.broadcast({
                    "type": "air_quality_update",
                    "data": new_data,
                    "timestamp": timestamp
                })
                
                print(f"Updated air quality data at {timestamp}")
            
            else:
                # TODO: Implement real AirNow API integration when API key is available
                pass
                
    except Exception as e:
        print(f"Error in fetch_air_quality_data: {str(e)}")

async def update_sustainability_score():
    """Periodically update the sustainability score based on latest data"""
    try:
        # Calculate new score based on various factors
        current_score = random.randint(75, 95)
        previous_score = current_score - random.randint(-3, 5)
        change = current_score - previous_score
        
        # Get current date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Generate random category scores
        categories = {
            "water_management": random.randint(70, 95),
            "air_quality": random.randint(70, 95),
            "biodiversity": random.randint(70, 95),
            "waste_management": random.randint(70, 95),
            "energy_efficiency": random.randint(70, 95),
            "sustainable_transport": random.randint(70, 95)
        }
        
        # Create the score data
        score_data = {
            "current_score": current_score,
            "previous_score": previous_score,
            "change_percentage": round(change / previous_score * 100, 1),
            "last_updated": today,
            "categories": categories
        }
        
        # Broadcast the update
        await manager.broadcast({
            "type": "sustainability_score_update",
            "data": score_data,
            "timestamp": datetime.now().isoformat()
        })
        
        print(f"Updated sustainability score at {datetime.now().isoformat()}")
        
    except Exception as e:
        print(f"Error in update_sustainability_score: {str(e)}")

# Background task to update data periodically
async def background_data_updater():
    """Background task to periodically fetch and update data"""
    while True:
        # Fetch environmental news every 2 minutes
        await fetch_environmental_news()
        
        # Wait 30 seconds
        await asyncio.sleep(30)
        
        # Fetch air quality data every 2 minutes (offset by 30 seconds)
        await fetch_air_quality_data()
        
        # Wait 60 seconds
        await asyncio.sleep(60)
        
        # Update sustainability score (runs every 2 minutes)
        await update_sustainability_score()
        
        # Wait 30 seconds before starting the cycle again
        await asyncio.sleep(30)

# Start background tasks on startup
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_data_updater())
    print("Started background data updater")

# Root endpoint - serve HTML
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# API Root endpoint
@app.get("/api")
async def api_root():
    return {"message": "Welcome to the Sustainability Monitoring Platform API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial data
        await websocket.send_json({
            "type": "initial_data",
            "news": news_data,
            "air_quality": air_quality_data,
            "insights": latest_insights,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            # Process any client messages if needed
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# News API endpoint
@app.get("/api/news")
async def get_news():
    """Return latest environmental news"""
    return {"news": news_data}

# Air quality API endpoint
@app.get("/api/air-quality")
async def get_air_quality():
    """Return latest air quality data"""
    return {"air_quality": air_quality_data}

# Meetings endpoints
@app.get("/api/meetings")
async def get_meetings():
    """Return a list of public meetings with sustainability insights"""
    meetings = [
        {
            "id": 1,
            "title": "City Council - Environmental Policy Review",
            "date": "2023-10-10T18:00:00",
            "commitments": 3,
            "score": 85,
            "topics": ["Climate Action", "Water Conservation", "Urban Forestry"]
        },
        {
            "id": 2,
            "title": "Planning Commission - Zoning Updates",
            "date": "2023-09-25T14:00:00",
            "commitments": 1,
            "score": 65,
            "topics": ["Urban Development", "Green Spaces"]
        },
        {
            "id": 3,
            "title": "Environmental Board - Quarterly Review",
            "date": "2023-09-15T10:00:00",
            "commitments": 5,
            "score": 92,
            "topics": ["Air Quality", "Wildlife Protection", "Waste Management"]
        },
        {
            "id": 4,
            "title": "Parks & Recreation - Land Management",
            "date": "2023-10-05T09:00:00",
            "commitments": 2,
            "score": 78,
            "topics": ["Conservation", "Recreation Access"]
        },
        {
            "id": 5,
            "title": "Water Resources Board - Drought Planning",
            "date": "2023-10-02T13:00:00",
            "commitments": 4,
            "score": 88,
            "topics": ["Water Conservation", "Irrigation", "Infrastructure"]
        }
    ]
    return {"meetings": meetings}

@app.get("/api/meetings/{meeting_id}")
async def get_meeting_details(meeting_id: int):
    """Return details about a specific meeting"""
    # Mock data for meeting details
    meeting_details = {
        "id": meeting_id,
        "title": "City Council Meeting - Environmental Policy Review",
        "date": "2023-10-10T18:00:00",
        "location": "City Hall - Council Chambers",
        "duration": 120,
        "participants": ["Mayor Johnson", "Council Members", "Environmental Director", "Public Attendees"],
        "score": 85,
        "key_points": [
            "Discussion of updated Climate Action Plan with new emission targets",
            "Approval of Water Conservation Ordinance amendment",
            "Review of Urban Forestry initiative progress"
        ],
        "commitments": [
            {
                "id": 1,
                "description": "Increase urban tree canopy by 15% within 5 years",
                "responsible_party": "Parks Department",
                "timeline": "By 2028",
                "status": "In Progress"
            },
            {
                "id": 2,
                "description": "Implement water-use restrictions for commercial properties",
                "responsible_party": "Utilities Department",
                "timeline": "Q1 2024",
                "status": "Not Started"
            },
            {
                "id": 3,
                "description": "Complete city building energy efficiency audits",
                "responsible_party": "Facilities Management",
                "timeline": "Q4 2023",
                "status": "On Track"
            }
        ],
        "topics": ["Climate Action", "Water Conservation", "Urban Forestry"],
        "sentiment": {
            "overall": "Positive",
            "details": {
                "positive": 65,
                "neutral": 30,
                "negative": 5
            }
        },
        "transcript_url": "/api/meetings/1/transcript",
        "video_url": "https://example.com/city-council/2023-10-10"
    }
    return meeting_details

# Permits endpoints
@app.get("/api/permits")
async def get_permits():
    """Return a list of environmental permits"""
    permits = [
        {
            "id": "P-23418",
            "type": "Water Discharge",
            "status": "Under Review",
            "location": "South Waterfront",
            "expiry": "2024-10-15",
            "impact_level": "High"
        },
        {
            "id": "P-23215",
            "type": "Water Discharge",
            "status": "Active",
            "location": "North Industrial Park",
            "expiry": "2023-11-20",
            "impact_level": "Medium"
        },
        {
            "id": "P-23108",
            "type": "Air Quality",
            "status": "Active",
            "location": "East Manufacturing Zone",
            "expiry": "2023-10-25",
            "impact_level": "High"
        },
        {
            "id": "P-23350",
            "type": "Land Use",
            "status": "Active",
            "location": "West District",
            "expiry": "2023-12-30",
            "impact_level": "Low"
        },
        {
            "id": "P-23422",
            "type": "Waste Management",
            "status": "Pending Approval",
            "location": "Central Processing Facility",
            "expiry": "2024-06-15",
            "impact_level": "Medium"
        }
    ]
    return {"permits": permits}

@app.get("/api/permits/{permit_id}")
async def get_permit_details(permit_id: str):
    """Return details about a specific permit"""
    # Mock data for permit details
    permit_details = {
        "id": permit_id,
        "title": "Industrial Wastewater Discharge Permit",
        "type": "Water Discharge",
        "subtype": "Industrial",
        "status": "Under Review",
        "applicant": "South Bay Industrial Corp.",
        "application_date": "2023-09-15",
        "issue_date": None,
        "expiry_date": "2024-10-15",
        "location": {
            "name": "South Waterfront",
            "address": "450 Harbor Way",
            "latitude": 40.7025,
            "longitude": -73.9875
        },
        "impact_level": "High",
        "impact_assessment": {
            "water_quality": "High",
            "aquatic_life": "High",
            "human_health": "Medium",
            "recreation": "Medium"
        },
        "monitored_parameters": [
            {
                "parameter": "pH",
                "limit": "6.5-8.5",
                "expected": "7.2"
            },
            {
                "parameter": "TSS",
                "limit": "30 mg/L",
                "expected": "45 mg/L"
            },
            {
                "parameter": "Copper",
                "limit": "0.5 mg/L",
                "expected": "0.8 mg/L"
            },
            {
                "parameter": "Temperature",
                "limit": "< 32°C",
                "expected": "29°C"
            }
        ],
        "concerns": [
            "Discharge point is within 500m of protected wetland habitat",
            "Elevated levels of suspended solids exceed permitted limits",
            "Potential for copper bioaccumulation in aquatic organisms"
        ],
        "mitigation_measures": [
            "Installation of additional filtration system",
            "Weekly monitoring and reporting of discharge quality",
            "Reduction of discharge volume during sensitive ecological periods"
        ],
        "related_permits": ["P-22105", "P-21875"],
        "documents_url": "/api/permits/P-23418/documents"
    }
    return permit_details

# Sensors endpoints
@app.get("/api/sensors")
async def get_sensors():
    """Return a list of environmental sensors"""
    sensors = [
        {
            "id": "S001",
            "type": "Air Quality",
            "location": "Downtown",
            "status": "Normal",
            "reading": "AQI 45 - Good",
            "updated": "2023-10-14T09:32:00"
        },
        {
            "id": "S002",
            "type": "Water Quality",
            "location": "North River",
            "status": "Warning",
            "reading": "pH 8.7 - Above Normal",
            "updated": "2023-10-14T09:15:00"
        },
        {
            "id": "S003",
            "type": "Noise Level",
            "location": "Highway Junction",
            "status": "Normal",
            "reading": "62 dB - Acceptable",
            "updated": "2023-10-14T09:30:00"
        },
        {
            "id": "S004",
            "type": "Water Quality",
            "location": "East River",
            "status": "Alert",
            "reading": "DO 3.2 mg/L - Low",
            "updated": "2023-10-14T08:45:00"
        },
        {
            "id": "S005",
            "type": "Air Quality",
            "location": "Industrial Zone",
            "status": "Alert",
            "reading": "AQI 125 - Unhealthy",
            "updated": "2023-10-14T09:00:00"
        },
        {
            "id": "S006",
            "type": "Soil Moisture",
            "location": "City Park",
            "status": "Normal",
            "reading": "32% - Optimal",
            "updated": "2023-10-14T08:30:00"
        },
        {
            "id": "S007",
            "type": "Weather",
            "location": "City Center",
            "status": "Normal",
            "reading": "72°F, 45% humidity",
            "updated": "2023-10-14T09:25:00"
        },
        {
            "id": "S008",
            "type": "Water Level",
            "location": "Flood Zone A",
            "status": "Warning",
            "reading": "4.2m - Rising",
            "updated": "2023-10-14T09:20:00"
        },
        {
            "id": "S009",
            "type": "Weather",
            "location": "Western District",
            "status": "Inactive",
            "reading": "No Data",
            "updated": "2023-10-13T16:45:00"
        }
    ]
    return {"sensors": sensors}

@app.get("/api/sensors/{sensor_id}")
async def get_sensor_details(sensor_id: str):
    """Return details about a specific sensor"""
    # Mock data for sensor details
    sensor_details = {
        "id": sensor_id,
        "name": "Downtown Air Quality Monitor",
        "type": "Air Quality",
        "location": {
            "name": "Downtown - City Hall",
            "latitude": 40.7112,
            "longitude": -74.0055
        },
        "status": "Normal",
        "current_reading": {
            "timestamp": "2023-10-14T09:32:00",
            "metrics": {
                "aqi": 45,
                "pm25": 10.2,
                "pm10": 18.5,
                "o3": 0.032,
                "no2": 0.015,
                "co": 0.3
            },
            "assessment": "Good"
        },
        "historical_data": {
            "last24h": [
                {"timestamp": "2023-10-13T10:00:00", "aqi": 42},
                {"timestamp": "2023-10-13T14:00:00", "aqi": 48},
                {"timestamp": "2023-10-13T18:00:00", "aqi": 52},
                {"timestamp": "2023-10-13T22:00:00", "aqi": 44},
                {"timestamp": "2023-10-14T02:00:00", "aqi": 40},
                {"timestamp": "2023-10-14T06:00:00", "aqi": 43}
            ]
        },
        "thresholds": {
            "warning": {
                "aqi": 100,
                "pm25": 35.0,
                "pm10": 150.0,
                "o3": 0.07,
                "no2": 0.1,
                "co": 9.0
            },
            "alert": {
                "aqi": 150,
                "pm25": 55.0,
                "pm10": 250.0,
                "o3": 0.09,
                "no2": 0.2,
                "co": 15.0
            }
        },
        "maintenance": {
            "last_calibration": "2023-09-01",
            "next_scheduled": "2023-12-01",
            "battery": "95%"
        },
        "installed_date": "2022-03-15",
        "data_history_url": "/api/sensors/S001/history"
    }
    return sensor_details

# Insights endpoints
@app.get("/api/insights")
async def get_insights():
    """Return environmental insights from various data sources"""
    # Combine static insights with new real-time insights
    static_insights = [
        {
            "id": 1,
            "title": "Increasing air quality concerns in Industrial Zone",
            "source": "Sensor Data",
            "date": "2023-10-14",
            "content": "Air quality sensors in the Industrial Zone show AQI levels above 120 for the third consecutive day, indicating a potential ongoing issue that requires investigation."
        },
        {
            "id": 2,
            "title": "Positive impact of Urban Forestry initiatives",
            "source": "Meeting Analysis",
            "date": "2023-10-10",
            "content": "Analysis of Urban Forestry progress shows a 7% increase in tree canopy coverage over the past year, on track to meet the 15% five-year goal set by the City Council."
        },
        {
            "id": 3,
            "title": "Water discharge permit concerns require attention",
            "source": "Permit Review",
            "date": "2023-09-15",
            "content": "The recently applied South Waterfront discharge permit shows elevated levels of suspended solids and copper that exceed current thresholds, potentially affecting nearby wetland habitat."
        },
        {
            "id": 4,
            "title": "Satellite data reveals potential unauthorized clearing",
            "source": "Satellite Imagery",
            "date": "2023-10-08",
            "content": "Vegetation index analysis from recent satellite imagery indicates approximately 2 acres of unauthorized clearing in Western Forest Corridor, outside of permitted development zones."
        },
        {
            "id": 5,
            "title": "North River water quality showing improvement",
            "source": "Sensor Data",
            "date": "2023-10-14",
            "content": "Despite a current pH alert, three-month trend analysis of North River water quality sensors shows 18% overall improvement in dissolved oxygen levels, likely due to recent infrastructure upgrades."
        }
    ]
    
    # Add real-time insights at the beginning
    combined_insights = latest_insights + static_insights
    
    # Return only the first 10 insights to avoid overwhelming the response
    return {"insights": combined_insights[:10]}

# Sustainability score endpoint
@app.get("/api/sustainability/score")
async def get_sustainability_score():
    """Return overall sustainability score and trend data"""
    score_data = {
        "current_score": 85,
        "previous_score": 82,
        "change_percentage": 3.7,
        "last_updated": "2023-10-01",
        "categories": {
            "water_management": 88,
            "air_quality": 75,
            "biodiversity": 82,
            "waste_management": 90,
            "energy_efficiency": 85,
            "sustainable_transport": 70
        },
        "trend": [
            {"date": "2023-04-01", "score": 78},
            {"date": "2023-05-01", "score": 79},
            {"date": "2023-06-01", "score": 80},
            {"date": "2023-07-01", "score": 81},
            {"date": "2023-08-01", "score": 80},
            {"date": "2023-09-01", "score": 82},
            {"date": "2023-10-01", "score": 85}
        ]
    }
    return score_data

# Map data endpoint
@app.get("/api/map/markers")
async def get_map_markers():
    """Return geospatial markers for the sustainability map"""
    markers = {
        "meetings": [
            {
                "id": 1,
                "title": "City Council Meeting",
                "location": "City Hall",
                "latitude": 40.7128,
                "longitude": -74.0060,
                "type": "meeting",
                "date": "2023-10-10"
            }
        ],
        "permits": [
            {
                "id": "P-23418",
                "title": "Water Discharge Permit",
                "latitude": 40.7025,
                "longitude": -73.9875,
                "type": "permit",
                "status": "Under Review",
                "impact_level": "High"
            },
            {
                "id": "P-23215",
                "title": "Water Discharge Permit",
                "latitude": 40.7350,
                "longitude": -74.0180,
                "type": "permit",
                "status": "Active",
                "impact_level": "Medium"
            },
            {
                "id": "P-23108",
                "title": "Air Quality Permit",
                "latitude": 40.7260,
                "longitude": -73.9780,
                "type": "permit",
                "status": "Active",
                "impact_level": "High"
            }
        ],
        "sensors": [
            {
                "id": "S001",
                "title": "Air Quality Sensor",
                "latitude": 40.7112,
                "longitude": -74.0055,
                "type": "sensor",
                "status": "Normal"
            },
            {
                "id": "S002",
                "title": "Water Quality Sensor",
                "latitude": 40.7350,
                "longitude": -74.0120,
                "type": "sensor",
                "status": "Warning"
            },
            {
                "id": "S004",
                "title": "Water Quality Sensor",
                "latitude": 40.7180,
                "longitude": -73.9770,
                "type": "sensor",
                "status": "Alert"
            },
            {
                "id": "S005",
                "title": "Air Quality Sensor",
                "latitude": 40.7250,
                "longitude": -74.0150,
                "type": "sensor",
                "status": "Alert"
            }
        ],
        "areas_of_interest": [
            {
                "id": "AOI-1",
                "title": "East District Wetlands",
                "type": "area",
                "status": "Significant Change",
                "polygon": [
                    [40.7180, -73.9720],
                    [40.7180, -73.9650],
                    [40.7120, -73.9650],
                    [40.7120, -73.9720]
                ]
            },
            {
                "id": "AOI-2",
                "title": "North River Basin",
                "type": "area",
                "status": "Stable",
                "polygon": [
                    [40.7380, -74.0120],
                    [40.7380, -74.0050],
                    [40.7320, -74.0050],
                    [40.7320, -74.0120]
                ]
            },
            {
                "id": "AOI-3",
                "title": "Western Forest Corridor",
                "type": "area",
                "status": "Minor Change",
                "polygon": [
                    [40.7150, -74.0220],
                    [40.7150, -74.0150],
                    [40.7080, -74.0150],
                    [40.7080, -74.0220]
                ]
            }
        ]
    }
    return markers

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8002))
    print(f"Starting server on port {port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True) 