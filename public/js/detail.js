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

function renderDetail(e){
  const percent = e.fundGoal > 0 ? Math.min(100, Math.round((Number(e.fundRaised||0)/Number(e.fundGoal))*100)) : 0;
  const priceText = e.isFree ? 'Free' : `Ticket $${Number(e.ticketPrice).toFixed(2)}`;
  return `
    <div class="card">
      <div class="row"><span class="pill">${e.categoryName||'Other'}</span><span class="badge">${e.city||''}</span></div>
      <h1>${e.name}</h1>
      <p>${e.descriptionShort||''}</p>
      <p>${e.descriptionLong||''}</p>
      <div class="row"><strong>Time:</strong><span>${formatDateTime(e.startDateTime)}</span> - <span>${formatDateTime(e.endDateTime)}</span></div>
      <div class="row"><strong>Location:</strong><span>${e.venue||''}</span>, ${e.address||''}</div>
      <div class="row"><strong>Organization:</strong><span>${e.orgName||''}</span> <a href="${e.orgWebsite||'#'}" target="_blank">Website</a></div>
      <div class="row"><strong>Tickets:</strong><span>${priceText}</span></div>
      <div class="progress"><span style="width:${percent}%"></span></div>
      <div class="row"><small>Fundraising Goal: $${Number(e.fundGoal).toFixed(2)}, Raised: $${Number(e.fundRaised).toFixed(2)} (${percent}%)</small></div>
      <div class="actions">
        <button id="registerBtn">Register / Purchase</button>
      </div>
    </div>
  `;
}

async function init(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const container = document.getElementById('detail');
  if(!id){
    container.innerHTML = '<p>Event ID not provided</p>';
    return;
  }
  try{
    const data = await fetchJSON(`/api/events/${id}`);
    container.innerHTML = renderDetail(data);
    document.getElementById('registerBtn').addEventListener('click', ()=>{
      alert('This feature is under construction');
    });
  }catch(err){
    console.error(err);
    container.innerHTML = '<p>Loading failed or event does not exist.</p>';
  }
}

init();


