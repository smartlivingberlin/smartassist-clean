/* Vergleich mit Feature-Checkboxen */
const ComparePlus = (() => {
  let selected = [];
  let products = [];
  let visibleKeys = new Set(); // via Checkboxen
  const SKIP = new Set(["name","image","link","docs","youtube_id","slug","tags","category","brand","helps"]);

  function init(_products){
    products=_products;
    const panel = document.getElementById('compare-panel');
    const table = document.getElementById('compare-table');
    const features = document.getElementById('compare-features');
    if(!panel || !table || !features) return;

    // Alle mÃ¶glichen Keys einsammeln (aus allen selektierten oder fallback: allen Produkten)
    function allKeys(){
      const base = selected.length ? selected : products;
      return [...new Set(base.flatMap(p => Object.keys(p).filter(k=>!SKIP.has(k))))];
    }

    function renderFeatureChips(){
      const keys = allKeys();
      if(visibleKeys.size===0) { // default: 3 gÃ¤ngige
        ["weight_kg","range_km","battery_Wh","payload_kg","price_eur"].forEach(k=>keys.includes(k)&&visibleKeys.add(k));
      }
      features.innerHTML = keys.map(k=>`
        <label class="chip"><input type="checkbox" data-k="${k}" ${visibleKeys.has(k)?"checked":""}> ${k}</label>
      `).join('') || '<small class="muted">Keine technischen Felder gefunden.</small>';
      features.querySelectorAll('input[type=checkbox]').forEach(cb=>{
        cb.onchange = () => { 
          if(cb.checked) visibleKeys.add(cb.dataset.k); else visibleKeys.delete(cb.dataset.k);
          renderTable();
        };
      });
    }

    function renderTable(){
      panel.style.display = selected.length ? 'block' : 'none';
      if(!selected.length){ table.innerHTML=''; return; }
      const header = selected.map(x=>`<th>${x.name}<br><button class="btn btn-outline" data-rem="${x.name}">âœ–</button></th>`).join('');
      const rows = [...visibleKeys].map(k=>`
        <tr><td>${k}</td>${selected.map(p=>`<td>${(p[k] ?? '')}</td>`).join('')}</tr>
      `).join('');
      table.innerHTML = `<tr><th>Attribut</th>${header}</tr>${rows || '<tr><td colspan="'+(selected.length+1)+'">Keine Features ausgewÃ¤hlt.</td></tr>'}`;
      table.querySelectorAll('button[data-rem]').forEach(b=>{
        b.onclick=()=>{ selected = selected.filter(p=>p.name!==b.dataset.rem); renderTable(); renderFeatureChips(); if(selected.length===0) panel.style.display='none'; };
      });
    }

    function add(item){
      if(selected.find(p=>p.name===item.name)) return renderTable();
      if(selected.length>=3){ alert("Maximal 3 Produkte vergleichen."); return; }
      selected.push(item);
      renderFeatureChips();
      renderTable();
      panel.scrollIntoView({behavior:'smooth',block:'start'});
    }

    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-compare]');
      if(!btn) return;
      const name = btn.getAttribute('data-compare');
      const item = products.find(p=>p.name===name);
      if(item) add(item);
    });

    renderFeatureChips();
    renderTable();
  }

  return { init };
})();
