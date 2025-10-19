// Add Event JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
});

function setupFormValidation() {
    const form = document.getElementById('add-event-form');
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
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showFieldError('date-error', 'Event date cannot be in the past');
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
        const response = await fetch('/api/admin/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to create event');
        }
        
        // Show success message
        showSuccessMessage();
        
    } catch (error) {
        console.error('Error creating event:', error);
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
