(function(){
  const KEY="sa_palette";
  function set(p){ document.documentElement.dataset.palette=p; localStorage.setItem(KEY,p); }
  window.addEventListener("DOMContentLoaded",()=>{
    const saved=localStorage.getItem(KEY)||"tech"; set(saved);
    // UI: kleinem Switcher im Footer hinzufÃ¼gen
    document.querySelectorAll('.footer').forEach(ft=>{
      const wrap=document.createElement('div');
      wrap.style.marginTop='6px';
      wrap.innerHTML=`<small>Farbschema: </small>
        <button class="chip" data-p="tech">Tech</button>
        <button class="chip" data-p="ocean">Ocean</button>
        <button class="chip" data-p="sun">Sun</button>`;
      ft.appendChild(wrap);
      wrap.querySelectorAll('button').forEach(b=>b.onclick=()=>set(b.dataset.p));
    });
  });
})();
