// Admin Events List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

async function loadEvents() {
    try {
        const response = await fetch('/api/admin/events');
        
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
    const eventsGrid = document.getElementById('events-grid');
    const eventsContainer = document.getElementById('events-container');
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '<p class="no-events">No events found. <a href="add-event.html">Create your first event</a>.</p>';
    } else {
        eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
    }
    
    // Hide loading, show container
    document.getElementById('loading').style.display = 'none';
    eventsContainer.style.display = 'block';
}

function createEventCard(event) {
    const formattedDate = formatDate(event.date);
    const statusClass = event.status === 'upcoming' ? 'status-upcoming' : 'status-completed';
    
    return `
        <div class="event-card">
            <h3>${escapeHtml(event.name)}</h3>
            <div class="event-meta">
                <span><strong>Date:</strong> ${formattedDate}</span>
                <span><strong>Location:</strong> ${escapeHtml(event.location)}</span>
                <span class="event-status ${statusClass}">${event.status}</span>
            </div>
            ${event.description ? `<p class="event-description">${escapeHtml(event.description.substring(0, 100))}${event.description.length > 100 ? '...' : ''}</p>` : ''}
            <div class="event-actions">
                <a href="edit-event.html?id=${event.id}" class="btn-small btn-edit">Edit</a>
                <button onclick="deleteEvent(${event.id}, '${escapeHtml(event.name)}')" class="btn-small btn-delete">Delete</button>
            </div>
        </div>
    `;
}

async function deleteEvent(eventId, eventName) {
    if (!confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/events/${eventId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to delete event');
        }
        
        // Show success message and reload events
        alert('Event deleted successfully!');
        loadEvents();
        
    } catch (error) {
        console.error('Error deleting event:', error);
        alert(error.message);
    }
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
