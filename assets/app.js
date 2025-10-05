/* Modal */
(function(){ window.SA_MODAL={
  open(id){document.getElementById(id).style.display='flex'},
  close(id){document.getElementById(id).style.display='none'}
};})();

/* Katalog – Vergleich+ */
async function initCatalog(){
  const P = await fetch('data/products.json').then(r=>r.json()).catch(()=>[]);
  const FIELDS=["name","brand","category","price_eur","weight","range_km","battery_wh","reason"];
  const pick=new Set(), activeTags=new Set(), activeFields=new Set(["price_eur","weight","range_km","battery_wh"]);
  const featureChips=document.getElementById('featureChips');
  const tagChips=document.getElementById('tagChips');
  const catalog=document.getElementById('catalog');
  const bar=document.getElementById('bar'), cnt=document.getElementById('cnt');
  const go=document.getElementById('go'), clr=document.getElementById('clr'), tbl=document.getElementById('table');

  if(!catalog) return;

  featureChips.innerHTML = FIELDS.map(f=>`<span class="chip ${activeFields.has(f)?'active':''}" data-f="${f}">${f}</span>`).join('');
  featureChips.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{const f=c.dataset.f; c.classList.toggle('active'); activeFields.has(f)?activeFields.delete(f):activeFields.add(f);});

  const allTags=[...new Set(P.flatMap(p=>p.tags||[]))];
  tagChips.innerHTML = allTags.map(t=>`<span class="chip" data-t="${t}">${t}</span>`).join('');
  tagChips.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{c.classList.toggle('active'); const t=c.dataset.t; c.classList.contains('active')?activeTags.add(t):activeTags.delete(t); render();});

  function card(p){return `
    <div class="card">
      ${p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:''}
      <div class="pad">
        <div class="badge">${p.category||'Alltag'}</div>
        <h3>${p.name}</h3>
        <p class="muted">${p.brand||''}</p>
        <p><strong>${p.price_eur? (p.price_eur.toLocaleString('de-DE')+' €') : ''}</strong> ${p.weight?(' · '+p.weight):''} ${p.range_km?(' · '+p.range_km+' km'):''}</p>
        ${p.reason?`<p class="muted">${p.reason}</p>`:''}
        <div class="chips" style="margin-top:.4rem">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
        <div style="display:flex;gap:.5rem;margin-top:.6rem">
          <button class="btn" data-add="${p.id}">Vergleichen</button>
          ${p.link?`<a class="btn secondary" href="${p.link}" target="_blank" rel="noopener">Zur Website</a>`:''}
        </div>
      </div>
      <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Product","name":p.name,"brand":p.brand,"category":p.category,"offers":{"@type":"Offer","priceCurrency":"EUR","price":p.price_eur||0}})}</script>
    </div>`;}

  function render(){
    const list = P.filter(p=>!activeTags.size || (p.tags||[]).some(t=>activeTags.has(t)));
    catalog.innerHTML = list.map(card).join('');
    catalog.querySelectorAll('button[data-add]').forEach(b=>b.onclick=()=>{pick.add(b.dataset.add); update();});
  }
  function update(){ const n=pick.size; cnt.textContent=n; bar.style.display=n?'flex':'none'; }
  clr.onclick=()=>{pick.clear(); update(); tbl.innerHTML='';};
  go.onclick=()=>{
    const chosen=P.filter(p=>pick.has(p.id));
    if(!chosen.length){tbl.innerHTML='';return;}
    const fields=[...activeFields];
    const head='<tr>'+fields.map(f=>`<th>${f}</th>`).join('')+'</tr>';
    const rows=chosen.map(p=>'<tr>'+fields.map(f=>{
      const v = p[f];
      return `<td>${f==='price_eur' ? (v? (v.toLocaleString('de-DE')+' €') : '') : (v||'')}</td>`;
    }).join('')+'</tr>').join('');
    tbl.innerHTML='<div class="compare-table"><table>'+head+rows+'</table></div>';
    window.scrollTo({top:tbl.offsetTop-60,behavior:'smooth'});
  };
  render();
}

/* Events – .ics Export (bevorstehend) */
async function initEvents(){
  const wrap=document.getElementById('events'); if(!wrap) return;
  const ev=await fetch('data/events.json').then(r=>r.json()).catch(()=>[]);
  const upcoming = ev.filter(e=> new Date(e.end)>=new Date());
  wrap.innerHTML = upcoming.map(e=>`
    <a class="card event-card" href="${e.url}" target="_blank" rel="noopener">
      <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200" alt="${e.title}">
      <div class="pad">
        <h3>${e.title}</h3>
        <p class="muted">${e.city} · ${e.start}–${e.end}</p>
      </div>
    </a>`).join('') || '<div class="card"><div class="pad">Keine bevorstehenden Events.</div></div>';

  const btn=document.getElementById('dl');
  if(btn){
    btn.onclick=function(){
      if(!upcoming.length) return;
      const esc=s=>String(s).replace(/[,;]/g,'');
      const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SmartAssist//Events//DE"];
      upcoming.forEach(e=>{
        lines.push(
          "BEGIN:VEVENT",
          "SUMMARY:"+esc(e.title),
          "DTSTART;VALUE=DATE:"+e.start.replace(/-/g,''),
          "DTEND;VALUE=DATE:"+e.end.replace(/-/g,''),
          "LOCATION:"+esc(e.city),
          "URL:"+e.url,
          "END:VEVENT"
        );
      });
      lines.push("END:VCALENDAR");
      const blob=new Blob([lines.join("\r\n")],{type:"text/calendar"});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download="smartassist-events.ics"; a.click();
    };
  }
}

/* Boot */
document.addEventListener('DOMContentLoaded', ()=>{ initCatalog(); initEvents(); });
