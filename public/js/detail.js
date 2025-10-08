async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    throw new Error(`Failed to fetch ${url}: ${err.message}`);
  }
}

function formatDateTime(iso) {
  if (!iso) return 'Invalid date';
  
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatCurrency(value) {
  const num = Number(value);
  return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
}

function renderDetail(event) {
  if (!event) return '<div class="error">No event data available</div>';
  
  const fundGoal = Number(event.fundGoal) || 0;
  const fundRaised = Number(event.fundRaised) || 0;
  const percent = fundGoal > 0 ? Math.min(100, Math.round((fundRaised / fundGoal) * 100)) : 0;
  
  const priceText = event.isFree 
    ? 'Free' 
    : `Ticket ${formatCurrency(event.ticketPrice)}`;
  
  const orgWebsite = event.orgWebsite 
    ? (event.orgWebsite.startsWith('http') ? event.orgWebsite : `https://${event.orgWebsite}`)
    : '#';

  return `
    <div class="card">
      <div class="row">
        <span class="pill">${event.categoryName || 'Other'}</span>
        <span class="badge">${event.city || 'Unknown location'}</span>
      </div>
      <h1>${event.name || 'Untitled Event'}</h1>
      
      ${event.descriptionShort ? `<p class="short-description">${event.descriptionShort}</p>` : ''}
      ${event.descriptionLong ? `<p class="long-description">${event.descriptionLong}</p>` : ''}
      
      <div class="row">
        <strong>Time:</strong>
        <span>${formatDateTime(event.startDateTime)}</span> - 
        <span>${formatDateTime(event.endDateTime)}</span>
      </div>
      
      <div class="row">
        <strong>Location:</strong>
        <span>${event.venue || 'TBD'}</span>${event.address ? `, ${event.address}` : ''}
      </div>
      
      <div class="row">
        <strong>Organization:</strong>
        <span>${event.orgName || 'Unknown Organization'}</span>
        <a href="${orgWebsite}" target="_blank" rel="noopener noreferrer">Website</a>
      </div>
      
      <div class="row">
        <strong>Tickets:</strong>
        <span>${priceText}</span>
      </div>
      
      ${fundGoal > 0 ? `
        <div class="progress-container">
          <div class="progress-bar">
            <span class="progress-fill" style="width:${percent}%"></span>
          </div>
          <div class="row progress-stats">
            <small>
              Fundraising Goal: ${formatCurrency(event.fundGoal)}, 
              Raised: ${formatCurrency(event.fundRaised)} (${percent}%)
            </small>
          </div>
        </div>
      ` : ''}
      
      <div class="actions">
        <button id="registerBtn" class="register-button">Register / Purchase</button>
      </div>
    </div>
  `;
}

async function init() {
  const container = document.getElementById('detail');
  if (!container) {
    console.error('Detail container not found');
    return;
  }

  container.innerHTML = '<div class="loading">Loading event details...</div>';

  try {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (!id) {
      container.innerHTML = '<div class="error"><p>Event ID not provided. Please check the URL.</p></div>';
      return;
    }

    const data = await fetchJSON(`/api/events/${id}`);
    container.innerHTML = renderDetail(data);
    
    container.addEventListener('click', (e) => {
      if (e.target.id === 'registerBtn') {
        alert('Registration feature is coming soon!');
      }
    });

  } catch (err) {
    console.error('Initialization error:', err);
    container.innerHTML = `
      <div class="error">
        <p>Failed to load event details.</p>
        <p class="error-message">${err.message}</p>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

