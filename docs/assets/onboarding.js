(function(){
  const KEY="sa_tour_done";
  if(localStorage.getItem(KEY)) return;
  const steps=[
    "Willkommen bei SmartAssist ðŸ‘‹ â€“ Katalog, News & Partner rund um Assistenz-Robotik.",
    "Nutze die Suche oben rechts, um Produkte & Partner sofort zu finden.",
    "Stories & Galerie zeigen Highlights â€“ probier die Buttons aus!"
  ];
  function show(i=0){
    if(i>=steps.length){ localStorage.setItem(KEY,"1"); box.remove(); return; }
    cnt.innerHTML=`<p>${steps[i]}</p><div style="text-align:right"><button class="btn btn-outline" id="skip">spÃ¤ter</button> <button class="btn" id="next">weiter</button></div>`;
    cnt.querySelector('#skip').onclick=()=>{ localStorage.setItem(KEY,"1"); box.remove(); };
    cnt.querySelector('#next').onclick=()=>show(i+1);
  }
  const box=document.createElement('div'); box.className='card'; box.style.position='fixed'; box.style.bottom='12px'; box.style.left='12px'; box.style.maxWidth='360px'; box.style.zIndex='999';
  const cnt=document.createElement('div'); box.appendChild(cnt);
  document.addEventListener('DOMContentLoaded',()=>{ document.body.appendChild(box); show(0); });
})();
