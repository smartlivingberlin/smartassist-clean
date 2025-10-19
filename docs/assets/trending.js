(function(){
  const KEY="sa_clicks";
  function load(){ try{return JSON.parse(localStorage.getItem(KEY)||"{}");}catch(e){return{}} }
  function save(d){ localStorage.setItem(KEY, JSON.stringify(d)); }
  function inc(id){ const d=load(); d[id]=(d[id]||0)+1; save(d); }
  function topIds(n=8){ const d=load(); return Object.entries(d).sort((a,b)=>b[1]-a[1]).slice(0,n).map(x=>x[0]); }

  // Auto-track clicks auf Produkt/Partner-Karten & Buttons
  function autoTrack(){
    document.querySelectorAll('[data-track]').forEach(el=>{
      el.addEventListener('click',()=>inc(el.getAttribute('data-track')));
    });
  }

  // Badges "ðŸ”¥ Trending" auf Produktkarten
  function addBadges(){
    const ids=new Set(topIds(12));
    document.querySelectorAll('[data-id]').forEach(el=>{
      const id=el.getAttribute('data-id');
      if(ids.has(id) && !el.querySelector('.badge-trend')){
        const b=document.createElement('span');
        b.className='badge badge-trend';
        b.style.marginLeft='.4rem';
        b.textContent='ðŸ”¥ Trending';
        const h = el.querySelector('h3, h2, strong') || el.firstChild;
        h && h.appendChild(b);
      }
    });
  }

  // Beim Laden aktivieren
  window.addEventListener('DOMContentLoaded',()=>{ autoTrack(); addBadges(); });

  // Expose fÃ¼r Debug
  window.SATrending={inc,topIds};
})();
