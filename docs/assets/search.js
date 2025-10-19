(async function(){
  const [products, partners] = await Promise.all([
    fetch('data/products.json').then(r=>r.json()).catch(()=>[]),
    fetch('data/partners.json').then(r=>r.json()).catch(()=>[])
  ]);
  const idx = [
    ...products.map(p=>({t:'Produkt', name:p.name, href:`product/${p.slug||''}.html`, meta:[p.brand,p.category,(p.tags||[]).join(' ')].join(' ')})),
    ...partners.map(p=>({t:'Partner', name:p.name, href:`partners/${p.slug||''}.html`, meta:(p.categories||[]).join(' ')}))
  ];

  const nav=document.querySelector('.nav');
  if(!nav) return;
  const wrap=document.createElement('div');
  wrap.style.marginLeft='auto';wrap.style.position='relative';
  wrap.innerHTML=`
    <input id="ga-search" type="search" placeholder="Suchenâ€¦" style="padding:.45rem .7rem;border:1px solid #e5e7eb;border-radius:8px;min-width:220px">
    <div id="ga-results" style="position:absolute;right:0;top:38px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,.08);display:none;max-height:320px;overflow:auto;min-width:260px;z-index:99"></div>`;
  nav.appendChild(wrap);
  const input=wrap.querySelector('#ga-search');
  const box=wrap.querySelector('#ga-results');
  let pos=-1, items=[];

  const render=(list,q)=>{
    const esc=q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    const re=new RegExp("("+esc+")","ig");
    box.innerHTML=list.map((x,i)=>{
      const h=x.name.replace(re,"<mark>$1</mark>");
      return `<a href="${x.href}" class="item" data-i="${i}" style="display:block;padding:.55rem .7rem;border-bottom:1px solid #f1f5f9;text-decoration:none;color:#111">
        <strong>${h}</strong><br><span style="font-size:.85em;color:#64748b">${x.t}</span></a>`;
    }).join('')||`<div style="padding:.7rem;color:#64748b">Keine Treffer</div>`;
    box.style.display='block';
    items=[...box.querySelectorAll('.item')];
    pos=-1;
  };

  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){box.style.display='none';return;}
    const hits=idx.filter(x=>(x.name||'').toLowerCase().includes(q)||(x.meta||'').toLowerCase().includes(q)).slice(0,12);
    render(hits,q);
  });

  input.addEventListener('keydown',e=>{
    if(!items.length) return;
    if(e.key==='ArrowDown'){pos=(pos+1)%items.length;items.forEach((el,i)=>el.style.background=i===pos?'#e0f2fe':'' );e.preventDefault();}
    if(e.key==='ArrowUp'){pos=(pos-1+items.length)%items.length;items.forEach((el,i)=>el.style.background=i===pos?'#e0f2fe':'' );e.preventDefault();}
    if(e.key==='Enter' && pos>=0){location.href=items[pos].href;}
  });
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)) box.style.display='none';});
})();
