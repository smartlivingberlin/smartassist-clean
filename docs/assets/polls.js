/**
 * Minimalist Poll-Widget
 * - localStorage basiert, keine Cookies/Server
 * - renderPoll(el, key, options) → Balken + Prozent + klickbar
 */
(function(){
  const LS="smartassist-polls";
  function load(){ try{return JSON.parse(localStorage.getItem(LS)||"{}");}catch(e){return{}} }
  function save(d){ localStorage.setItem(LS, JSON.stringify(d)); }
  function total(obj){ return Object.values(obj).reduce((a,b)=>a+b,0); }

  window.renderPoll=function(el,key,options){
    const data=load();
    data[key]=data[key]||Object.fromEntries(options.map(o=>[o,0]));
    const votes=data[key];
    const wrap=document.createElement("div");
    wrap.className="poll";
    wrap.style.marginTop="8px";

    function draw(disabled=false){
      const sum=Math.max(1,total(votes));
      wrap.innerHTML=options.map(o=>{
        const pct=Math.round(100*(votes[o]/sum));
        return `<button class="poll-opt${disabled?' disabled':''}" data-o="${o}">
          <span>${o}</span>
          <span class="bar"><i style="width:${pct}%"></i></span>
          <span class="pct">${pct}%</span>
        </button>`;
      }).join("");
      wrap.querySelectorAll(".poll-opt").forEach(btn=>{
        btn.onclick=()=>{
          if(btn.classList.contains("disabled")) return;
          const opt=btn.dataset.o;
          votes[opt]=(votes[opt]||0)+1; save(data);
          draw(true);
        };
      });
    }
    const style=document.createElement("style");
    style.textContent=`
      .poll-opt{display:flex;gap:.6rem;align-items:center;justify-content:space-between;width:100%;margin:.25rem 0;padding:.4rem .5rem;border:1px solid var(--border);background:var(--card);border-radius:10px;cursor:pointer}
      .poll-opt:hover{box-shadow:var(--shadow);transform:translateY(-1px)}
      .poll-opt.disabled{opacity:.8;cursor:default}
      .poll-opt .bar{flex:1;height:8px;background:#e5e7eb;border-radius:10px;overflow:hidden;margin:0 .4rem}
      .poll-opt .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--brand),var(--accent))}
    `;
    document.head.appendChild(style);
    el.innerHTML=""; el.appendChild(wrap);
    const alreadyVoted = false; // lokal, pro Seite neu abstimmbar; falls pro Schlüssel sperren: setze true wenn LS-Flag
    draw(alreadyVoted);
  }
})();
