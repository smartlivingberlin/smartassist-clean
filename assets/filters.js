/* Client-Filter: Tags, Brand, Preis */
(function(){
  const state={ q:"", tags:new Set(), brands:new Set(), price:null };
  const PRICE_RANGES=[
    {id:"p1", label:"< 1000 €", test:v=>v>0 && v<1000},
    {id:"p2", label:"1000–5000 €", test:v=>v>=1000 && v<=5000},
    {id:"p3", label:"> 5000 €", test:v=>v>5000}
  ];
  window.attachFilters = function(products, render){
    const host=document.getElementById('filters'); if(!host) return;
    // Sammle Tags/Brands
    const allTags=new Set(); const allBrands=new Set();
    products.forEach(p=>{
      (p.tags||[]).forEach(t=>allTags.add(t));
      if(p.brand) allBrands.add(p.brand);
    });
    host.innerHTML = `
      <div class="kv">
        ${(Array.from(allTags).sort().slice(0,24)).map(t=>`<button class="chip" data-tag="${t}">#${t}</button>`).join('')}
      </div>
      <div class="kv">
        ${(Array.from(allBrands).sort().slice(0,20)).map(b=>`<button class="chip" data-brand="${b}">${b}</button>`).join('')}
      </div>
      <div class="kv">
        ${PRICE_RANGES.map(r=>`<button class="chip" data-price="${r.id}">${r.label}</button>`).join('')}
        <button class="chip" id="resetFilters">Reset</button>
      </div>`;
    host.addEventListener('click',e=>{
      const t=e.target.closest('.chip'); if(!t) return;
      if(t.dataset.tag){ toggle(state.tags,t.dataset.tag,t); }
      if(t.dataset.brand){ toggle(state.brands,t.dataset.brand,t); }
      if(t.dataset.price){ state.price = state.price===t.dataset.price ? null : t.dataset.price; toggleActiveSingle(host,'[data-price]',t.dataset.price); }
      if(t.id==='resetFilters'){ state.tags.clear(); state.brands.clear(); state.price=null; host.querySelectorAll('.chip.active').forEach(c=>c.classList.remove('active')); }
      renderWithFilters(products, render);
    });
    function toggle(set,val,el){ if(set.has(val)){ set.delete(val); el.classList.remove('active'); } else { set.add(val); el.classList.add('active'); } }
    function toggleActiveSingle(root,sel,id){ root.querySelectorAll(sel).forEach(b=>b.classList.toggle('active', b.dataset.price===id)); }
  };
  window.renderWithFilters = function(products, render){
    const pr = (p)=> {
      let ok=true;
      if(state.tags.size){ ok = ok && (p.tags||[]).some(t=>state.tags.has(t)); }
      if(ok && state.brands.size){ ok = state.brands.has(p.brand); }
      if(ok && state.price){
        const val=Number(p.price_eur||0);
        const rng = PRICE_RANGES.find(r=>r.id===state.price);
        ok = rng ? rng.test(val) : ok;
      }
      return ok;
    };
    render('', products.filter(pr));
  };
})();
