// Edit Event JavaScript
let eventData = null;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        showError('Event ID is required');
        return;
    }
    
    loadEventData(eventId);
    setupFormValidation();
});

async function loadEventData(eventId) {
    try {
        const response = await fetch(`/api/admin/events`);
        
        if (!response.ok) {
            throw new Error('Failed to load events');
        }
        
        const events = await response.json();
        const event = events.find(e => e.id == eventId);
        
        if (!event) {
            throw new Error('Event not found');
        }
        
        eventData = event;
        populateForm(event);
        
    } catch (error) {
        console.error('Error loading event data:', error);
        showError(error.message);
    }
}

function populateForm(event) {
    document.getElementById('name').value = event.name || '';
    document.getElementById('date').value = event.date || '';
    document.getElementById('location').value = event.location || '';
    document.getElementById('description').value = event.description || '';
    document.getElementById('status').value = event.status || 'upcoming';
    document.getElementById('latitude').value = event.latitude || '';
    document.getElementById('longitude').value = event.longitude || '';
    
    // Hide loading, show form
    document.getElementById('loading').style.display = 'none';
    document.getElementById('edit-form').style.display = 'block';
}

function setupFormValidation() {
    const form = document.getElementById('edit-event-form');
    const nameInput = document.getElementById('name');
    const dateInput = document.getElementById('date');
    const locationInput = document.getElementById('location');
    
    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    dateInput.addEventListener('blur', validateDate);
    locationInput.addEventListener('blur', validateLocation);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateName() {
    const name = document.getElementById('name').value.trim();
    
    if (!name) {
        showFieldError('name-error', 'Event name is required');
        return false;
    }
    
    if (name.length < 3) {
        showFieldError('name-error', 'Event name must be at least 3 characters');
        return false;
    }
    
    clearFieldError('name-error');
    return true;
}

function validateDate() {
    const date = document.getElementById('date').value;
    
    if (!date) {
        showFieldError('date-error', 'Event date is required');
        return false;
    }
    
    clearFieldError('date-error');
    return true;
}

function validateLocation() {
    const location = document.getElementById('location').value.trim();
    
    if (!location) {
        showFieldError('location-error', 'Location is required');
        return false;
    }
    
    if (location.length < 3) {
        showFieldError('location-error', 'Location must be at least 3 characters');
        return false;
    }
    
    clearFieldError('location-error');
    return true;
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate all required fields
    const isNameValid = validateName();
    const isDateValid = validateDate();
    const isLocationValid = validateLocation();
    
    if (!isNameValid || !isDateValid || !isLocationValid) {
        return;
    }
    
    // Prepare form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        date: document.getElementById('date').value,
        location: document.getElementById('location').value.trim(),
        description: document.getElementById('description').value.trim() || null,
        status: document.getElementById('status').value,
        latitude: document.getElementById('latitude').value || null,
        longitude: document.getElementById('longitude').value || null
    };
    
    // Convert coordinates to numbers if provided
    if (formData.latitude) {
        formData.latitude = parseFloat(formData.latitude);
    }
    if (formData.longitude) {
        formData.longitude = parseFloat(formData.longitude);
    }
    
    try {
        const response = await fetch(`/api/admin/events/${eventData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to update event');
        }
        
        // Show success message
        showSuccessMessage();
        
    } catch (error) {
        console.error('Error updating event:', error);
        alert(error.message);
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    
    // Redirect to events list after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function showError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}
