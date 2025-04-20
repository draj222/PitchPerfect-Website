# Sustainability Monitoring Platform

A comprehensive dashboard for environmental monitoring and sustainability insights.

## Features

- **Dashboard Overview**: View key sustainability metrics, trends, and insights at a glance
- **Meeting Insights**: Track environmental commitments and decisions from public meetings
- **Permits & Compliance**: Monitor environmental permits, compliance status, and potential impacts
- **Environmental Sensors**: Real-time data from environmental sensor networks
- **Satellite Monitoring**: Remote sensing data for environmental change detection

## Technologies

- **Backend**: FastAPI for a lightweight, high-performance API
- **Frontend**: HTML, CSS, JavaScript with Bootstrap 5 and Chart.js
- **Maps**: Leaflet.js for interactive geographic visualizations
- **Data Visualization**: Chart.js for responsive, animated charts

## Project Structure

```
├── app.py                 # FastAPI application
├── static/                # Static files
│   ├── main.js            # JavaScript for interactivity and visualization
│   └── styles.css         # Custom CSS styles
├── templates/             # HTML templates
│   └── index.html         # Main dashboard template
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install fastapi uvicorn jinja2 python-dotenv
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open your browser and navigate to `http://localhost:8002`

## API Endpoints

- `GET /`: Main dashboard interface
- `GET /api/meetings`: List of public meetings with sustainability insights
- `GET /api/permits`: Environmental permits
- `GET /api/sensors`: Environmental sensor data
- `GET /api/insights`: Environmental insights from various data sources
- `GET /api/sustainability/score`: Overall sustainability score and metrics
- `GET /api/map/markers`: Geospatial data for maps

## Future Enhancements

- User authentication and personalization
- Real-time data streaming from sensors
- Advanced analytics and predictive modeling
- Mobile application for field data collection
- Integration with external data sources and APIs

## License

MIT 