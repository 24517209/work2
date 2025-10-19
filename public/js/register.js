// Registration Page JavaScript
let eventData = null;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    
    if (!eventId) {
        showError('Event ID is required');
        return;
    }
    
    loadEventInfo(eventId);
    setupFormValidation();
});

async function loadEventInfo(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Event not found');
            }
            throw new Error('Failed to load event information');
        }
        
        const data = await response.json();
        eventData = data.event;
        displayEventInfo(eventData);
        
    } catch (error) {
        console.error('Error loading event info:', error);
        showError(error.message);
    }
}

function displayEventInfo(event) {
    // Hide loading, show form
    document.getElementById('loading').style.display = 'none';
    document.getElementById('registration-form').style.display = 'block';
    
    // Display event information
    document.getElementById('event-name').textContent = event.name;
    document.getElementById('event-date').textContent = formatDate(event.date);
    document.getElementById('event-location').textContent = event.location;
    
    // Set up back button
    document.getElementById('back-btn').href = `event-detail.html?id=${event.id}`;
    
    // Check if event is completed
    if (event.status === 'completed') {
        showError('This event has already been completed and is no longer accepting registrations.');
        document.getElementById('registration-form').style.display = 'none';
    }
}

function setupFormValidation() {
    const form = document.getElementById('registration-form-element');
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const ticketInput = document.getElementById('ticket-count');
    
    // Real-time validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    ticketInput.addEventListener('blur', validateTicketCount);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateName() {
    const name = document.getElementById('user-name').value.trim();
    const errorElement = document.getElementById('name-error');
    
    if (!name) {
        showFieldError('name-error', 'Name is required');
        return false;
    }
    
    if (name.length < 2) {
        showFieldError('name-error', 'Name must be at least 2 characters');
        return false;
    }
    
    clearFieldError('name-error');
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const errorElement = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError('email-error', 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError('email-error', 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError('email-error');
    return true;
}

function validatePhone() {
    const phone = document.getElementById('phone').value.trim();
    const errorElement = document.getElementById('phone-error');
    
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
        showFieldError('phone-error', 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError('phone-error');
    return true;
}

function validateTicketCount() {
    const ticketCount = parseInt(document.getElementById('ticket-count').value);
    const errorElement = document.getElementById('ticket-error');
    
    if (isNaN(ticketCount) || ticketCount < 1) {
        showFieldError('ticket-error', 'Please enter a valid number of tickets (minimum 1)');
        return false;
    }
    
    if (ticketCount > 10) {
        showFieldError('ticket-error', 'Maximum 10 tickets per registration');
        return false;
    }
    
    clearFieldError('ticket-error');
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
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isTicketValid = validateTicketCount();
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isTicketValid) {
        return;
    }
    
    // Prepare form data
    const formData = {
        event_id: parseInt(new URLSearchParams(window.location.search).get('event')),
        user_name: document.getElementById('user-name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || null,
        ticket_count: parseInt(document.getElementById('ticket-count').value)
    };
    
    try {
        const response = await fetch('/api/registrations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }
        
        // Show success message
        showSuccessMessage(result.event_name);
        
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message);
    }
}

function showSuccessMessage(eventName) {
    // Hide form, show success message
    document.getElementById('registration-form').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
    
    // Set event name in success message
    document.getElementById('success-event-name').textContent = eventName;
    
    // Set up success action buttons
    const eventId = new URLSearchParams(window.location.search).get('event');
    document.getElementById('view-event-btn').href = `event-detail.html?id=${eventId}`;
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
