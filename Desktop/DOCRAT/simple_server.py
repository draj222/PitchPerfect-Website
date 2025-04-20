from fastapi import FastAPI, Request, Form, UploadFile, File, Query, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
import uvicorn
import os
import json
import re
import ssl
import certifi
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
import urllib.parse
import traceback
import platform
import time
from models import Permit, PermitType, PermitStatus, PermitCreate, PermitResponse
from models import SensorData, SensorType, SensorDataCreate, SensorDataResponse
from models import RemoteSensingImage, ImageSource, RemoteSensingImageCreate, RemoteSensingImageResponse
import uuid
import math
import asyncio
import youtube_search

# Import our YouTube search module
try:
    from youtube_search import auto_find_meetings, search_government_meetings, extract_video_id
    YOUTUBE_SEARCH_AVAILABLE = True
except ImportError:
    YOUTUBE_SEARCH_AVAILABLE = False
    print("Warning: youtube_search.py module not found. Auto-discovery of YouTube videos will be limited.")

# Import pytube for YouTube video extraction
try:
    from pytube import YouTube
    PYTUBE_AVAILABLE = True
except ImportError:
    PYTUBE_AVAILABLE = False
    print("Warning: pytube not installed. YouTube extraction will be limited.")

# Fixed YouTube extraction function for Python 3.12
def extract_from_youtube(youtube_url: str) -> Dict[Any, Any]:
    """Extract transcript and metadata from a YouTube video"""
    try:
        # Validate YouTube URL
        if not ("youtube.com" in youtube_url or "youtu.be" in youtube_url):
            raise ValueError(f"Invalid YouTube URL: {youtube_url}")
            
        # Extract video ID
        try:
            video_id = youtube_search.extract_video_id(youtube_url)
        except Exception as e:
            print(f"Error extracting video ID: {str(e)}")
            video_id = None
            
        if not video_id:
            print(f"Could not extract video ID from URL: {youtube_url}")
            return generate_mock_extraction_data(youtube_url)
        
        # Check if pytube is available
        try:
            from pytube import YouTube
        except ImportError:
            print("pytube not installed, using mock data")
            return generate_mock_extraction_data(youtube_url)
            
        # Configure SSL context for pytube
        ssl._create_default_https_context = ssl._create_unverified_context
            
        # Download transcript from YouTube
        try:
            yt = YouTube(youtube_url)
            
            # Get captions
            caption_tracks = yt.captions
            transcript_text = ""
            
            # Try to get English captions first
            en_caption = None
            for caption in caption_tracks:
                if caption.code.startswith(('en', 'a.en')):
                    en_caption = caption
                    break
                    
            # If no English captions, use first available
            if en_caption:
                transcript_text = en_caption.generate_srt_captions()
            elif caption_tracks:
                transcript_text = caption_tracks[0].generate_srt_captions()
            else:
                print("No captions found for this video")
                return generate_mock_extraction_data(youtube_url)
                
            # Clean up the transcript text (remove SRT formatting)
            transcript_text = re.sub(r'\d+\n\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+\n', '', transcript_text)
            transcript_text = re.sub(r'<[^>]+>', '', transcript_text)
            
            # Truncate if too long to prevent token issues with API
            if len(transcript_text) > 15000:
                transcript_text = transcript_text[:15000] + "... [text truncated due to length]"
                
            # Get video metadata
            video_info = {
                "title": yt.title,
                "description": yt.description,
                "author": yt.author,
                "publish_date": str(yt.publish_date) if yt.publish_date else None,
                "length": yt.length,
                "views": yt.views,
                "url": youtube_url,
                "video_id": video_id
            }
            
            return {
                "transcript": transcript_text,
                "video_info": video_info,
                "source": "youtube_captions"
            }
            
        except Exception as e:
            print(f"Error extracting from YouTube: {str(e)}")
            return generate_mock_extraction_data(youtube_url)
            
    except Exception as e:
        print(f"Error in extract_from_youtube: {str(e)}")
        return generate_mock_extraction_data(youtube_url)

def generate_mock_extraction_data(youtube_url: str, video_id: str = None) -> Dict[Any, Any]:
    """
    Generate mock extraction data when YouTube extraction fails
    
    Args:
        youtube_url: The YouTube URL that was attempted
        video_id: The video ID if it was successfully extracted
        
    Returns:
        Mock extraction data
    """
    if not video_id and "youtube.com/watch" in youtube_url:
        try:
            video_id = youtube_url.split("v=")[1].split("&")[0]
        except:
            video_id = "unknown_video_id"
    elif not video_id:
        video_id = "unknown_video_id"
        
    # Sample transcript for common sustainability meeting topics
    sample_transcripts = [
        "Today we are discussing the city's climate action plan. We need to reduce emissions by 50% by 2030 to meet our goals. The committee proposed several initiatives including expanding public transportation, improving building efficiency standards, and increasing renewable energy capacity.",
        "The environmental impact assessment for the new development project shows minimal disruption to local wildlife habitats. We've implemented stormwater management systems and plan to add 150 new trees to the site.",
        "Water quality testing results from the river showed elevated levels of pollutants after the recent rainfall. We need to address runoff from agricultural areas and improve our wastewater treatment capabilities.",
        "The sustainability committee presented findings from the annual carbon footprint audit. Municipal operations have reduced emissions by 12% compared to last year, primarily due to fleet electrification and building retrofits.",
        "Public comments today focused on concerns about the waste management contract renewal. Citizens advocated for improved recycling programs and establishing a community composting initiative."
    ]
    
    # Use a consistent sample based on video_id to ensure same mock data for same video
    sample_index = hash(video_id) % len(sample_transcripts) if video_id else 0
    mock_transcript = sample_transcripts[sample_index]
    
    return {
        "title": f"Meeting about Sustainability and Environmental Planning (Mock Data)",
        "author": "City Council",
        "publish_date": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
        "length": random.randint(1800, 7200),  # 30-120 minutes
        "views": random.randint(100, 5000),
        "video_id": video_id,
        "thumbnail_url": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg" if video_id else None,
        "url": youtube_url,
        "transcript": mock_transcript,
        "source": "mock_data",
        "note": "This is mock data generated because actual YouTube extraction failed or is unavailable"
    }

# Try to import OpenAI (optional)
try:
    import openai
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: openai not installed. AI summarization will be limited.")

# Fix SSL certificate verification issue on macOS
try:
    # First attempt: create unverified context
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

# Additional fix for macOS Python certificate issues
if platform.system() == 'Darwin':
    # Path to certificates file on macOS
    os.environ['SSL_CERT_FILE'] = certifi.where()
    os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
    # For pytube specifically
    os.environ['PYTHONHTTPSVERIFY'] = '0'

# Load environment variables
load_dotenv()

# Configure OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
print(f"OpenAI API Key found: {bool(OPENAI_API_KEY)}")
if OPENAI_API_KEY and OPENAI_AVAILABLE:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        print("OpenAI client initialized successfully")
        # Test the client
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Test connection"}],
            max_tokens=5
        )
        print(f"OpenAI test response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"Error initializing OpenAI client: {str(e)}")
        print("Continuing with mock OpenAI responses enabled")
        openai_client = "mock"  # Use a string to indicate mock mode
else:
    print("No OpenAI API key or package, using mock responses")
    openai_client = "mock"  # Use a string to indicate mock mode

# Create FastAPI app
app = FastAPI(
    title=os.getenv("API_TITLE", "Public Meeting Insights API"),
    description="AI-powered public meeting analysis and search platform",
    version="1.0.0",
    docs_url=None,  # Disable Swagger UI
    redoc_url=None,  # Disable ReDoc UI
    openapi_url=None  # Disable OpenAPI schema
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

# Mock data for meetings
mock_meetings = [
    {
        "id": 1,
        "title": "City Council Meeting - April 25, 2023",
        "date": "2023-04-25T18:00:00",
        "duration": "2 hours 15 minutes",
        "location": "City Hall, Room 201",
        "attendees": ["Mayor Johnson", "Council Member Williams", "Council Member Chen", 
                     "Council Member Rodriguez", "Council Member Smith"],
        "topics": ["Budget Approval", "Infrastructure Projects", "Parks Renovation"],
        "transcript_summary": "The council discussed the annual budget allocation with emphasis on infrastructure development. Council Member Williams raised concerns about the parks renovation timeline. The budget was approved with a 4-1 vote, with Council Member Chen voting against.",
        "key_decisions": [
            "Annual budget approved (4-1 vote)",
            "Infrastructure project on Main Street to begin June 2023",
            "Parks renovation delayed until Q3 2023"
        ],
        "sentiment": {
            "overall": "neutral",
            "topics": {
                "Budget": "somewhat negative",
                "Infrastructure": "positive",
                "Parks": "negative"
            }
        }
    },
    {
        "id": 2,
        "title": "Planning Committee - April 20, 2023",
        "date": "2023-04-20T15:30:00",
        "duration": "1 hour 45 minutes",
        "location": "City Hall, Room 105",
        "attendees": ["Director Peterson", "Committee Member Lee", "Committee Member Jackson", 
                     "Committee Member Garcia"],
        "topics": ["Zoning Changes", "Permit Applications", "New Development Projects"],
        "transcript_summary": "The committee reviewed zoning changes for the downtown area. Multiple permit applications were approved for small businesses. A contentious discussion occurred regarding the new residential development on Oak Street, with community members expressing concerns about traffic.",
        "key_decisions": [
            "Downtown zoning changes approved unanimously",
            "15 new business permits granted",
            "Oak Street development sent back for traffic impact revision"
        ],
        "sentiment": {
            "overall": "mixed",
            "topics": {
                "Zoning": "positive",
                "Permits": "positive",
                "Development": "somewhat negative"
            }
        }
    }
]

# Load configuration
load_dotenv()

# Industry configuration
SUPPORTED_INDUSTRIES = [
    "city_government",
    "healthcare",
    "education",
    "finance",
    "technology",
    "energy",
    "transportation",
    "real_estate"
]

# Default to city government if not specified
DEFAULT_INDUSTRY = "city_government"
CURRENT_INDUSTRY = os.getenv("INDUSTRY", DEFAULT_INDUSTRY)

# Business focus areas within each industry
INDUSTRY_FOCUS_AREAS = {
    "city_government": [
        "Urban Planning",
        "Public Safety",
        "Infrastructure",
        "Parks & Recreation",
        "Budget & Finance",
        "Economic Development",
        "Environmental Services",
        "Community Services"
    ],
    "healthcare": [
        "Hospital Administration",
        "Medical Devices",
        "Pharmaceuticals",
        "Insurance & Billing",
        "Health IT",
        "Public Health",
        "Clinical Services",
        "Medical Research"
    ],
    "education": [
        "K-12 Schools",
        "Higher Education",
        "EdTech",
        "Special Education",
        "Vocational Training",
        "Educational Policy",
        "School Administration",
        "Curriculum Development"
    ],
    "finance": [
        "Banking",
        "Investment Management",
        "Insurance",
        "Fintech",
        "Retirement Planning",
        "Financial Regulation",
        "Corporate Finance",
        "Public Finance"
    ],
    "technology": [
        "Software Development",
        "Cybersecurity",
        "Data & Analytics",
        "Cloud Computing",
        "Telecommunications",
        "AI/Machine Learning",
        "IT Services",
        "Hardware Manufacturing"
    ],
    "energy": [
        "Renewable Energy",
        "Oil & Gas",
        "Utilities",
        "Energy Distribution",
        "Energy Storage",
        "Carbon Management",
        "Energy Efficiency",
        "Energy Policy"
    ],
    "transportation": [
        "Public Transit",
        "Logistics",
        "Automotive",
        "Aviation",
        "Maritime",
        "Rail",
        "Urban Mobility",
        "Transportation Policy"
    ],
    "real_estate": [
        "Commercial Development",
        "Residential Development",
        "Property Management",
        "Construction",
        "Urban Planning",
        "Real Estate Finance",
        "Affordable Housing",
        "Land Use"
    ]
}

# Current business focus areas (multiple can be selected)
CURRENT_FOCUS_AREAS = os.getenv("FOCUS_AREAS", "").split(",") if os.getenv("FOCUS_AREAS") else []

# Additional focus-specific keywords
FOCUS_KEYWORDS = {
    # City Government
    "Urban Planning": ["zoning", "land use", "development", "comprehensive plan", "master plan"],
    "Public Safety": ["police", "fire", "emergency", "safety", "crime", "enforcement"],
    "Infrastructure": ["roads", "bridges", "utilities", "maintenance", "capital improvements"],
    "Parks & Recreation": ["parks", "recreation", "open space", "facilities", "programs"],
    "Budget & Finance": ["budget", "finance", "taxes", "revenue", "expenditures", "fiscal"],
    "Economic Development": ["economic", "business", "jobs", "growth", "incentives", "development"],
    "Environmental Services": ["environmental", "sustainability", "waste", "water", "conservation"],
    "Community Services": ["community", "social", "human services", "programs", "outreach"],
    
    # Healthcare
    "Hospital Administration": ["operations", "staffing", "facilities", "patient care", "quality"],
    "Medical Devices": ["devices", "equipment", "technology", "implants", "diagnostic"],
    "Pharmaceuticals": ["drugs", "medication", "clinical trials", "prescriptions", "pharmacy"],
    "Insurance & Billing": ["coverage", "claims", "reimbursement", "payment", "coding"],
    "Health IT": ["electronic records", "telehealth", "digital health", "data", "systems"],
    "Public Health": ["population health", "prevention", "community health", "epidemiology"],
    "Clinical Services": ["patient care", "treatment", "protocols", "standards", "specialties"],
    "Medical Research": ["clinical research", "studies", "trials", "funding", "innovation"],
    
    # Continue with other industries...
    # Education
    "K-12 Schools": ["elementary", "secondary", "district", "student achievement", "testing"],
    "Higher Education": ["university", "college", "campus", "academic", "faculty", "tuition"],
    "EdTech": ["learning technology", "digital", "platforms", "online learning", "software"],
    "Special Education": ["accommodations", "IEP", "disabilities", "services", "inclusion"],
    
    # Add more as needed for other industries
}

# Industry-specific sources and keywords
INDUSTRY_SOURCES = {
    "city_government": [
        {"name": "City Council", "base_url": "https://www.citycouncil.gov/meetings", "frequency": "weekly"},
        {"name": "Planning Commission", "base_url": "https://www.planning.gov/hearings", "frequency": "bi-weekly"},
        {"name": "Budget Committee", "base_url": "https://www.finance.gov/budget", "frequency": "monthly"}
    ],
    "healthcare": [
        {"name": "Hospital Board", "base_url": "https://www.centralhospital.org/board", "frequency": "monthly"},
        {"name": "Public Health Commission", "base_url": "https://www.publichealthdept.gov/meetings", "frequency": "bi-weekly"},
        {"name": "Medical Ethics Committee", "base_url": "https://www.medicalboard.org/ethics", "frequency": "quarterly"}
    ],
    "education": [
        {"name": "School Board", "base_url": "https://www.schooldistrict.edu/board", "frequency": "bi-weekly"},
        {"name": "Education Committee", "base_url": "https://www.stateeducation.gov/committee", "frequency": "monthly"},
        {"name": "University Regents", "base_url": "https://www.stateuniversity.edu/regents", "frequency": "quarterly"}
    ],
    "finance": [
        {"name": "Financial Oversight Committee", "base_url": "https://www.financialoversight.gov/meetings", "frequency": "monthly"},
        {"name": "Banking Commission", "base_url": "https://www.bankingcommission.gov/public", "frequency": "monthly"},
        {"name": "Investment Board", "base_url": "https://www.investmentboard.org/meetings", "frequency": "bi-weekly"}
    ],
    "technology": [
        {"name": "Tech Policy Forum", "base_url": "https://www.techpolicy.org/forum", "frequency": "monthly"},
        {"name": "Data Privacy Board", "base_url": "https://www.dataprivacy.gov/meetings", "frequency": "monthly"},
        {"name": "Innovation Council", "base_url": "https://www.innovationcouncil.org/public", "frequency": "bi-weekly"}
    ],
    "energy": [
        {"name": "Public Utilities Commission", "base_url": "https://www.puc.gov/hearings", "frequency": "bi-weekly"},
        {"name": "Energy Board", "base_url": "https://www.energyboard.gov/meetings", "frequency": "monthly"},
        {"name": "Environmental Review Panel", "base_url": "https://www.environmentalpanel.org/hearings", "frequency": "monthly"}
    ],
    "transportation": [
        {"name": "Transit Authority", "base_url": "https://www.transit.gov/board", "frequency": "monthly"},
        {"name": "Transportation Commission", "base_url": "https://www.transportation.gov/commission", "frequency": "bi-weekly"},
        {"name": "Infrastructure Committee", "base_url": "https://www.infrastructure.gov/committee", "frequency": "monthly"}
    ],
    "real_estate": [
        {"name": "Zoning Board", "base_url": "https://www.zoning.gov/hearings", "frequency": "bi-weekly"},
        {"name": "Housing Authority", "base_url": "https://www.housingauthority.gov/board", "frequency": "monthly"},
        {"name": "Land Use Commission", "base_url": "https://www.landuse.gov/commission", "frequency": "monthly"}
    ]
}

# Industry-specific keywords for prioritization
INDUSTRY_KEYWORDS = {
    "city_government": ["budget", "ordinance", "zoning", "public works", "city services", "council", "mayor", "resolution"],
    "healthcare": ["patient care", "medical staff", "health policy", "insurance", "public health", "clinical", "facilities"],
    "education": ["curriculum", "students", "faculty", "schools", "testing", "education policy", "budget", "programs"],
    "finance": ["budget", "investment", "fiscal", "revenue", "expenditure", "audit", "bonds", "financial report"],
    "technology": ["data", "privacy", "cybersecurity", "digital", "innovation", "technology policy", "broadband"],
    "energy": ["utilities", "renewable", "grid", "generation", "transmission", "rates", "conservation", "emissions"],
    "transportation": ["transit", "roads", "infrastructure", "public transportation", "mobility", "traffic", "planning"],
    "real_estate": ["zoning", "development", "housing", "property", "land use", "building codes", "permits", "planning"]
}

# Mock permit data
mock_permits = [
    {
        "id": 1,
        "permit_number": "BLD-2023-0045",
        "title": "Commercial Building Renovation",
        "description": "Renovation of existing commercial space for retail use",
        "permit_type": "BUILDING",
        "status": "APPROVED",
        "applicant_name": "Johnson Construction LLC",
        "organization": "RetailCorp Inc.",
        "location": "123 Main Street, Downtown",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "application_date": "2023-03-15T09:30:00",
        "decision_date": "2023-04-02T14:45:00",
        "expiration_date": "2024-04-02T23:59:59",
        "related_meeting_id": 1,
        "created_at": "2023-03-15T09:30:00",
        "updated_at": "2023-04-02T14:45:00"
    },
    {
        "id": 2,
        "permit_number": "ENV-2023-0112",
        "title": "Industrial Emissions Permit",
        "description": "Authorization for emissions from manufacturing facility",
        "permit_type": "ENVIRONMENTAL",
        "status": "PENDING",
        "applicant_name": "Metro Manufacturing",
        "organization": "Industrial Solutions Co.",
        "location": "456 Factory Road, Industrial District",
        "latitude": 40.6892,
        "longitude": -74.0445,
        "application_date": "2023-04-20T11:15:00",
        "related_meeting_id": 2,
        "created_at": "2023-04-20T11:15:00"
    }
]

# Mock sensor data
mock_sensor_data = [
    {
        "id": 1,
        "sensor_id": "AQ-001",
        "sensor_name": "Downtown Air Quality Monitor",
        "sensor_type": "AIR_QUALITY",
        "location": "City Hall Roof",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "timestamp": "2023-05-01T13:00:00",
        "value": 42.5,
        "unit": "μg/m³",
        "threshold_value": 50.0,
        "exceeds_threshold": False,
        "source": "City Environmental Department",
        "created_at": "2023-05-01T13:05:00"
    },
    {
        "id": 2,
        "sensor_id": "WQ-023",
        "sensor_name": "River Quality Station 3",
        "sensor_type": "WATER_QUALITY",
        "location": "Main River - Central Bridge",
        "latitude": 40.7023,
        "longitude": -73.9876,
        "timestamp": "2023-05-01T12:45:00",
        "value": 8.2,
        "unit": "pH",
        "threshold_value": 8.5,
        "exceeds_threshold": False,
        "source": "State Water Authority",
        "created_at": "2023-05-01T12:50:00"
    },
    {
        "id": 3,
        "sensor_id": "EM-012",
        "sensor_name": "Industrial Park Emissions Monitor",
        "sensor_type": "EMISSIONS",
        "location": "Factory District Boundary",
        "latitude": 40.6892,
        "longitude": -74.0445,
        "timestamp": "2023-05-01T14:15:00",
        "value": 78.3,
        "unit": "ppm",
        "threshold_value": 75.0,
        "exceeds_threshold": True,
        "source": "EPA Monitoring Network",
        "created_at": "2023-05-01T14:20:00"
    }
]

# Mock remote sensing data
mock_remote_sensing = [
    {
        "id": 1,
        "image_id": "SAT-2023-0412-AREA1",
        "title": "Downtown Development Zone",
        "source": "SATELLITE",
        "image_url": "https://example.com/satellite/downtown-20230412.jpg",
        "image_date": "2023-04-12T10:30:00",
        "location_name": "Downtown Business District",
        "bounding_box": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-74.0100, 40.7100],
                    [-74.0100, 40.7200],
                    [-74.0000, 40.7200],
                    [-74.0000, 40.7100],
                    [-74.0100, 40.7100]
                ]
            ]
        },
        "center_latitude": 40.7150,
        "center_longitude": -74.0050,
        "resolution": 0.5,
        "analysis_status": "COMPLETED",
        "analysis_results": {
            "detected_changes": [
                {
                    "type": "construction_activity",
                    "confidence": 0.92,
                    "location": [-74.0075, 40.7180],
                    "size_sqm": 1200
                },
                {
                    "type": "vegetation_loss",
                    "confidence": 0.85,
                    "location": [-74.0040, 40.7130],
                    "size_sqm": 450
                }
            ],
            "land_use_classification": {
                "urban": 78.5,
                "vegetation": 12.3,
                "water": 9.2
            }
        },
        "created_at": "2023-04-12T14:00:00",
        "updated_at": "2023-04-12T16:45:00"
    }
]

# Store active WebSocket connections
active_connections = []

class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                # Handle any disconnects that happen during broadcast
                if connection in self.active_connections:
                    self.active_connections.remove(connection)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")

# Initialize connection manager
manager = ConnectionManager()

# Root endpoint - serve HTML
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(
        "index.html", 
        {"request": request}
    )

# API Root endpoint
@app.get("/api")
async def api_root():
    return {"message": f"Welcome to the {os.getenv('API_TITLE', 'Public Meeting Insights API')}"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

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
    insights = [
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
    return {"insights": insights}

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
    """Return markers for the sustainability map"""
    markers = {
        "meetings": [
            {
                "id": 1,
                "title": "City Council Meeting",
                "latitude": 40.7112,
                "longitude": -74.0055,
                "type": "meeting",
                "status": "High Impact"
            },
            {
                "id": 2,
                "title": "Planning Commission",
                "latitude": 40.7142,
                "longitude": -74.0123,
                "type": "meeting",
                "status": "Medium Impact"
            }
        ],
        "permits": [
            {
                "id": "BLD-2023-0045",
                "title": "Commercial Building Renovation",
                "latitude": 40.7222,
                "longitude": -74.0155,
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

# Add new endpoint to auto-find YouTube videos
@app.get("/api/meetings/discover")
async def discover_meetings(
    keywords: Optional[str] = Query(None, description="Comma-separated keywords to search for"),
    organization: Optional[str] = Query(None, description="Name of government organization"),
    meeting_type: Optional[str] = Query(None, description="Type of meeting"),
    max_results: Optional[int] = Query(5, description="Maximum number of results to return")
):
    """
    Automatically discover relevant public meeting videos from YouTube.
    
    Args:
        keywords: Comma-separated keywords to search for
        organization: Name of government organization (e.g., "Seattle City Council")
        meeting_type: Type of meeting (e.g., "city council", "planning commission")
        max_results: Maximum number of results to return
        
    Returns:
        List of meeting videos with metadata
    """
    # Check if YouTube search module is available
    if not YOUTUBE_SEARCH_AVAILABLE:
        return JSONResponse(
            status_code=503,
            content={
                "error": "YouTube search functionality not available",
                "message": "The youtube_search.py module is not properly installed or configured."
            }
        )
    
    try:
        # If organization provided, use government meeting search
        if organization:
            videos = search_government_meetings(
                organization=organization,
                meeting_type=meeting_type,
                max_results=max_results
            )
        # Otherwise use keyword search
        elif keywords:
            keyword_list = [k.strip() for k in keywords.split(",")]
            videos = auto_find_meetings(keywords=keyword_list, max_results=max_results)
        # Default search if no parameters provided
        else:
            videos = auto_find_meetings(max_results=max_results)
        
        # Convert video objects to meeting format
        meetings = []
        for i, video in enumerate(videos):
            # Create a standardized meeting object from YouTube video
            meeting = {
                "id": i + 100,  # Use ID starting from 100 to avoid conflicts with mock data
                "title": video["title"],
                "date": video["published_at"],
                "duration": video["duration"] if "duration" in video else "Unknown",
                "location": "Virtual/YouTube",
                "source": "YouTube",
                "channel": video["channel_title"],
                "youtube_url": video["url"],
                "video_id": video["id"],
                "thumbnail": f"https://img.youtube.com/vi/{video['id']}/maxresdefault.jpg",
                "description": video["description"],
                "view_count": video.get("view_count", 0),
                "auto_discovered": True
            }
            meetings.append(meeting)
        
        return {"meetings": meetings}
        
    except Exception as e:
        print(f"Error discovering meetings: {str(e)}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "error": "Failed to discover meetings",
                "message": str(e)
            }
        )

# Add new endpoint to analyze discovered videos
@app.post("/api/meetings/analyze-discovered")
async def analyze_discovered_videos(
    video_ids: List[str] = Query(..., description="YouTube video IDs to analyze")
):
    """
    Analyze multiple discovered YouTube videos
    
    Args:
        video_ids: List of YouTube video IDs to analyze
        
    Returns:
        Analysis results for each video
    """
    if not video_ids:
        return JSONResponse(
            status_code=400,
            content={
                "error": "No video IDs provided",
                "message": "Please provide at least one YouTube video ID to analyze"
            }
        )
    
    results = []
    
    for video_id in video_ids:
        # Create YouTube URL from video ID
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        
        try:
            # Extract content from YouTube
            extraction_result = extract_from_youtube(youtube_url)
            
            # Generate insights using existing function
            if "error" not in extraction_result:
                analysis_result = await generate_ai_summary(extraction_result)
                extraction_result.update(analysis_result)
            
            results.append({
                "video_id": video_id,
                "success": "error" not in extraction_result,
                "result": extraction_result
            })
            
        except Exception as e:
            print(f"Error analyzing video {video_id}: {str(e)}")
            traceback.print_exc()
            results.append({
                "video_id": video_id,
                "success": False,
                "error": str(e)
            })
    
    return {"results": results}

# Modify the existing extract endpoint to handle auto-discovered videos
@app.post("/api/extract")
async def extract(
    youtube_url: str = Form(None), 
    file: UploadFile = File(None),
    video_id: str = Form(None)
):
    """
    Extract content from a YouTube URL, uploaded file, or video ID
    """
    print(f"Extract request received - YouTube URL: {youtube_url}, File: {file}, Video ID: {video_id}")
    
    # If video_id is provided, convert to YouTube URL
    if video_id and not youtube_url:
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        print(f"Created YouTube URL from video ID: {youtube_url}")
    
    # Handle YouTube URL extraction
    if youtube_url:
        extraction_result = extract_from_youtube(youtube_url)
        
        # Special handling for Finance & Corporate Committee video (known example)
        if "Finance & Corporate Committee" in youtube_url or "Finance & Corporate Committee" in extraction_result.get("title", ""):
            print("Detected Finance & Corporate Committee video - using prepared extraction")
            with open("finance_committee_extraction.json", "r") as f:
                extraction_result = json.load(f)
        
        # Generate AI summary and insights
        try:
            if "error" not in extraction_result:
                ai_result = await generate_ai_summary(extraction_result)
                extraction_result.update(ai_result)
        except Exception as e:
            print(f"Error generating AI summary: {str(e)}")
            extraction_result["ai_error"] = str(e)
        
        return extraction_result

    # Handle file upload
    elif file:
        # Process uploaded file (existing code remains unchanged)
        filename = file.filename
        file_type = filename.split(".")[-1].lower() if "." in filename else "unknown"
        
        return {
            "id": extraction_id,
            "filename": filename,
            "file_type": file_type,
            "size": random.randint(1000000, 5000000),
            "insights": {
                "id": extraction_id,
                "source_type": "file",
                "title": filename,
                "topics": [
                    {"name": "Parks & Recreation", "confidence": 0.88},
                    {"name": "Public Health", "confidence": 0.76}, 
                    {"name": "Sustainability", "confidence": 0.72}
                ],
                "entities": [
                    {"name": "Parks Department", "type": "organization", "sentiment": 0.4},
                    {"name": "City Manager", "type": "person", "sentiment": 0.1},
                    {"name": "Central Park", "type": "location", "sentiment": 0.6}
                ],
                "sentiment": {
                    "overall": 0.25,
                    "breakdown": {
                        "positive": 0.55,
                        "neutral": 0.30,
                        "negative": 0.15
                    }
                },
                "key_points": [
                    "Proposal for expanded recycling program",
                    "New tree planting initiative in urban areas",
                    "Water conservation measures discussed"
                ],
                "sustainability_score": 75,
                "created_at": datetime.now().isoformat()
            }
        }
    
    # If neither URL nor file provided
    else:
        return JSONResponse(
            status_code=400, 
            content={"error": "No YouTube URL, video ID, or file provided"}
        )

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Accept the connection
    await manager.connect(websocket)
    
    try:
        # Send initial data
        initial_data = {
            "type": "initial_data",
            "news": generate_mock_news(),
            "air_quality": generate_mock_air_quality(),
            "sustainability_score": {
                "score": 72,
                "history": [
                    {"date": "Jan", "score": 68},
                    {"date": "Feb", "score": 70},
                    {"date": "Mar", "score": 71},
                    {"date": "Apr", "score": 69},
                    {"date": "May", "score": 72},
                ]
            },
            "insights": generate_mock_insights()
        }
        await websocket.send_json(initial_data)
        
        # Keep connection alive and listen for client messages
        while True:
            try:
                # Wait for client messages
                data = await websocket.receive_text()
                client_data = json.loads(data)
                
                # Echo message back to client for debugging
                response = {
                    "type": "acknowledgment",
                    "message": f"Received: {client_data.get('type', 'unknown')}"
                }
                await websocket.send_json(response)
                
            except json.JSONDecodeError:
                # If client sends invalid JSON, just log it
                print(f"Received invalid JSON: {data}")
                
    except WebSocketDisconnect:
        # Clean up on disconnect
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# Mock data generation functions for the WebSocket endpoint
def generate_mock_news():
    """Generate mock news articles for testing"""
    return [
        {
            "title": "City Implements New Recycling Program",
            "source": "Environmental News Network",
            "date": "2023-06-15T08:30:00Z",
            "content": "The city has launched a new comprehensive recycling program that aims to reduce landfill waste by 40% within the next two years.",
            "url": "#"
        },
        {
            "title": "Local Lake Water Quality Improves After Cleanup",
            "source": "City Environmental Department",
            "date": "2023-06-12T14:15:00Z",
            "content": "Following a community-led cleanup effort, water quality tests show a significant improvement in the local lake's ecosystem health.",
            "url": "#"
        },
        {
            "title": "New Solar Installation Powers 500 Homes",
            "source": "Clean Energy Today",
            "date": "2023-06-10T09:45:00Z",
            "content": "A newly completed solar farm installation is now providing clean energy to approximately 500 homes in the surrounding community.",
            "url": "#"
        }
    ]

def generate_mock_air_quality():
    """Generate mock air quality data for testing"""
    return [
        {
            "id": "AQ001",
            "city": "Downtown",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "aqi": 42,
            "status": "Good",
            "status_code": "Good",
            "pollutants": {
                "pm25": 5.2,
                "pm10": 15.8,
                "o3": 0.032
            },
            "timestamp": "2023-06-15T10:00:00Z"
        },
        {
            "id": "AQ002",
            "city": "Westside",
            "latitude": 37.7834,
            "longitude": -122.4835,
            "aqi": 67,
            "status": "Moderate",
            "status_code": "Moderate",
            "pollutants": {
                "pm25": 12.8,
                "pm10": 34.2,
                "o3": 0.045
            },
            "timestamp": "2023-06-15T10:00:00Z"
        },
        {
            "id": "AQ003",
            "city": "Industrial Zone",
            "latitude": 37.7608,
            "longitude": -122.3889,
            "aqi": 115,
            "status": "Unhealthy for Sensitive Groups",
            "status_code": "Warning",
            "pollutants": {
                "pm25": 35.6,
                "pm10": 75.3,
                "o3": 0.078
            },
            "timestamp": "2023-06-15T10:00:00Z"
        }
    ]

def generate_mock_insights():
    """Generate mock insights for testing"""
    return [
        {
            "title": "Air Quality Trend Analysis",
            "source": "Environmental Analysis",
            "date": "2023-06-14",
            "content": "Air quality has improved 15% over the past month, with PM2.5 levels showing the most significant reduction."
        },
        {
            "title": "Water Usage Pattern",
            "source": "Resource Management",
            "date": "2023-06-13",
            "content": "Commercial district water usage has decreased by 8% following the implementation of the new conservation initiative."
        }
    ]

# Add a background task to simulate real-time updates
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(send_periodic_updates())

async def send_periodic_updates():
    """Send periodic updates to all connected WebSocket clients"""
    import random
    
    # Wait for the server to fully start
    await asyncio.sleep(5)
    
    while True:
        # Only send updates if we have active connections
        if manager.active_connections:
            # Randomly decide what type of update to send
            update_type = random.choice(["news_update", "air_quality_update", "sustainability_score_update"])
            
            if update_type == "news_update":
                # Generate a new news item
                new_news = {
                    "title": f"Environmental Update {datetime.now().strftime('%H:%M:%S')}",
                    "source": "Real-time Monitor",
                    "date": datetime.now().isoformat(),
                    "content": "This is a simulated real-time update for testing the WebSocket connection.",
                    "url": "#"
                }
                
                await manager.broadcast({
                    "type": "news_update",
                    "data": [new_news]
                })
                
            elif update_type == "air_quality_update":
                # Update air quality data
                mock_air_quality = generate_mock_air_quality()
                # Randomly change some values
                for item in mock_air_quality:
                    item["aqi"] = max(1, min(150, item["aqi"] + random.randint(-10, 10)))
                    if item["aqi"] < 50:
                        item["status"] = "Good"
                        item["status_code"] = "Good"
                    elif item["aqi"] < 100:
                        item["status"] = "Moderate"
                        item["status_code"] = "Moderate"
                    else:
                        item["status"] = "Unhealthy for Sensitive Groups"
                        item["status_code"] = "Warning"
                    
                    item["timestamp"] = datetime.now().isoformat()
                
                await manager.broadcast({
                    "type": "air_quality_update",
                    "data": mock_air_quality
                })
                
            elif update_type == "sustainability_score_update":
                # Update sustainability score
                score = random.randint(65, 80)
                
                await manager.broadcast({
                    "type": "sustainability_score_update",
                    "data": {
                        "score": score,
                        "history": [
                            {"date": "Jan", "score": 68},
                            {"date": "Feb", "score": 70},
                            {"date": "Mar", "score": 71},
                            {"date": "Apr", "score": 69},
                            {"date": "May", "score": 72},
                            {"date": "Jun", "score": score}
                        ]
                    }
                })
        
        # Wait before sending next update (5-15 seconds)
        await asyncio.sleep(random.randint(5, 15))

# Optional port from environment variable
port = int(os.getenv("PORT", 8002))

@app.get("/api/discover-videos")
async def discover_videos(
    keywords: str = Query(..., description="Keywords to search for"),
    organization: str = Query(None, description="Optional organization name"),
    meeting_type: str = Query(None, description="Optional meeting type"),
    max_results: int = Query(5, description="Maximum number of results to return")
):
    """
    Search for relevant YouTube videos based on keywords
    """
    try:
        videos = youtube_search.search_videos(
            keywords=keywords,
            max_results=max_results,
            organization=organization,
            meeting_type=meeting_type
        )
        return {
            "status": "success",
            "count": len(videos),
            "videos": videos
        }
    except Exception as e:
        print(f"Error discovering videos: {str(e)}")
        return {
            "status": "error",
            "message": str(e),
            "videos": []
        }

@app.post("/api/analyze-discovered")
async def analyze_discovered_video(
    video_url: str = Form(...),
    background_tasks: BackgroundTasks = None
):
    """
    Analyze a discovered YouTube video
    """
    try:
        # Extract data from YouTube
        extraction_result = extract_from_youtube(video_url)
        
        if not extraction_result:
            raise HTTPException(status_code=400, detail="Failed to extract data from YouTube video")
            
        # Generate insights (use background task if available)
        if background_tasks:
            # Add background task to generate insights
            background_tasks.add_task(
                generate_meeting_insights,
                extraction_result["transcript"],
                extraction_result["video_info"]["title"],
                video_url
            )
            return {
                "status": "processing",
                "message": "Video is being analyzed in the background",
                "video_info": extraction_result["video_info"]
            }
        else:
            # Generate insights synchronously
            insights = generate_meeting_insights(
                extraction_result["transcript"],
                extraction_result["video_info"]["title"],
                video_url
            )
            return {
                "status": "success",
                "insights": insights,
                "video_info": extraction_result["video_info"]
            }
    except Exception as e:
        print(f"Error analyzing discovered video: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/api/analysis/status")
async def check_analysis_status(
    video_id: str = Query(..., description="YouTube video ID to check status for")
):
    """
    Check the status of a video analysis job
    
    Args:
        video_id: YouTube video ID
        
    Returns:
        Status information for the analysis job
    """
    try:
        # This would normally check a database or cache for the status
        # For this demo, we'll return a mock response
        
        # Generate a deterministic status based on the video ID
        analysis_complete = hash(video_id) % 3 != 0  # 2/3 chance of being complete
        
        if analysis_complete:
            return {
                "status": "completed",
                "video_id": video_id,
                "video_info": {
                    "title": f"Meeting about sustainability (ID: {video_id})",
                    "url": f"https://www.youtube.com/watch?v={video_id}"
                },
                "insights": {
                    "summary": "This meeting covered key sustainability initiatives including water conservation, renewable energy adoption, and waste reduction strategies. The council voted to approve a new climate action plan with measurable targets for the next 5 years.",
                    "topics": ["Climate Action", "Sustainability", "Environmental Policy", "Urban Planning"],
                    "sentiment": "positive",
                    "key_points": [
                        "Approval of new climate action plan",
                        "Discussion of water conservation measures",
                        "Renewable energy targets set at 50% by 2030",
                        "New waste reduction initiatives approved"
                    ],
                    "next_steps": [
                        "Implementation of climate action plan to begin next month",
                        "Public feedback session scheduled in 2 weeks",
                        "Progress report due in 6 months"
                    ]
                }
            }
        else:
            return {
                "status": "processing",
                "video_id": video_id,
                "message": "Video analysis is still in progress. Check back in a few minutes."
            }
            
    except Exception as e:
        print(f"Error checking analysis status: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    print(f"Starting server on port {port}")
    uvicorn.run("simple_server:app", host="0.0.0.0", port=port, reload=True) 