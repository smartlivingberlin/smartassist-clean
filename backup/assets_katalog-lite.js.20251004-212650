(async function(){
  const out=document.getElementById('catalog');
  const chipsBox=document.getElementById('chips');
  const bar=document.getElementById('compareBar');
  const cmpOut=document.getElementById('cmpOut');
  const cmpCount=document.getElementById('cmpCount');
  const btnShow=document.getElementById('cmpShow');
  const btnClear=document.getElementById('cmpClear');
  let data=[];
  try{ data=await fetch('data/products.json').then(r=>r.json()); }catch(e){}
  if(!data.length){ data=[
    {id:'exo1',name:'ExoCare X1',brand:'RoboHealth',category:'Pflege',price:14990,weight:'12 kg',range:'8 h',battery:'6000 mAh',tags:['Pflege','Exoskelett'],image:'https://picsum.photos/seed/exo1/600/400'},
    {id:'vr1',name:'VisionPro Assist',brand:'NeuroVision',category:'VR/AR',price:3990,weight:'0.8 kg',range:'kabellos',battery:'5 h',tags:['VR','Sehhilfe'],image:'https://picsum.photos/seed/vr1/600/400'},
    {id:'amr1',name:'CareBot 3000',brand:'MediRobotics',category:'Pflege',price:24990,weight:'45 kg',range:'12 h',battery:'9000 mAh',tags:['Pflege','Begleiter'],image:'https://picsum.photos/seed/care1/600/400'}
  ]; }

  const allTags=[...new Set(data.flatMap(p=>p.tags||[]))];
  const active=new Set(); const pick=new Set();

  chipsBox.innerHTML=allTags.map(t=>`<span class="chip" data-t="${t}">${t}</span>`).join('');
  chipsBox.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{ const t=ch.dataset.t; ch.classList.toggle('active'); ch.classList.contains('active')?active.add(t):active.delete(t); render(); });

  function card(p){return `
    <div class="card">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div style="padding:12px">
        <h3>${p.name}</h3>
        <p class="muted">${p.brand} · ${p.category}</p>
        <p><strong>${p.price.toLocaleString('de-DE')} €</strong></p>
        <div class="chips" style="margin:.5rem 0 0 0">${(p.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
        <button class="btn" data-add="${p.id}">Vergleichen</button>
      </div>
    </div>`;}

  function render(){
    const list=data.filter(p=>!active.size || (p.tags||[]).some(t=>active.has(t)));
    out.innerHTML=list.map(card).join('');
    out.querySelectorAll('button[data-add]').forEach(b=>b.onclick=()=>{pick.add(b.dataset.add); updateBar();});
  }
  function updateBar(){ const n=pick.size; cmpCount.textContent=n; bar.style.display=n? 'flex':'none'; }
  btnClear.onclick=()=>{ pick.clear(); updateBar(); cmpOut.innerHTML=''; };
  btnShow.onclick=()=>{
    const chosen=data.filter(p=>pick.has(p.id));
    if(!chosen.length){cmpOut.innerHTML=''; return;}
    const fields=['name','brand','category','price','weight','range','battery'];
    const head='<tr>'+fields.map(f=>`<th>${f}</th>`).join('')+'</tr>';
    const rows=chosen.map(p=>'<tr>'+fields.map(f=>`<td>${f==='price'?(p[f].toLocaleString('de-DE')+' €'):(p[f]||'')}</td>`).join('')+'</tr>').join('');
    cmpOut.innerHTML='<table>'+head+rows+'</table>';
    window.scrollTo({top:cmpOut.offsetTop-60,behavior:'smooth'});
  };
  render();
})();
