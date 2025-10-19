// Event Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        showError('Event ID is required');
        return;
    }
    
    loadEventDetails(eventId);
});

async function loadEventDetails(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Event not found');
            }
            throw new Error('Failed to load event details');
        }
        
        const data = await response.json();
        displayEventDetails(data);
        
        // Load weather if coordinates are available
        if (data.event.latitude && data.event.longitude) {
            loadWeather(data.event.latitude, data.event.longitude, data.event.date);
        }
        
    } catch (error) {
        console.error('Error loading event details:', error);
        showError(error.message);
    }
}

function displayEventDetails(data) {
    const { event, registrations } = data;
    
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('event-details').style.display = 'block';
    
    // Display event information
    document.getElementById('event-name').textContent = event.name;
    document.getElementById('event-date').textContent = formatDate(event.date);
    document.getElementById('event-location').textContent = event.location;
    document.getElementById('event-description').textContent = event.description || 'No description available.';
    
    // Display status
    const statusElement = document.getElementById('event-status');
    statusElement.textContent = event.status;
    statusElement.className = `event-status status-${event.status}`;
    
    // Display registrations
    displayRegistrations(registrations);
    
    // Set up register button
    const registerBtn = document.getElementById('register-btn');
    registerBtn.href = `register.html?event=${event.id}`;
    
    if (event.status === 'completed') {
        registerBtn.textContent = 'Event Completed';
        registerBtn.classList.add('disabled');
        registerBtn.onclick = (e) => e.preventDefault();
    }
}

function displayRegistrations(registrations) {
    const registrationsList = document.getElementById('registrations-list');
    
    if (registrations.length === 0) {
        registrationsList.innerHTML = '<p class="no-registrations">No registrations yet.</p>';
        return;
    }
    
    const registrationsHTML = registrations.map(reg => `
        <div class="registration-item">
            <div class="registration-info">
                <h3>${escapeHtml(reg.user_name)}</h3>
                <p class="registration-email">${escapeHtml(reg.email)}</p>
                ${reg.phone ? `<p class="registration-phone">${escapeHtml(reg.phone)}</p>` : ''}
            </div>
            <div class="registration-meta">
                <span class="ticket-count">${reg.ticket_count} ticket${reg.ticket_count > 1 ? 's' : ''}</span>
                <span class="registration-date">${formatDateTime(reg.registration_date)}</span>
            </div>
        </div>
    `).join('');
    
    registrationsList.innerHTML = registrationsHTML;
}

async function loadWeather(latitude, longitude, eventDate) {
    try {
        // Convert event date to YYYY-MM-DD format for API
        const date = new Date(eventDate);
        const dateString = date.toISOString().split('T')[0];
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Australia%2FSydney&start_date=${dateString}&end_date=${dateString}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await response.json();
        
        if (weatherData.daily && weatherData.daily.time.length > 0) {
            displayWeather(weatherData.daily);
        }
        
    } catch (error) {
        console.error('Error loading weather:', error);
        // Don't show error to user, just don't display weather
    }
}

function displayWeather(dailyData) {
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const tempMax = document.getElementById('temp-max');
    const tempMin = document.getElementById('temp-min');
    const weatherDesc = document.getElementById('weather-desc');
    
    const weatherCode = dailyData.weather_code[0];
    const maxTemp = Math.round(dailyData.temperature_2m_max[0]);
    const minTemp = Math.round(dailyData.temperature_2m_min[0]);
    
    // Map weather codes to descriptions and icons
    const weatherMap = {
        0: { desc: 'Clear sky', icon: '☀️' },
        1: { desc: 'Mainly clear', icon: '🌤️' },
        2: { desc: 'Partly cloudy', icon: '⛅' },
        3: { desc: 'Overcast', icon: '☁️' },
        45: { desc: 'Foggy', icon: '🌫️' },
        48: { desc: 'Depositing rime fog', icon: '🌫️' },
        51: { desc: 'Light drizzle', icon: '🌦️' },
        53: { desc: 'Moderate drizzle', icon: '🌦️' },
        55: { desc: 'Dense drizzle', icon: '🌧️' },
        61: { desc: 'Slight rain', icon: '🌦️' },
        63: { desc: 'Moderate rain', icon: '🌧️' },
        65: { desc: 'Heavy rain', icon: '🌧️' },
        71: { desc: 'Slight snow', icon: '🌨️' },
        73: { desc: 'Moderate snow', icon: '🌨️' },
        75: { desc: 'Heavy snow', icon: '🌨️' },
        80: { desc: 'Slight rain showers', icon: '🌦️' },
        81: { desc: 'Moderate rain showers', icon: '🌧️' },
        82: { desc: 'Violent rain showers', icon: '🌧️' },
        95: { desc: 'Thunderstorm', icon: '⛈️' },
        96: { desc: 'Thunderstorm with hail', icon: '⛈️' },
        99: { desc: 'Heavy thunderstorm with hail', icon: '⛈️' }
    };
    
    const weather = weatherMap[weatherCode] || { desc: 'Unknown', icon: '❓' };
    
    weatherIcon.textContent = weather.icon;
    tempMax.textContent = maxTemp;
    tempMin.textContent = minTemp;
    weatherDesc.textContent = weather.desc;
    
    weatherInfo.style.display = 'block';
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

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
