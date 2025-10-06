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
      <a href="/detail.html?id=${e.id}"><button class="ghost">View Details</button></a>
    </div>
  `;
  return el;
}

async function loadCategories(){
  const select = document.getElementById('categorySelect');
  try{
    const cats = await fetchJSON('/api/categories');
    cats.forEach(c=>{
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  }catch(e){console.error(e);}
}

function formToQuery(form){
  const data = new FormData(form);
  const params = new URLSearchParams();
  for(const [k,v] of data.entries()){
    if(v) params.set(k, v);
  }
  return params.toString();
}

async function search(form){
  const q = formToQuery(form);
  const url = q ? `/api/events/search?${q}` : '/api/events/search';
  const results = document.getElementById('results');
  results.innerHTML = '<p>Loading...</p>';
  try{
    const list = await fetchJSON(url);
    results.innerHTML = '';
    if(list.length === 0){
      results.innerHTML = '<p>No matching events found.</p>';
    } else {
      list.forEach(e=>results.appendChild(createEventCard(e)));
    }
  }catch(err){
    console.error(err);
    results.innerHTML = '<p>Search failed, please try again later.</p>';
  }
}

function attach(){
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', e=>{e.preventDefault(); search(form);});
  document.getElementById('resetBtn').addEventListener('click', ()=>{form.reset(); search(form);});
}

(async function init(){
  await loadCategories();
  attach();
  const form = document.getElementById('searchForm');
  search(form);
})();


