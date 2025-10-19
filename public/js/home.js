// Home Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        
        if (!response.ok) {
            throw new Error('Failed to load events');
        }
        
        const events = await response.json();
        displayEvents(events);
        
    } catch (error) {
        console.error('Error loading events:', error);
        showError(error.message);
    }
}

function displayEvents(events) {
    const eventsContainer = document.getElementById('events');
    const loadingElement = document.getElementById('loading');
    
    // Hide loading
    loadingElement.style.display = 'none';
    
    if (events.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events">No upcoming events found.</p>';
        return;
    }
    
    // Filter to show only upcoming events
    const upcomingEvents = events.filter(event => event.status === 'upcoming');
    
    if (upcomingEvents.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events">No upcoming events found.</p>';
        return;
    }
    
    eventsContainer.innerHTML = upcomingEvents.map(event => createEventCard(event)).join('');
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
                    <button>View Details</button>
                </a>
            </div>
        </div>
    `;
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


