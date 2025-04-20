document.addEventListener('DOMContentLoaded', function() {
    // Initialize section visibility
    showSection('dashboard');
    
    // Add event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            
            // Update active state in nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initialize charts
    initializeDashboardCharts();
    
    // Initialize maps if the libraries are loaded
    if (typeof L !== 'undefined') {
        initializeMaps();
    }
    
    // Fetch mock data
    fetchMeetings();
    fetchPermits();
    fetchSensorData();
    generateInsights();
    
    // Add event listener for reconnect button
    const reconnectButton = document.getElementById('reconnect-button');
    if (reconnectButton) {
        reconnectButton.addEventListener('click', function() {
            // Only reconnect if we're not already connecting
            if (!window.wsConnecting) {
                connectWebSocket();
            }
        });
    }
    
    // Connect to WebSocket server for real-time updates
    connectWebSocket();
    
    // Initialize video discovery functionality
    initVideoDiscovery();
});

// Show the selected section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active-section');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
}

// Initialize dashboard charts
function initializeDashboardCharts() {
    // Sustainability Score Trend
    const trendCtx = document.getElementById('sustainability-trend');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [{
                    label: 'Overall Sustainability Score',
                    data: [65, 68, 67, 72, 75, 73, 78, 82, 85],
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        min: 50,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '/100';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Category Performance
    const categoryCtx = document.getElementById('category-performance');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'radar',
            data: {
                labels: [
                    'Climate Action',
                    'Biodiversity',
                    'Water Resources',
                    'Air Quality',
                    'Community Impact',
                    'Regulatory Compliance'
                ],
                datasets: [{
                    label: 'Current Performance',
                    data: [85, 72, 78, 81, 68, 92],
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    borderColor: '#0d6efd',
                    pointBackgroundColor: '#0d6efd',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#0d6efd'
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0.1
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 50,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

// Initialize maps
function initializeMaps() {
    // Main map
    const map = L.map('map').setView([37.7749, -122.4194], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add area of interest polygon
    const polygon = L.polygon([
        [37.8, -122.5],
        [37.7, -122.5],
        [37.7, -122.3],
        [37.8, -122.3]
    ], {color: '#0d6efd', fillOpacity: 0.2}).addTo(map);
    
    // Add markers for monitoring points
    const markers = [
        {latlng: [37.78, -122.45], name: 'City Hall', type: 'Meeting Location'},
        {latlng: [37.77, -122.42], name: 'Water Treatment Plant', type: 'Permit Site'},
        {latlng: [37.75, -122.40], name: 'Air Quality Station', type: 'Sensor Location'},
        {latlng: [37.76, -122.47], name: 'Habitat Restoration', type: 'Project Site'}
    ];
    
    markers.forEach(marker => {
        L.marker(marker.latlng)
            .addTo(map)
            .bindPopup(`<b>${marker.name}</b><br>${marker.type}`);
    });
    
    // Sensor map
    const sensorMap = L.map('sensor-map').setView([37.7749, -122.4194], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(sensorMap);
    
    // Add sensor markers with different colors based on status
    const sensorMarkers = [
        {latlng: [37.79, -122.42], name: 'Downtown Air Quality', status: 'normal', reading: '35 PM2.5'},
        {latlng: [37.77, -122.41], name: 'Central Water Quality', status: 'normal', reading: '98% purity'},
        {latlng: [37.75, -122.43], name: 'South District Noise', status: 'warning', reading: '72 dB'},
        {latlng: [37.76, -122.49], name: 'West End Air Quality', status: 'alert', reading: '68 PM2.5'},
        {latlng: [37.78, -122.39], name: 'Northeast Water Level', status: 'normal', reading: '2.4m'}
    ];
    
    sensorMarkers.forEach(sensor => {
        let markerColor;
        switch (sensor.status) {
            case 'alert':
                markerColor = 'red';
                break;
            case 'warning':
                markerColor = 'orange';
                break;
            default:
                markerColor = 'green';
        }
        
        const sensorIcon = L.divIcon({
            className: 'sensor-marker',
            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        
        L.marker(sensor.latlng, {icon: sensorIcon})
            .addTo(sensorMap)
            .bindPopup(`<b>${sensor.name}</b><br>Status: ${sensor.status}<br>Reading: ${sensor.reading}`);
    });
}

// Fetch meetings from API
function fetchMeetings() {
    // In a real application, this would be an API call
    const meetings = [
        {
            id: 1,
            title: 'City Council Meeting - Environmental Policy Review',
            date: '2023-10-10',
            commitments: 3,
            score: 78,
            topics: ['Climate Action Plan', 'Water Conservation', 'Urban Forestry']
        },
        {
            id: 2,
            title: 'Planning Commission - Waterfront Development',
            date: '2023-09-28',
            commitments: 5,
            score: 82,
            topics: ['Biodiversity', 'Flood Protection', 'Public Access']
        },
        {
            id: 3,
            title: 'Environmental Advisory Board',
            date: '2023-09-15',
            commitments: 2,
            score: 91,
            topics: ['Air Quality Monitoring', 'Climate Resilience', 'Energy Efficiency']
        },
        {
            id: 4,
            title: 'Parks & Recreation Committee',
            date: '2023-09-05',
            commitments: 4,
            score: 75,
            topics: ['Habitat Restoration', 'Pesticide Reduction', 'Urban Heat Islands']
        }
    ];
    
    const tableBody = document.querySelector('#meetings-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        meetings.forEach(meeting => {
            let scoreClass = 'bg-success';
            if (meeting.score < 70) scoreClass = 'bg-danger';
            else if (meeting.score < 80) scoreClass = 'bg-warning';
            
            tableBody.innerHTML += `
                <tr>
                    <td>${meeting.date}</td>
                    <td>${meeting.title}</td>
                    <td>${meeting.commitments}</td>
                    <td><span class="badge ${scoreClass}">${meeting.score}</span></td>
                    <td>
                        ${meeting.topics.map(topic => `<span class="badge bg-light text-dark me-1">${topic}</span>`).join('')}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#meetingModal" data-id="${meeting.id}">
                            View
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

// Fetch permits data
function fetchPermits() {
    // In a real application, this would be an API call
    const permits = [
        {
            id: 'P-23405',
            type: 'Construction',
            status: 'Approved',
            location: 'North District',
            expiryDate: '2024-06-15',
            environmentalImpact: 'Medium'
        },
        {
            id: 'P-23418',
            type: 'Discharge',
            status: 'Under Review',
            location: 'South Waterfront',
            expiryDate: 'N/A',
            environmentalImpact: 'High'
        },
        {
            id: 'P-23422',
            type: 'Land Use',
            status: 'Approved',
            location: 'East District',
            expiryDate: '2024-09-30',
            environmentalImpact: 'Low'
        },
        {
            id: 'P-23430',
            type: 'Emissions',
            status: 'Conditionally Approved',
            location: 'Industrial Zone',
            expiryDate: '2024-03-22',
            environmentalImpact: 'High'
        },
        {
            id: 'P-23436',
            type: 'Water Extraction',
            status: 'Under Review',
            location: 'Western Basin',
            expiryDate: 'N/A',
            environmentalImpact: 'Medium'
        }
    ];
    
    const tableBody = document.querySelector('#permits-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        permits.forEach(permit => {
            let statusClass = '';
            switch (permit.status) {
                case 'Approved':
                    statusClass = 'bg-success';
                    break;
                case 'Under Review':
                    statusClass = 'bg-warning';
                    break;
                case 'Conditionally Approved':
                    statusClass = 'bg-info';
                    break;
                default:
                    statusClass = 'bg-secondary';
            }
            
            let impactClass = '';
            switch (permit.environmentalImpact) {
                case 'Low':
                    impactClass = 'bg-success';
                    break;
                case 'Medium':
                    impactClass = 'bg-warning';
                    break;
                case 'High':
                    impactClass = 'bg-danger';
                    break;
                default:
                    impactClass = 'bg-secondary';
            }
            
            tableBody.innerHTML += `
                <tr>
                    <td>${permit.id}</td>
                    <td>${permit.type}</td>
                    <td><span class="badge ${statusClass}">${permit.status}</span></td>
                    <td>${permit.location}</td>
                    <td>${permit.expiryDate}</td>
                    <td><span class="badge ${impactClass}">${permit.environmentalImpact}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#permitModal" data-id="${permit.id}">
                            Details
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

// Fetch sensor data
function fetchSensorData() {
    // In a real application, this would be an API call
    const sensors = [
        {
            id: 'AQ-001',
            type: 'Air Quality',
            location: 'Downtown',
            status: 'Normal',
            reading: '32 PM2.5',
            lastUpdate: '10 minutes ago'
        },
        {
            id: 'WL-003',
            type: 'Water Level',
            location: 'River North',
            status: 'Warning',
            reading: '4.2m (Rising)',
            lastUpdate: '5 minutes ago'
        },
        {
            id: 'NL-002',
            type: 'Noise Level',
            location: 'Central District',
            status: 'Normal',
            reading: '58 dB',
            lastUpdate: '15 minutes ago'
        },
        {
            id: 'WQ-005',
            type: 'Water Quality',
            location: 'South Lake',
            status: 'Alert',
            reading: 'pH 8.7',
            lastUpdate: '3 minutes ago'
        },
        {
            id: 'TP-004',
            type: 'Temperature',
            location: 'Urban Park',
            status: 'Normal',
            reading: '24.5°C',
            lastUpdate: '8 minutes ago'
        }
    ];
    
    const tableBody = document.querySelector('#sensors-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        sensors.forEach(sensor => {
            let statusClass = '';
            switch (sensor.status) {
                case 'Normal':
                    statusClass = 'status-normal';
                    break;
                case 'Warning':
                    statusClass = 'status-warning';
                    break;
                case 'Alert':
                    statusClass = 'status-alert';
                    break;
                default:
                    statusClass = '';
            }
            
            tableBody.innerHTML += `
                <tr>
                    <td>${sensor.id}</td>
                    <td>${sensor.type}</td>
                    <td>${sensor.location}</td>
                    <td class="${statusClass}">${sensor.status}</td>
                    <td>${sensor.reading}</td>
                    <td>${sensor.lastUpdate}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-sensor-history">
                            History
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

// Generate insights from all data sources
function generateInsights() {
    const insights = [
        {
            type: 'meeting',
            title: 'Climate Commitment Increase',
            description: 'Recent city council meetings show a 28% increase in climate action commitments compared to last quarter.',
            source: 'Meeting Transcripts',
            date: '2023-10-12'
        },
        {
            type: 'permit',
            title: 'High Impact Industrial Permit Pending',
            description: 'A new discharge permit application in the South Waterfront area has potential significant impacts on local water quality.',
            source: 'Permit Database',
            date: '2023-10-10'
        },
        {
            type: 'sensor',
            title: 'Air Quality Deterioration',
            description: 'Downtown air quality sensors show a 15% increase in PM2.5 levels over the past week, potentially related to construction activities.',
            source: 'Air Quality Sensors',
            date: '2023-10-11'
        },
        {
            type: 'meeting',
            title: 'Urban Forest Initiative',
            description: 'Parks & Recreation Committee has approved a new urban forestry plan with target of 5,000 new trees by 2025.',
            source: 'Meeting Transcripts',
            date: '2023-09-05'
        },
        {
            type: 'satellite',
            title: 'Vegetation Loss Detected',
            description: 'Satellite imagery shows 3.2% reduction in vegetation cover in the East District over the past month.',
            source: 'Sentinel-2 Imagery',
            date: '2023-10-08'
        },
        {
            type: 'sensor',
            title: 'Water Level Warning',
            description: 'River North sensors indicate rising water levels approaching flood stage following recent precipitation.',
            source: 'Water Level Sensors',
            date: '2023-10-12'
        }
    ];
    
    const insightsContainer = document.querySelector('.insights-container');
    if (insightsContainer) {
        insightsContainer.innerHTML = '';
        
        insights.forEach(insight => {
            insightsContainer.innerHTML += `
                <div class="insight-item ${insight.type}">
                    <h6>${insight.title}</h6>
                    <div class="metadata">${insight.source} • ${insight.date}</div>
                    <p>${insight.description}</p>
                </div>
            `;
        });
    }
}

// Connect to WebSocket server for real-time updates
let wsSocket = null;
let wsConnecting = false;
let wsReconnectTimeout = null;

function connectWebSocket() {
    // Clear any existing reconnect timeout
    if (wsReconnectTimeout) {
        clearTimeout(wsReconnectTimeout);
        wsReconnectTimeout = null;
    }
    
    // If we already have an open connection, don't create another
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        console.log('Already connected to WebSocket server');
        return;
    }
    
    // If we're already connecting, don't try again
    if (wsConnecting) {
        console.log('Already attempting to connect to WebSocket server');
        return;
    }
    
    wsConnecting = true;
    updateConnectionStatus('connecting');
    
    // Close existing socket if it exists
    if (wsSocket) {
        try {
            wsSocket.close();
        } catch (e) {
            console.error('Error closing existing WebSocket connection:', e);
        }
    }
    
    // Get WebSocket server URL from environment or use default
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.hostname || 'localhost';
    const wsPort = 8765; // Match the port in websocket_server.py
    const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}`;
    
    console.log(`Connecting to WebSocket server at ${wsUrl}`);
    
    // Create WebSocket connection
    try {
        wsSocket = new WebSocket(wsUrl);
        
        // Connection opened
        wsSocket.addEventListener('open', function(event) {
            console.log('Connected to WebSocket server');
            wsConnecting = false;
            updateConnectionStatus('connected');
            
            // Send a ping every 30 seconds to keep the connection alive
            setInterval(() => {
                if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
                    wsSocket.send(JSON.stringify({
                        type: 'ping',
                        timestamp: new Date().toISOString()
                    }));
                }
            }, 30000);
        });
        
        // Listen for messages
        wsSocket.addEventListener('message', function(event) {
            try {
                const message = JSON.parse(event.data);
                console.log('Message from server:', message);
                handleWebSocketMessage(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });
        
        // Connection closed
        wsSocket.addEventListener('close', function(event) {
            console.log('Disconnected from WebSocket server');
            wsConnecting = false;
            updateConnectionStatus('disconnected');
            
            // Try to reconnect after 5 seconds if not closed intentionally
            if (!event.wasClean) {
                console.log('Connection closed unexpectedly, attempting to reconnect in 5 seconds');
                wsReconnectTimeout = setTimeout(connectWebSocket, 5000);
            }
        });
        
        // Connection error
        wsSocket.addEventListener('error', function(event) {
            console.error('WebSocket error:', event);
            wsConnecting = false;
            updateConnectionStatus('error');
            
            // Try to reconnect after 10 seconds
            console.log('WebSocket error, attempting to reconnect in 10 seconds');
            wsReconnectTimeout = setTimeout(connectWebSocket, 10000);
        });
    } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        wsConnecting = false;
        updateConnectionStatus('error');
        
        // Try to reconnect after 10 seconds
        wsReconnectTimeout = setTimeout(connectWebSocket, 10000);
    }
    
    // Make the socket available globally
    window.wsSocket = wsSocket;
    window.wsConnecting = wsConnecting;
    
    return wsSocket;
}

// Update connection status indicator
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connection-status');
    if (!statusElement) return;
    
    // Remove all status classes
    statusElement.classList.remove('status-connected', 'status-disconnected', 'status-connecting', 'status-error');
    
    let statusText = '';
    let statusClass = '';
    let indicatorClass = '';
    let notificationMessage = '';
    let notificationType = 'info';
    
    // Set appropriate values based on status
    switch (status) {
        case 'connected':
            statusText = 'Online';
            statusClass = 'status-connected';
            indicatorClass = 'online';
            notificationMessage = 'Connected to real-time data stream';
            notificationType = 'success';
            break;
        case 'disconnected':
            statusText = 'Offline';
            statusClass = 'status-disconnected';
            indicatorClass = 'offline';
            notificationMessage = 'Disconnected from data stream';
            notificationType = 'warning';
            break;
        case 'connecting':
            statusText = 'Connecting...';
            statusClass = 'status-connecting';
            indicatorClass = 'connecting';
            notificationMessage = 'Attempting to connect to data stream';
            notificationType = 'info';
            break;
        case 'error':
            statusText = 'Connection Error';
            statusClass = 'status-error';
            indicatorClass = 'offline';
            notificationMessage = 'Error connecting to data stream';
            notificationType = 'danger';
            break;
    }
    
    // Update the status element
    statusElement.className = `connection-status ${statusClass}`;
    statusElement.innerHTML = `<span class="status-indicator ${indicatorClass}"></span> ${statusText}`;
    
    // Show notification if we have a message
    if (notificationMessage) {
        showNotification(notificationMessage, notificationType);
    }
    
    // Update reconnect button visibility
    const reconnectButton = document.getElementById('reconnect-button');
    if (reconnectButton) {
        reconnectButton.style.display = (status === 'disconnected' || status === 'error') ? 'block' : 'none';
    }
}

// Handle incoming WebSocket messages
function handleWebSocketMessage(message) {
    if (!message || !message.type) return;
    
    switch (message.type) {
        case 'air_quality':
            updateAirQualityData(message.data);
            if (message.history) {
                updateAirQualityChart(message.history);
            }
            break;
            
        case 'sustainability_score':
            updateSustainabilityScore(message.data);
            updateSustainabilityChart(message.data);
            break;
            
        case 'news_update':
            if (Array.isArray(message.data)) {
                const newsContainer = document.getElementById('sustainability-news');
                if (newsContainer) {
                    newsContainer.innerHTML = '';
                    message.data.forEach(news => {
                        updateNewsItem(news);
                    });
                }
            }
            break;
            
        case 'notification':
            showNotification(message.message, message.level || 'info');
            break;
            
        case 'insight':
            addInsight(message.data);
            break;
            
        case 'pong':
            // Received a pong response - connection is alive
            console.log('Connection alive:', new Date(message.timestamp));
            break;
    }
}

// Show notification to user
function showNotification(message, type = 'info') {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    
    // Add content
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    alertsContainer.appendChild(alert);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alertsContainer.removeChild(alert);
        }, 150);
    }, 5000);
}

// Update sustainability score display
function updateSustainabilityScore(scoreData) {
    // Update overall score
    const overallScore = document.getElementById('overall-score');
    if (overallScore && scoreData.overall) {
        overallScore.textContent = scoreData.overall;
        
        // Update progress bar
        const progressBar = overallScore.closest('.card').querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${scoreData.overall}%`;
            
            // Update color based on score
            progressBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
            if (scoreData.overall < 60) {
                progressBar.classList.add('bg-danger');
            } else if (scoreData.overall < 80) {
                progressBar.classList.add('bg-warning');
            } else {
                progressBar.classList.add('bg-success');
            }
        }
    }
    
    // Update category scores
    const categories = ['water', 'energy', 'waste', 'emissions'];
    categories.forEach(category => {
        if (scoreData[category]) {
            const element = document.getElementById(`${category}-score`);
            if (element) {
                element.textContent = scoreData[category];
                
                // Update progress bar if present
                const progressBar = element.closest('.metric')?.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${scoreData[category]}%`;
                    
                    // Update color based on score
                    progressBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
                    if (scoreData[category] < 60) {
                        progressBar.classList.add('bg-danger');
                    } else if (scoreData[category] < 80) {
                        progressBar.classList.add('bg-warning');
                    } else {
                        progressBar.classList.add('bg-success');
                    }
                }
            }
        }
    });
    
    // Update last updated timestamp
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        lastUpdated.textContent = formatTimestamp(new Date());
    }
}

// Add a news item to the news container
function updateNewsItem(newsData) {
    const newsContainer = document.getElementById('sustainability-news');
    if (!newsContainer) return;
    
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item mb-3';
    
    const date = new Date(newsData.published_at);
    const formattedDate = date.toLocaleDateString();
    
    newsItem.innerHTML = `
        <h5 class="news-title">${newsData.title}</h5>
        <div class="news-meta">
            <span class="news-source">${newsData.source}</span> • 
            <span class="news-date">${formattedDate}</span>
        </div>
        <a href="${newsData.url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">Read More</a>
    `;
    
    newsContainer.appendChild(newsItem);
}

// Update air quality data display
function updateAirQualityData(airData) {
    if (!airData) return;
    
    // Update AQI value
    const aqiValue = document.getElementById('aqi-value');
    if (aqiValue) {
        aqiValue.textContent = airData.aqi;
        
        // Update color based on AQI value
        const aqiCard = aqiValue.closest('.card');
        if (aqiCard) {
            aqiCard.classList.remove('border-success', 'border-warning', 'border-danger');
            
            if (airData.aqi <= 50) {
                aqiCard.classList.add('border-success');
            } else if (airData.aqi <= 100) {
                aqiCard.classList.add('border-warning');
            } else {
                aqiCard.classList.add('border-danger');
            }
        }
    }
    
    // Update AQI status
    const aqiStatus = document.getElementById('aqi-status');
    if (aqiStatus && airData.status) {
        aqiStatus.textContent = airData.status.label;
    }
    
    // Update AQI description
    const aqiDesc = document.getElementById('aqi-description');
    if (aqiDesc && airData.status) {
        aqiDesc.textContent = airData.status.description;
    }
    
    // Update location
    const aqiLocation = document.getElementById('aqi-location');
    if (aqiLocation && airData.location) {
        aqiLocation.textContent = airData.location;
    }
    
    // Update timestamp
    const aqiTimestamp = document.getElementById('aqi-timestamp');
    if (aqiTimestamp && airData.timestamp) {
        aqiTimestamp.textContent = formatTimestamp(new Date(airData.timestamp));
    }
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    return timestamp.toLocaleString();
}

// Update sustainability chart with new data
function updateSustainabilityChart(scoreData) {
    const chartElement = document.getElementById('sustainability-trend');
    if (!chartElement) return;
    
    const chart = Chart.getChart(chartElement);
    if (!chart) return;
    
    // Get the current data
    const data = chart.data.datasets[0].data;
    
    // Add the new score and remove the oldest if we have more than 9 points
    data.push(scoreData.overall);
    if (data.length > 9) {
        data.shift();
    }
    
    // Update the chart
    chart.update();
}

// Update air quality chart with historical data
function updateAirQualityChart(historyData) {
    const chartElement = document.getElementById('air-quality-chart');
    if (!chartElement) return;
    
    // Check if chart already exists
    let chart = Chart.getChart(chartElement);
    
    // Prepare data for chart
    const labels = historyData.map(item => {
        const date = new Date(item.timestamp);
        return date.getHours() + ':00';
    });
    
    const data = historyData.map(item => item.aqi);
    
    if (chart) {
        // Update existing chart
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    } else {
        // Create new chart
        chart = new Chart(chartElement, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Air Quality Index (AQI)',
                    data: data,
                    borderColor: '#20c997',
                    backgroundColor: 'rgba(32, 201, 151, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 150,
                        title: {
                            display: true,
                            text: 'AQI Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hour of Day'
                        }
                    }
                }
            }
        });
    }
}

// Add an insight to the insights container
function addInsight(insightData) {
    const insightsContainer = document.getElementById('insights-container');
    if (!insightsContainer) return;
    
    // Create insight element
    const insight = document.createElement('div');
    insight.className = 'insight-item mb-3 p-3 border rounded';
    
    // Choose icon based on category
    let icon = 'info-circle';
    switch (insightData.category) {
        case 'air_quality':
            icon = 'wind';
            break;
        case 'water':
            icon = 'droplet';
            break;
        case 'energy':
            icon = 'lightning';
            break;
        case 'waste':
            icon = 'recycle';
            break;
        case 'emissions':
            icon = 'cloud';
            break;
    }
    
    // Format date
    const date = new Date(insightData.timestamp);
    const formattedDate = date.toLocaleString();
    
    insight.innerHTML = `
        <div class="d-flex align-items-start">
            <div class="insight-icon me-3">
                <i class="bi bi-${icon} text-primary fs-4"></i>
            </div>
            <div class="insight-content">
                <p class="mb-1">${insightData.text}</p>
                <small class="text-muted">${formattedDate}</small>
            </div>
        </div>
    `;
    
    // Add to the beginning of the container
    insightsContainer.prepend(insight);
    
    // Limit the number of displayed insights to 5
    const insights = insightsContainer.querySelectorAll('.insight-item');
    if (insights.length > 5) {
        insightsContainer.removeChild(insights[insights.length - 1]);
    }
}

// Add WebSocket connection styles
const style = document.createElement('style');
style.textContent = `
    .connection-status {
        display: inline-flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 14px;
        margin-right: 15px;
    }
    
    .status-indicator {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
    
    .status-indicator.online {
        background-color: #4caf50;
        box-shadow: 0 0 5px #4caf50;
    }
    
    .status-indicator.offline {
        background-color: #f44336;
    }
    
    .status-indicator.connecting {
        background-color: #ff9800;
        animation: pulse 1.5s infinite;
    }
    
    .status-indicator.error {
        background-color: #f44336;
    }
    
    @keyframes pulse {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
    
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
    }
    
    .notification {
        background-color: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-left: 4px solid #2196f3;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        animation: slide-in 0.3s ease;
    }
    
    .notification-success {
        border-left-color: #4caf50;
    }
    
    .notification-info {
        border-left-color: #2196f3;
    }
    
    .notification-warning {
        border-left-color: #ff9800;
    }
    
    .notification-error {
        border-left-color: #f44336;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    .notification-fade {
        opacity: 0;
        transform: translateX(30px);
        transition: all 0.5s ease;
    }
    
    @keyframes slide-in {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Air Quality Status Colors */
    .status-good {
        color: #00e400;
    }
    
    .status-moderate {
        color: #ffff00;
    }
    
    .status-unhealthy {
        color: #ff0000;
    }
    
    .status-hazardous {
        color: #7e0023;
    }
    
    /* Sustainability Score Colors */
    .score-excellent {
        color: #4caf50;
    }
    
    .score-good {
        color: #2196f3;
    }
    
    .score-moderate {
        color: #ff9800;
    }
    
    .score-poor {
        color: #f44336;
    }
`;
document.head.appendChild(style);

// Video discovery functionality
function initVideoDiscovery() {
    // Initialize both search forms
    const searchForm = document.getElementById('video-search-form');
    const dashSearchForm = document.getElementById('video-search-form-dash');
    const resultsContainer = document.getElementById('video-results');
    const dashResultsContainer = document.getElementById('video-results-dash');
    
    // Setup the main video search form
    if (searchForm && resultsContainer) {
        setupSearchForm(searchForm, resultsContainer);
    } else {
        console.warn('Main video discovery elements not found in the DOM');
    }
    
    // Setup the dashboard video search form
    if (dashSearchForm && dashResultsContainer) {
        setupSearchForm(dashSearchForm, dashResultsContainer);
    } else {
        console.warn('Dashboard video discovery elements not found in the DOM');
    }
}

function setupSearchForm(form, resultsContainer) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get input elements from the form
        const keywordsInput = form.querySelector('input[id$="keywords"]');
        const organizationInput = form.querySelector('input[id$="organization"]');
        const meetingTypeInput = form.querySelector('input[id$="meeting-type"]');
        
        if (!keywordsInput) {
            showNotification('Search keywords are required', 'error');
            return;
        }
        
        const keywords = keywordsInput.value.trim();
        const organization = organizationInput ? organizationInput.value.trim() : '';
        const meetingType = meetingTypeInput ? meetingTypeInput.value.trim() : '';
        
        if (!keywords) {
            showNotification('Please enter search keywords', 'error');
            return;
        }
        
        showNotification('Searching for videos...', 'info');
        resultsContainer.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Searching for videos...</p></div>';
        
        try {
            // Build query parameters
            const params = new URLSearchParams({
                keywords: keywords
            });
            
            if (organization) params.append('organization', organization);
            if (meetingType) params.append('meeting_type', meetingType);
            
            // Fetch videos from the API
            const response = await fetch(`/api/discover-videos?${params.toString()}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                displayVideos(data.videos, resultsContainer);
                showNotification(`Found ${data.count} videos matching your criteria`, 'success');
            } else {
                showNotification(`Error: ${data.message || 'Failed to discover videos'}`, 'error');
                resultsContainer.innerHTML = '<p class="text-center text-muted">No videos found matching your criteria.</p>';
            }
        } catch (error) {
            console.error('Error discovering videos:', error);
            showNotification('Failed to discover videos. Please try again.', 'error');
            resultsContainer.innerHTML = '<p class="text-center text-danger">An error occurred while searching for videos.</p>';
        }
    });
    
    // Listen for clicks on analyze buttons
    resultsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('analyze-video-btn') || e.target.closest('.analyze-video-btn')) {
            const button = e.target.classList.contains('analyze-video-btn') ? e.target : e.target.closest('.analyze-video-btn');
            const videoUrl = button.getAttribute('data-url');
            
            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
            
            await analyzeDiscoveredVideo(videoUrl);
            
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-brain"></i> Analyze';
        }
    });
}

function displayVideos(videos, container) {
    if (!videos || videos.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No videos found matching your criteria.</p>';
        return;
    }
    
    let html = '<div class="row">';
    
    videos.forEach(video => {
        const publishDate = video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'Unknown date';
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="embed-responsive embed-responsive-16by9">
                        <img src="${video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}" 
                             class="card-img-top" alt="${video.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${video.title}</h5>
                        <p class="card-text text-muted">${video.channelTitle} • ${publishDate}</p>
                        <p class="card-text">${video.description ? video.description.substring(0, 100) + '...' : 'No description available'}</p>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <a href="${video.url}" target="_blank" class="btn btn-sm btn-outline-secondary">
                                <i class="fas fa-external-link-alt"></i> Watch
                            </a>
                            <button class="btn btn-sm btn-primary analyze-video-btn" data-url="${video.url}">
                                <i class="fas fa-brain"></i> Analyze
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

async function analyzeDiscoveredVideo(videoUrl) {
    if (!videoUrl) {
        showNotification('Invalid video URL', 'error');
        return;
    }
    
    showNotification('Analyzing video...', 'info');
    
    try {
        const formData = new FormData();
        formData.append('video_url', videoUrl);
        
        const response = await fetch('/api/analyze-discovered', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Display insights
            showNotification('Analysis complete!', 'success');
            
            // Add insights to the insights container
            if (data.insights) {
                const insightData = {
                    id: new Date().getTime(),
                    title: data.video_info?.title || 'Video Analysis',
                    content: data.insights.summary || 'Analysis completed successfully',
                    source: 'Video Analysis',
                    timestamp: new Date().toISOString(),
                    type: 'analysis'
                };
                
                addInsight(insightData);
            }
            
            // Switch to insights tab/section
            showSection('insights');
            
        } else if (data.status === 'processing') {
            showNotification(data.message || 'Video is being analyzed in the background', 'info');
            // Set a timer to check for results
            setTimeout(() => pollForInsights(videoUrl), 5000);
        } else {
            showNotification(`Error: ${data.message || 'Failed to analyze video'}`, 'error');
        }
    } catch (error) {
        console.error('Error analyzing video:', error);
        showNotification('Failed to analyze video. Please try again.', 'error');
    }
}

function pollForInsights(videoUrl) {
    // Extract video ID from URL
    const videoId = videoUrl.includes('?v=') 
        ? videoUrl.split('?v=')[1].split('&')[0]
        : videoUrl.split('/').pop();
    
    if (!videoId) {
        console.error('Could not extract video ID from URL:', videoUrl);
        return;
    }
    
    // Poll for analysis results
    fetch(`/api/analysis/status?video_id=${videoId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'completed') {
                showNotification('Analysis complete!', 'success');
                
                // Add to insights if available
                if (data.insights) {
                    const insightData = {
                        id: new Date().getTime(),
                        title: data.video_info?.title || 'Video Analysis',
                        content: data.insights.summary || 'Analysis completed successfully',
                        source: 'Video Analysis',
                        timestamp: new Date().toISOString(),
                        type: 'analysis'
                    };
                    
                    addInsight(insightData);
                }
            } else if (data.status === 'processing') {
                // Continue polling
                setTimeout(() => pollForInsights(videoUrl), 5000);
            } else {
                showNotification(`Analysis failed: ${data.message || 'Unknown error'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error polling for insights:', error);
            // Try again after a longer delay
            setTimeout(() => pollForInsights(videoUrl), 10000);
        });
}

function displayInsights(insights) {
    // Implementation of displayInsights function
    console.log('Displaying insights:', insights);
} 