let products=[],pIndex=0,pTimer=null,pDur=6000;

async function loadProducts(){
  const d=await fetch("data/products.json").then(r=>r.json());
  products=d.map(x=>{
    let media="";
    if(x.video) media=`<iframe src="${x.video}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    else{
      const img=x.image||"https://picsum.photos/seed/"+encodeURIComponent(x.id)+"/600/400";
      media=`<img src="${img}" alt="">`;
    }
    return {
      media,
      title:x.name,
      info:`${x.brand||""} – ${x.price||"Preis auf Anfrage"}`,
      features:(x.features||[]).join(", "),
      link:x.link||"#"
    };
  });
}

function startPStories(){
  loadProducts().then(()=>{
    if(!products.length) return;
    const ov=document.querySelector(".story-overlay");
    ov.style.display="flex";
    pIndex=0; showPStory();
  });
}

function showPStory(){
  const s=products[pIndex]; if(!s)return;
  const ov=document.querySelector(".story-overlay");
  ov.querySelector(".story-content").innerHTML=`
    ${s.media}
    <h3>${s.title}</h3>
    <p>${s.info}</p>
    <p><small>${s.features}</small></p>
    <a class="btn" href="${s.link}" target="_blank" rel="noopener">🔗 Zum Produkt</a>
  `;
  const bars=ov.querySelectorAll(".story-progress span");
  bars.forEach((b,i)=>{b.style.width=i<pIndex?"100%":(i===pIndex?"0":"0");});
  animateP(bars[pIndex]);
  clearTimeout(pTimer);
  pTimer=setTimeout(()=>{ nextP(); },pDur);
}

function animateP(bar){
  let start=null;
  function step(ts){
    if(!start) start=ts;
    let p=Math.min((ts-start)/pDur,1);
    bar.style.width=(p*100)+"%";
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function nextP(){ pIndex=(pIndex+1)%products.length; showPStory(); }
function prevP(){ pIndex=(pIndex-1+products.length)%products.length; showPStory(); }

window.addEventListener("DOMContentLoaded",()=>{
  const ov=document.querySelector(".story-overlay");
  const bars=ov.querySelector(".bars");
  bars.innerHTML="";
  for(let i=0;i<10;i++){
    const div=document.createElement("div");
    div.className="story-progress";div.innerHTML="<span></span>";
    bars.appendChild(div);
  }
  ov.querySelector(".prev").onclick=()=>{ prevP(); };
  ov.querySelector(".next").onclick=()=>{ nextP(); };
  startPStories();
});
