(async function(){
  const P = await fetch('data/products.json').then(r=>r.json());
  const {imgUrl, altText} = SA_MEDIA;
  const chips=document.getElementById('chips');
  const fchips=document.getElementById('featureChips');
  const grid=document.getElementById('catalog');
  const bar=document.getElementById('bar'), cnt=document.getElementById('cnt');
  const go=document.getElementById('go'), clr=document.getElementById('clr'), tbl=document.getElementById('table');
  const FIELDS_ALL=["name","brand","category","price","weight","range","battery","reason"];
  const selected=new Set(), activeTags=new Set(), activeFields=new Set(["price","weight","range","battery"]);
  const allTags=[...new Set(P.flatMap(p=>p.tags||[]))];

  chips.innerHTML=allTags.map(t=>`<span class="chip" data-t="${t}">${t}</span>`).join('');
  chips.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{c.classList.toggle('active'); const t=c.dataset.t; c.classList.contains('active')?activeTags.add(t):activeTags.delete(t); render();});

  fchips.innerHTML=FIELDS_ALL.map(f=>`<span class="chip ${activeFields.has(f)?'active':''}" data-f="${f}">${f}</span>`).join('');
  fchips.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{const f=c.dataset.f; c.classList.toggle('active'); activeFields.has(f)?activeFields.delete(f):activeFields.add(f);});

  function card(p){return `
    <div class="card">
      <img src="${imgUrl(p,'card')}" alt="${altText(p,'Produktbild')}" loading="lazy">
      <div style="padding:12px">
        <h3>${p.name}</h3>
        <p class="muted">${p.brand} · ${p.category}</p>
        <p><strong>${(p.price||0).toLocaleString('de-DE')} €</strong></p>
        ${p.reason?`<p class="notice" style="margin-top:.3rem">${p.reason}</p>`:''}
        <div class="chips" style="margin:.4rem 0">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn" data-add="${p.id}">Vergleichen</button>
          <a class="btn secondary" href="partner.html">Angebot anfragen</a>
          <a class="btn secondary" href="kontakt.html">Beratung</a>
        </div>
      </div>
      <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Product","name":p.name,"brand":p.brand,"category":p.category,"offers":{"@type":"Offer","priceCurrency":"EUR","price":p.price||0}})}</script>
    </div>`;}

  function render(){
    const list=P.filter(p=>!activeTags.size || (p.tags||[]).some(t=>activeTags.has(t)));
    grid.innerHTML=list.map(card).join('');
    grid.querySelectorAll('button[data-add]').forEach(b=>b.onclick=()=>{selected.add(b.dataset.add); update();});
  }
  function update(){ const n=selected.size; cnt.textContent=n; bar.style.display=n?'flex':'none'; }
  clr.onclick=()=>{selected.clear(); update(); tbl.innerHTML='';};
  go.onclick=()=>{
    const chosen=P.filter(p=>selected.has(p.id));
    if(!chosen.length){tbl.innerHTML='';return;}
    const fields=[...activeFields];
    const head='<tr>'+fields.map(f=>`<th>${f}</th>`).join('')+'</tr>';
    const rows=chosen.map(p=>'<tr>'+fields.map(f=>`<td>${f==='price'? ((p[f]||0).toLocaleString('de-DE')+' €') : (p[f]||'')}</td>`).join('')+'</tr>').join('');
    tbl.innerHTML='<table>'+head+rows+'</table>';
    window.scrollTo({top:tbl.offsetTop-60,behavior:'smooth'});
  };
  render();
})();
