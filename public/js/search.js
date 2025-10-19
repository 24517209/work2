// Search Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupSearchForm();
    // Load all events initially
    searchEvents();
});

function setupSearchForm() {
    const form = document.getElementById('searchForm');
    const resetBtn = document.getElementById('resetBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        searchEvents();
    });
    
    resetBtn.addEventListener('click', function() {
        form.reset();
        searchEvents();
    });
}

async function searchEvents() {
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    // Build query parameters
    for (const [key, value] of formData.entries()) {
        if (value.trim()) {
            params.append(key, value.trim());
        }
    }
    
    try {
        showLoading();
        
        // Get all events and filter client-side (since we don't have a search API)
        const response = await fetch('/api/events');
        
        if (!response.ok) {
            throw new Error('Failed to load events');
        }
        
        const allEvents = await response.json();
        const filteredEvents = filterEvents(allEvents, params);
        
        displayResults(filteredEvents);
        
    } catch (error) {
        console.error('Error searching events:', error);
        showError(error.message);
    }
}

function filterEvents(events, params) {
    let filtered = [...events];
    
    // Filter by date range
    const dateFrom = params.get('dateFrom');
    const dateTo = params.get('dateTo');
    
    if (dateFrom) {
        filtered = filtered.filter(event => new Date(event.date) >= new Date(dateFrom));
    }
    
    if (dateTo) {
        filtered = filtered.filter(event => new Date(event.date) <= new Date(dateTo));
    }
    
    // Filter by location
    const location = params.get('location');
    if (location) {
        filtered = filtered.filter(event => 
            event.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Filter by status
    const status = params.get('status');
    if (status) {
        filtered = filtered.filter(event => event.status === status);
    }
    
    // Filter by keyword
    const keyword = params.get('keyword');
    if (keyword) {
        const keywordLower = keyword.toLowerCase();
        filtered = filtered.filter(event => 
            event.name.toLowerCase().includes(keywordLower) ||
            (event.description && event.description.toLowerCase().includes(keywordLower))
        );
    }
    
    return filtered;
}

function displayResults(events) {
    const resultsContainer = document.getElementById('results');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    // Hide loading and error
    loadingElement.style.display = 'none';
    errorElement.style.display = 'none';
    
    if (events.length === 0) {
        resultsContainer.innerHTML = '<p class="no-events">No matching events found.</p>';
        return;
    }
    
    resultsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
    const formattedDate = formatDate(event.date);
    const description = event.description ? 
        (event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description) : 
        'No description available.';
    
    return `
        <div class="card">
            <div class="row">
                <span class="pill">${event.status}</span>
                <span class="badge">${escapeHtml(event.location)}</span>
            </div>
            <h3>${escapeHtml(event.name)}</h3>
            <p>${escapeHtml(description)}</p>
            <div class="row">
                <span><strong>Date:</strong> ${formattedDate}</span>
            </div>
            <div class="actions">
                <a href="event-detail.html?id=${event.id}">
                    <button class="ghost">View Details</button>
                </a>
            </div>
        </div>
    `;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('results').innerHTML = '';
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


