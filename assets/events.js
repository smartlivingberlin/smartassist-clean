(function(){
  const FKEY="sa_event_favs";
  const favs=new Set(JSON.parse(localStorage.getItem(FKEY)||"[]"));
  const fmtDate = s => new Date(s).toLocaleString('de-DE',{dateStyle:'medium', timeStyle:'short'});
  const esc = s => String(s||"").replace(/[,\n\r]/g," ");

  function saveFavs(){ localStorage.setItem(FKEY, JSON.stringify([...favs])); }

  function render(list){
    const wrap=document.getElementById('elist');
    if(!wrap) return;
    if(!list.length){ wrap.innerHTML='<p class="muted">Keine anstehenden Termine…</p>'; return; }
    wrap.innerHTML = list.map(e=>{
      const starred=favs.has(e.id);
      return `
        <article class="card" data-id="${e.id}">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
            <div>
              <h3 style="margin:.2rem 0">${e.title}</h3>
              <p class="muted" style="margin:.2rem 0">${fmtDate(e.start)} – ${fmtDate(e.end)} • ${esc(e.location)}</p>
              ${e.tags?.length? `<div class="chips">${e.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join(' ')}</div>`:''}
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="btn btn-outline" onclick="location.href='${e.url}'" title="Zur Event-Seite">🌐</button>
              <button class="btn ${starred?'':'btn-outline'}" data-star="${e.id}" title="Merken">${starred?'⭐':'☆'}</button>
            </div>
          </div>
        </article>`;
    }).join('');
    // Star-Handler
    wrap.querySelectorAll('[data-star]').forEach(b=>{
      b.onclick=()=>{
        const id=b.getAttribute('data-star');
        if(favs.has(id)){ favs.delete(id); b.textContent='☆'; b.classList.add('btn-outline'); }
        else { favs.add(id); b.textContent='⭐'; b.classList.remove('btn-outline'); }
        saveFavs();
      };
    });
  }

  function toICS(events){
    const h=s=>s.replace(/[-:]/g,'').replace(/\.\d+Z?$/,'')+'Z'; // simple UTC-ish
    const lines=[
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SmartAssist//Events//DE'
    ];
    events.forEach(e=>{
      lines.push('BEGIN:VEVENT');
      lines.push('UID:'+e.id+'@smartassist');
      lines.push('DTSTART:'+h(e.start));
      lines.push('DTEND:'+h(e.end));
      lines.push('SUMMARY:'+esc(e.title));
      if(e.location) lines.push('LOCATION:'+esc(e.location));
      if(e.url) lines.push('URL:'+e.url);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadICS(list, name){
    const blob=new Blob([toICS(list)],{type:'text/calendar'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=name||'events.ics';
    document.body.appendChild(a); a.click(); a.remove();
  }

  // Buttons verdrahten
  window.SAEvents={
    exportAll: () => fetch('data/events.json').then(r=>r.json()).then(d=>downloadICS(d,'events_all.ics')),
    exportFavs: () => fetch('data/events.json').then(r=>r.json()).then(d=>{
      const set=new Set(JSON.parse(localStorage.getItem(FKEY)||"[]"));
      const pick=d.filter(x=>set.has(x.id));
      if(!pick.length){ alert('Keine Bookmarks ⭐ vorhanden.'); return; }
      downloadICS(pick,'events_bookmarks.ics');
    })
  };

  // Initial laden + nur anstehende anzeigen
  fetch('data/events.json').then(r=>r.json()).then(d=>{
    const now=new Date();
    const upcoming=d.filter(x=>new Date(x.end)>=now).sort((a,b)=>new Date(a.start)-new Date(b.start));
    render(upcoming);
  });
})();
