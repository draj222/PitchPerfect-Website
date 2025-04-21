// Modern Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
});

// Main initialization function
function initializeDashboard() {
    setupThemeToggle();
    setupNavigation();
    initializeProgressRings();
    setupDetailPanels();
    initializeCharts();
    showDemoNotification();
    setupVideoCards();
    addFloatingEffect();
}

// Setup theme toggling (light/dark mode)
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-switch');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save user preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check user preference from previous visits
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    }
}

// Setup navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Show notification on section change
            const sectionName = this.textContent.trim();
            showNotification('info', `Navigated to ${sectionName} section`, `You are now viewing the ${sectionName} dashboard`);
        });
    });
}

// Initialize progress rings
function initializeProgressRings() {
    const rings = document.querySelectorAll('.progress-ring');
    
    rings.forEach(ring => {
        const percent = ring.getAttribute('data-percent');
        const circle = ring.querySelector('.progress-ring-circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        // Create gradient for the progress ring
        const svg = ring.querySelector('svg');
        if (svg && !svg.querySelector('defs')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            linearGradient.setAttribute('id', 'progress-gradient');
            linearGradient.setAttribute('x1', '0%');
            linearGradient.setAttribute('y1', '0%');
            linearGradient.setAttribute('x2', '100%');
            linearGradient.setAttribute('y2', '0%');
            
            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', '#00bfff');
            
            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('stop-color', '#7cfc00');
            
            linearGradient.appendChild(stop1);
            linearGradient.appendChild(stop2);
            defs.appendChild(linearGradient);
            svg.appendChild(defs);
        }
        
        // Set the stroke-dasharray and stroke-dashoffset to draw the percentage
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // Animate the progress ring
        setTimeout(() => {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }, 500);
    });
}

// Setup detail panels
function setupDetailPanels() {
    const detailsButtons = document.querySelectorAll('.details-btn');
    const detailPanel = document.getElementById('detailPanel');
    const closePanel = document.querySelector('.close-panel');
    const panelContent = document.querySelector('.panel-content');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the parent card to extract information
            const card = this.closest('.card');
            const header = card.querySelector('.card-header h3').textContent;
            
            // Populate detail panel with card-specific content
            panelContent.innerHTML = generateDetailContent(header, card);
            
            // Open the panel
            detailPanel.classList.add('open');
        });
    });
    
    // Close panel when close button is clicked
    if (closePanel) {
        closePanel.addEventListener('click', function() {
            detailPanel.classList.remove('open');
        });
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (detailPanel.classList.contains('open') && 
            !detailPanel.contains(e.target) && 
            !Array.from(detailsButtons).some(btn => btn.contains(e.target))) {
            detailPanel.classList.remove('open');
        }
    });
}

// Generate detail content for the side panel
function generateDetailContent(header, card) {
    let content = `<h2>${header}</h2>`;
    
    // Add different content based on the card type
    if (header.includes('Air Quality')) {
        content += `
            <div class="detail-section">
                <h3>Air Quality Details</h3>
                <p>The Air Quality Index (AQI) is a measure used to communicate how polluted the air currently is or how polluted it is forecast to become.</p>
                <div class="detail-stat">
                    <div class="detail-stat-label">Current AQI</div>
                    <div class="detail-stat-value">42</div>
                    <div class="detail-stat-desc">Good - Air quality is satisfactory, and air pollution poses little or no risk.</div>
                </div>
                <div class="detail-stat">
                    <div class="detail-stat-label">PM2.5</div>
                    <div class="detail-stat-value">12 µg/m³</div>
                </div>
                <div class="detail-stat">
                    <div class="detail-stat-label">Ozone</div>
                    <div class="detail-stat-value">38 ppb</div>
                </div>
                <h3>Historical Data</h3>
                <p>AQI has improved by 18% compared to the same period last year.</p>
            </div>
        `;
    } else if (header.includes('Sustainability Score')) {
        content += `
            <div class="detail-section">
                <h3>Sustainability Score Components</h3>
                <p>The sustainability score is calculated based on various environmental factors tracked over time.</p>
                <div class="detail-chart-container">
                    <canvas id="detailChartSustainability"></canvas>
                </div>
                <h3>Improvement Areas</h3>
                <ul class="detail-list">
                    <li>Reduce waste by implementing composting program</li>
                    <li>Improve building energy efficiency</li>
                    <li>Expand renewable energy usage</li>
                </ul>
            </div>
        `;
        
        // Initialize the detail chart after the content is added
        setTimeout(() => {
            const ctx = document.getElementById('detailChartSustainability');
            if (ctx) {
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: ['Water', 'Energy', 'Waste', 'Emissions', 'Transportation', 'Land Use'],
                        datasets: [{
                            label: 'Current Score',
                            data: [85, 72, 64, 91, 78, 82],
                            backgroundColor: 'rgba(0, 191, 255, 0.2)',
                            borderColor: '#00bfff',
                            pointBackgroundColor: '#00bfff'
                        }, {
                            label: 'Previous Quarter',
                            data: [81, 68, 60, 87, 75, 82],
                            backgroundColor: 'rgba(124, 252, 0, 0.1)',
                            borderColor: '#7cfc00',
                            pointBackgroundColor: '#7cfc00'
                        }]
                    },
                    options: {
                        scales: {
                            r: {
                                angleLines: {
                                    display: true
                                },
                                min: 0,
                                max: 100,
                                ticks: {
                                    stepSize: 20
                                }
                            }
                        }
                    }
                });
            }
        }, 100);
    } else {
        // Generic content for other cards
        content += `
            <div class="detail-section">
                <h3>Detailed Information</h3>
                <p>Additional details about this section will be displayed here. This includes historical data, related metrics, and actionable insights.</p>
            </div>
        `;
    }
    
    return content;
}

// Initialize Chart.js charts
function initializeCharts() {
    // Air Quality Chart
    const airQualityCtx = document.getElementById('airQualityChart');
    if (airQualityCtx) {
        const airQualityChart = new Chart(airQualityCtx, {
            type: 'line',
            data: {
                labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', 'Now'],
                datasets: [{
                    label: 'Air Quality Index',
                    data: [38, 40, 45, 50, 48, 43, 42],
                    fill: true,
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    borderColor: '#48bb78',
                    tension: 0.4,
                    pointBackgroundColor: '#48bb78',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        cornerRadius: 4,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 30,
                        max: 60,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Environmental Impact Chart
    const environmentalImpactCtx = document.getElementById('environmentalImpactChart');
    if (environmentalImpactCtx) {
        const environmentalImpactChart = new Chart(environmentalImpactCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Energy Usage (kWh)',
                    data: [320, 350, 290, 380, 320, 270, 260],
                    backgroundColor: 'rgba(66, 153, 225, 0.6)',
                    borderRadius: 4
                }, {
                    label: 'Water Usage (gal)',
                    data: [420, 450, 390, 480, 410, 350, 340],
                    backgroundColor: 'rgba(72, 187, 120, 0.6)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
        
        // Add event listeners to time filter buttons
        const timeFilterButtons = document.querySelectorAll('.time-filter button');
        timeFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                timeFilterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the selected time period
                const period = this.getAttribute('data-period');
                
                // Update chart data based on the selected period
                updateEnvironmentalChartData(environmentalImpactChart, period);
            });
        });
    }
}

// Update environmental chart data based on time period
function updateEnvironmentalChartData(chart, period) {
    // Sample data for different time periods
    const data = {
        week: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            energy: [320, 350, 290, 380, 320, 270, 260],
            water: [420, 450, 390, 480, 410, 350, 340]
        },
        month: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            energy: [1580, 1420, 1650, 1320],
            water: [1950, 1820, 2050, 1780]
        },
        year: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            energy: [5800, 5600, 5400, 5200, 4900, 4700, 4800, 5000, 5200, 5400, 5600, 5700],
            water: [7500, 7200, 6900, 6700, 6400, 6100, 6200, 6400, 6700, 7000, 7200, 7400]
        }
    };
    
    // Update chart data
    chart.data.labels = data[period].labels;
    chart.data.datasets[0].data = data[period].energy;
    chart.data.datasets[1].data = data[period].water;
    chart.update();
    
    // Show a notification about the change
    showNotification('info', 'Time Period Changed', `Viewing data for the last ${period}`);
}

// Show notifications
function showNotification(type, title, message) {
    const container = document.getElementById('toast-container');
    const template = document.getElementById('notification-template');
    
    if (!container || !template) return;
    
    // Clone the template
    const notification = template.content.cloneNode(true);
    const notificationElement = notification.querySelector('.toast-notification');
    
    // Set the icon based on type
    const iconElement = notification.querySelector('.notification-icon');
    if (iconElement) {
        iconElement.classList.add(type);
        
        // Add appropriate icon
        const iconContent = document.createElement('i');
        switch (type) {
            case 'success':
                iconContent.className = 'fas fa-check';
                break;
            case 'warning':
                iconContent.className = 'fas fa-exclamation-triangle';
                break;
            case 'error':
                iconContent.className = 'fas fa-times';
                break;
            case 'info':
            default:
                iconContent.className = 'fas fa-info';
                break;
        }
        iconElement.appendChild(iconContent);
    }
    
    // Set the title and message
    notification.querySelector('.notification-title').textContent = title;
    notification.querySelector('.notification-message').textContent = message;
    
    // Add close functionality
    const closeButton = notification.querySelector('.close-notification');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            this.closest('.toast-notification').remove();
        });
    }
    
    // Add to container
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const element = notificationElement;
        if (element && element.parentNode) {
            element.style.opacity = '0';
            element.style.transform = 'translateX(120%)';
            element.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }
    }, 5000);
}

// Show demo notification
function showDemoNotification() {
    setTimeout(() => {
        showNotification('success', 'Dashboard Loaded', 'Welcome to the Ultra Modern Sustainability Dashboard');
    }, 1000);
    
    setTimeout(() => {
        showNotification('info', 'Real-time Updates', 'The dashboard will update in real-time as new data becomes available');
    }, 3000);
}

// Setup video cards functionality
function setupVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.video-details h4').textContent;
            showNotification('info', 'Video Selected', `Now playing: ${title}`);
        });
    });
}

// Add floating 3D effect to cards
function addFloatingEffect() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            // Apply the transform
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset the transform when mouse leaves
            this.style.transform = 'translateY(-5px)';
            
            // Add a transition for smooth reset
            this.style.transition = 'transform 0.5s ease';
            
            // Remove the transition after the reset is complete
            setTimeout(() => {
                this.style.transition = 'transform var(--transition-speed), box-shadow var(--transition-speed)';
            }, 500);
        });
    });
}

// Refresh button functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.refresh-btn')) {
        const button = e.target.closest('.refresh-btn');
        const card = button.closest('.card');
        
        // Add spinning animation
        button.classList.add('fa-spin');
        
        // Show loading notification
        showNotification('info', 'Refreshing Data', 'Fetching the latest information...');
        
        // Simulate loading delay
        setTimeout(() => {
            // Remove spinning animation
            button.classList.remove('fa-spin');
            
            // Show success notification
            showNotification('success', 'Data Refreshed', 'The latest data has been loaded');
        }, 1500);
    }
}); 