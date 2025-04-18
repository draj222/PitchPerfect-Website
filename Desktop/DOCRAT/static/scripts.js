document.addEventListener('DOMContentLoaded', () => {
    // Check server status on page load
    checkServerStatus();
    
    // Set up button event listeners
    document.getElementById('try-api').addEventListener('click', tryApiCall);
    
    // Set up file input change handler
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', updateFileName);
    }
    
    // Set up extraction form submission
    const extractionForm = document.getElementById('extraction-form');
    if (extractionForm) {
        extractionForm.addEventListener('submit', handleExtractionSubmit);
    }
    
    // Industry form submission handler
    const industryForm = document.getElementById('industry-form');
    if (industryForm) {
        industryForm.addEventListener('submit', handleIndustrySubmit);
    }
    
    // Tab switching in the personalized feed
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => switchTab(button.dataset.tab));
        });
    }
    
    // Load current industry
    loadCurrentIndustry();
    
    // Load personalized feed
    loadPersonalizedFeed();
});

// Function to check server status
async function checkServerStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusBadge = statusIndicator.querySelector('.status-badge');
    
    try {
        const response = await fetch('/health');
        const data = await response.json();
        
        if (data.status === 'ok') {
            statusBadge.textContent = 'Online';
            statusBadge.classList.add('online');
            statusBadge.classList.remove('offline');
        } else {
            throw new Error('Server not fully operational');
        }
    } catch (error) {
        statusBadge.textContent = 'Offline';
        statusBadge.classList.add('offline');
        statusBadge.classList.remove('online');
        console.error('Server health check failed:', error);
    }
}

// Function to load current industry
async function loadCurrentIndustry() {
    try {
        const response = await fetch('/api/industry');
        const data = await response.json();
        
        // Update industry dropdown
        const industrySelect = document.getElementById('industry-select');
        if (industrySelect) {
            industrySelect.value = data.current_industry;
        }
        
        return data.current_industry;
    } catch (error) {
        console.error('Failed to load industry:', error);
        return null;
    }
}

// Function to handle industry form submission
async function handleIndustrySubmit(event) {
    event.preventDefault();
    
    const industrySelect = document.getElementById('industry-select');
    const industryStatus = document.getElementById('industry-status');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Setting...';
    industryStatus.innerHTML = '<div class="loading-inline"><div class="spinner-small"></div> Updating industry settings...</div>';
    
    try {
        // Send industry to server
        const formData = new FormData();
        formData.append('industry', industrySelect.value);
        
        const response = await fetch('/api/industry', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            industryStatus.innerHTML = '<div class="success-message">Industry updated successfully!</div>';
            
            // Reload personalized feed with new industry
            loadPersonalizedFeed();
            
            setTimeout(() => {
                industryStatus.innerHTML = '';
            }, 3000);
        } else {
            industryStatus.innerHTML = `<div class="error-message">${data.message || 'Failed to update industry.'}</div>`;
        }
    } catch (error) {
        console.error('Industry submission error:', error);
        industryStatus.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Set Industry';
    }
}

// Function to load personalized feed
async function loadPersonalizedFeed() {
    const loadingElement = document.getElementById('feed-loading');
    
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
    
    // Load the active tab first
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabName = activeTab.dataset.tab;
        await loadTabContent(tabName);
    }
    
    // Hide loading indicator
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Function to switch between tabs
async function switchTab(tabName) {
    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update active tab pane
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        if (pane.id === `${tabName}-feed`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
    
    // Load tab content if not already loaded
    const tabContent = document.querySelector(`#${tabName}-feed .meetings-list`);
    if (tabContent && tabContent.children.length === 0) {
        // Show loading indicator
        const loadingElement = document.getElementById('feed-loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
        
        await loadTabContent(tabName);
        
        // Hide loading indicator
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Function to load tab content
async function loadTabContent(tabName) {
    try {
        let endpoint;
        switch (tabName) {
            case 'recommended':
                endpoint = '/api/recommended';
                break;
            case 'upcoming':
                endpoint = '/api/upcoming';
                break;
            case 'recent':
                endpoint = '/api/recent';
                break;
            default:
                throw new Error(`Unknown tab: ${tabName}`);
        }
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        // Render meetings in the appropriate tab
        const meetingsContainer = document.querySelector(`#${tabName}-feed .meetings-list`);
        if (meetingsContainer) {
            renderMeetings(data.meetings, meetingsContainer);
        }
    } catch (error) {
        console.error(`Error loading ${tabName} feed:`, error);
        const meetingsContainer = document.querySelector(`#${tabName}-feed .meetings-list`);
        if (meetingsContainer) {
            meetingsContainer.innerHTML = `<div class="error-message">Failed to load ${tabName} meetings: ${error.message}</div>`;
        }
    }
}

// Function to render meetings in a container
function renderMeetings(meetings, container) {
    if (meetings.length === 0) {
        container.innerHTML = '<div class="no-meetings">No meetings found for this category.</div>';
        return;
    }
    
    let html = '';
    
    meetings.forEach(meeting => {
        // Format date
        const date = new Date(meeting.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create relevance badge CSS class
        let relevanceClass = 'low-relevance';
        if (meeting.relevance_score >= 85) {
            relevanceClass = 'high-relevance';
        } else if (meeting.relevance_score >= 70) {
            relevanceClass = 'medium-relevance';
        }
        
        // Create HTML for the meeting card
        html += `
            <div class="meeting-item">
                <div class="meeting-header">
                    <h4 class="meeting-title">${meeting.title}</h4>
                    <span class="relevance-badge ${relevanceClass}">${meeting.relevance_score}% relevant</span>
                </div>
                <div class="meeting-meta">
                    <span class="meeting-source">${meeting.source}</span>
                    <span class="meeting-date">📅 ${formattedDate} at ${formattedTime}</span>
                </div>
                <p class="meeting-description">${meeting.description}</p>
                
                <div class="meeting-actions">
                    <a href="${meeting.url}" target="_blank" class="view-source-btn">View Source</a>
                    <button class="extract-btn" data-url="${meeting.url}">Extract Insights</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners for extract buttons
    const extractButtons = container.querySelectorAll('.extract-btn');
    extractButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.dataset.url;
            if (url) {
                // Populate the URL input in the extraction form
                const urlInput = document.getElementById('url-input');
                if (urlInput) {
                    urlInput.value = url;
                    
                    // Scroll to the extraction form
                    const extractionForm = document.getElementById('extraction-form');
                    if (extractionForm) {
                        extractionForm.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
}

// Function to demonstrate API call
async function tryApiCall() {
    const responseElement = document.getElementById('api-response').querySelector('code');
    const tryButton = document.getElementById('try-api');
    
    // Change button state
    tryButton.textContent = 'Loading...';
    tryButton.disabled = true;
    
    try {
        // Try to call the /api endpoint
        const response = await fetch('/api');
        const data = await response.json();
        
        // Display formatted JSON response
        responseElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        responseElement.textContent = `Error: ${error.message}`;
        console.error('API call failed:', error);
    } finally {
        // Reset button state
        tryButton.textContent = 'Try It';
        tryButton.disabled = false;
    }
}

// Function to update file name display
function updateFileName() {
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
        fileNameDisplay.textContent = 'No file chosen';
    }
}

// Function to handle extraction form submission
async function handleExtractionSubmit(event) {
    event.preventDefault();
    
    const urlInput = document.getElementById('url-input');
    const fileInput = document.getElementById('file-input');
    const loadingElement = document.getElementById('extraction-loading');
    const resultsContainer = document.getElementById('results-container');
    
    // Check if at least one input has a value
    if (!urlInput.value && fileInput.files.length === 0) {
        alert('Please enter a URL or upload a file');
        return;
    }
    
    // Show loading indicator
    loadingElement.style.display = 'flex';
    resultsContainer.innerHTML = '';
    
    // Create form data
    const formData = new FormData();
    if (urlInput.value) {
        formData.append('url', urlInput.value);
    }
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }
    
    try {
        // Send API request
        const response = await fetch('/api/extract', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Hide loading indicator
        loadingElement.style.display = 'none';
        
        // Display extraction results
        displayExtractionResults(data);
    } catch (error) {
        console.error('Extraction failed:', error);
        loadingElement.style.display = 'none';
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>Extraction failed: ${error.message}</p>
            </div>
        `;
    }
}

// Function to display extraction results
function displayExtractionResults(meeting) {
    const resultsContainer = document.getElementById('results-container');
    
    // Format date and time
    const dateObj = new Date(meeting.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create topic tags HTML
    const topicTags = meeting.topics.map(topic => 
        `<span class="topic-tag">${topic}</span>`
    ).join('');
    
    // YouTube video embed if available
    let youtubeEmbed = '';
    if (meeting.is_youtube && meeting.video_id) {
        youtubeEmbed = `
            <div class="video-container">
                <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/${meeting.video_id}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
    }
    
    // Create HTML for meeting card
    const meetingHtml = `
        <div class="meeting-card" data-meeting-id="${meeting.id}">
            <div class="meeting-header">
                <h4 class="meeting-title">${meeting.title}</h4>
                <div class="meeting-meta">
                    <span>📅 ${formattedDate} at ${formattedTime}</span>
                    <span>⏱️ ${meeting.duration}</span>
                    <span>📍 ${meeting.location}</span>
                </div>
            </div>
            
            ${youtubeEmbed}
            
            <div class="meeting-content">
                <p><strong>Source:</strong> ${meeting.source || 'Unknown'}</p>
                <p><strong>Summary:</strong> ${meeting.transcript_summary || 'Not available'}</p>
                
                <div class="meeting-topics">
                    ${topicTags}
                </div>
            </div>
            
            <div class="extraction-details">
                <p>Extraction confidence: ${meeting.extraction_confidence || 'N/A'}</p>
                <p>Processing time: ${meeting.processing_time || 'N/A'}</p>
                <p>Method: ${meeting.extraction_method || 'AI Processing'}</p>
            </div>
            
            <div class="meeting-actions">
                <button class="insights-btn" onclick="getActionableInsights(${meeting.id})">
                    View Actionable Insights
                </button>
            </div>
            
            <div class="insights-container" id="insights-${meeting.id}" style="display: none;">
                <div class="insights-loading" id="insights-loading-${meeting.id}">
                    <div class="spinner"></div>
                    <p>Generating insights...</p>
                </div>
                <div class="insights-content" id="insights-content-${meeting.id}"></div>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = meetingHtml;
}

// Function to get actionable insights
async function getActionableInsights(meetingId) {
    // Get elements
    const insightsContainer = document.getElementById(`insights-${meetingId}`);
    const insightsLoading = document.getElementById(`insights-loading-${meetingId}`);
    const insightsContent = document.getElementById(`insights-content-${meetingId}`);
    
    // Toggle visibility
    if (insightsContainer.style.display === 'none') {
        insightsContainer.style.display = 'block';
        
        // Show loading if content is empty
        if (insightsContent.innerHTML.trim() === '') {
            insightsLoading.style.display = 'flex';
            
            try {
                // Fetch insights from API
                const response = await fetch(`/api/insights/${meetingId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                
                const insights = await response.json();
                
                // Hide loading
                insightsLoading.style.display = 'none';
                
                // Display insights
                displayInsights(insights, insightsContent);
                
            } catch (error) {
                console.error('Failed to get insights:', error);
                insightsLoading.style.display = 'none';
                insightsContent.innerHTML = `
                    <div class="error-message">
                        <p>Failed to load insights: ${error.message}</p>
                    </div>
                `;
            }
        }
    } else {
        insightsContainer.style.display = 'none';
    }
}

// Function to display insights
function displayInsights(insights, container) {
    // Create key insights HTML
    const keyInsightsHtml = insights.key_insights.map(item => `
        <div class="insight-item ${item.priority.toLowerCase()}-priority">
            <div class="insight-header">
                <span class="priority-badge">${item.priority}</span>
                <h5>${item.insight}</h5>
            </div>
            <p class="suggested-action">
                <strong>Suggested Action:</strong> ${item.suggested_action}
            </p>
        </div>
    `).join('');
    
    // Create recommendations HTML
    const recommendationsHtml = insights.follow_up_recommendations.map(rec => 
        `<li>${rec}</li>`
    ).join('');
    
    // Create stakeholders HTML
    const stakeholdersHtml = insights.key_stakeholders.map(stakeholder => 
        `<span class="stakeholder-tag">${stakeholder}</span>`
    ).join('');
    
    // Create timeline HTML
    const timelineHtml = Object.entries(insights.timeline_suggestions).map(([phase, action]) => `
        <div class="timeline-item">
            <h6>${phase.replace('_', ' ')}</h6>
            <p>${action}</p>
        </div>
    `).join('');
    
    // Assemble full insights HTML
    const insightsHtml = `
        <div class="insights-wrapper">
            <h4>Actionable Insights</h4>
            
            <div class="sentiment-overview">
                <div class="sentiment-item">
                    <h6>Overall Sentiment</h6>
                    <span class="sentiment-value">${insights.sentiment_analysis.overall}</span>
                </div>
                <div class="sentiment-item">
                    <h6>Community Reaction</h6>
                    <span class="sentiment-value">${insights.sentiment_analysis.community_reaction}</span>
                </div>
                <div class="sentiment-item">
                    <h6>Controversy Level</h6>
                    <span class="sentiment-value">${insights.sentiment_analysis.controversy_level}</span>
                </div>
            </div>
            
            <div class="insights-section">
                <h5>Key Insights & Suggested Actions</h5>
                <div class="key-insights">
                    ${keyInsightsHtml}
                </div>
            </div>
            
            <div class="insights-section">
                <h5>Follow-up Recommendations</h5>
                <ul class="recommendations-list">
                    ${recommendationsHtml}
                </ul>
            </div>
            
            <div class="insights-section">
                <h5>Key Stakeholders</h5>
                <div class="stakeholders">
                    ${stakeholdersHtml}
                </div>
            </div>
            
            <div class="insights-section">
                <h5>Timeline Suggestions</h5>
                <div class="timeline">
                    ${timelineHtml}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = insightsHtml;
}

// Add mock API endpoints for demo purposes
const mockEndpoints = [
    {
        id: 1,
        title: 'City Council Meeting - April 25, 2023',
        date: '2023-04-25T18:00:00',
        topics: ['Budget', 'Infrastructure', 'Parks']
    },
    {
        id: 2,
        title: 'Planning Committee - April 20, 2023',
        date: '2023-04-20T15:30:00',
        topics: ['Zoning', 'Permits', 'Development']
    }
];

// Demo data for the API
if (window.location.pathname === '/api/meetings') {
    document.body.innerHTML = `<pre>${JSON.stringify(mockEndpoints, null, 2)}</pre>`;
} 