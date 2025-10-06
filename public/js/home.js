async function fetchJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('Network error');
  return res.json();
}

function formatDateTime(iso){
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function createEventCard(e){
  const percent = e.fundGoal > 0 ? Math.min(100, Math.round((Number(e.fundRaised||0)/Number(e.fundGoal))*100)) : 0;
  const priceText = e.isFree ? 'Free' : `Ticket $${Number(e.ticketPrice).toFixed(2)}`;
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="row"><span class="pill">${e.categoryName||'Other'}</span><span class="badge">${e.city||''}</span></div>
    <h3>${e.name}</h3>
    <p>${e.descriptionShort||''}</p>
    <div class="row"><span>${formatDateTime(e.startDateTime)}</span> - <span>${formatDateTime(e.endDateTime)}</span></div>
    <div class="row"><span>${priceText}</span></div>
    <div class="progress"><span style="width:${percent}%"></span></div>
    <div class="row"><small>Fundraising Progress: ${percent}%</small></div>
    <div class="actions">
      <a href="/detail.html?id=${e.id}"><button>View Details</button></a>
    </div>
  `;
  return el;
}

async function init(){
  try{
    const events = await fetchJSON('/api/events');
    const list = document.getElementById('events');
    list.innerHTML = '';
    events.forEach(e=>list.appendChild(createEventCard(e)));
  }catch(err){
    console.error(err);
    document.getElementById('events').innerHTML = '<p>Loading failed, please try again later.</p>';
  }
}

init();


