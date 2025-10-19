let products=[],slides=[],pIndex=0,pTimer=null,pDur=6000;

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
      id:x.id,
      media,
      title:x.name,
      info:`${x.brand||""} â€“ ${x.price||"Preis auf Anfrage"}`,
      features:(x.features||[]).join(", "),
      link:x.link||"#"
    };
  });

  // Einzel-Slides
  slides=[...products];

  // Vergleichs-Slides: paarweise
  for(let i=0;i<products.length-1;i++){
    const a=products[i],b=products[i+1];
    slides.push({
      compare:true,
      title:`Vergleich: ${a.title} vs ${b.title}`,
      info:"GegenÃ¼berstellung der Features",
      media:`
        <div style="display:flex;gap:1rem;justify-content:center">
          <div style="flex:1;background:#fff;color:#000;padding:.5rem;border-radius:6px">
            ${a.media}<h4>${a.title}</h4><p>${a.info}</p><small>${a.features}</small>
          </div>
          <div style="flex:1;background:#fff;color:#000;padding:.5rem;border-radius:6px">
            ${b.media}<h4>${b.title}</h4><p>${b.info}</p><small>${b.features}</small>
          </div>
        </div>`
    });
  }
}

function startPStories(){
  loadProducts().then(()=>{
    if(!slides.length) return;
    const ov=document.querySelector(".story-overlay");
    ov.style.display="flex";
    pIndex=0; showPStory();
  });
}

function showPStory(){
  const s=slides[pIndex]; if(!s)return;
  const ov=document.querySelector(".story-overlay");
  ov.querySelector(".story-content").innerHTML=`
    ${s.media}
    <h3>${s.title}</h3>
    <p>${s.info}</p><div id="poll-here" style="margin-top:.5rem"></div>
    ${!s.compare?`<a class="btn" href="${s.link}" target="_blank" rel="noopener">ðŸ”— Zum Produkt</a>`:""}
  `;
  const bars=ov.querySelectorAll(".story-progress span");
  bars.forEach((b,i)=>{b.style.width=i<pIndex?"100%":(i===pIndex?"0":"0");});
  animateP(bars[pIndex]);
  try{ const spot=document.getElementById("poll-here"); if(spotclearTimeout(pTimer);clearTimeout(pTimer);window.renderPoll){ if(s.compare){ renderPoll(spot,"cmp-"+pIndex,["â—€ Links besser","â–¶ Rechts besser"]); } else { renderPoll(spot,"prod-"+pIndex,["â­ Will ich merken","ðŸ™‚ Interessant"]); } } }catch(e){}
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
function nextP(){ pIndex=(pIndex+1)%slides.length; showPStory(); }
function prevP(){ pIndex=(pIndex-1+slides.length)%slides.length; showPStory(); }

window.addEventListener("DOMContentLoaded",()=>{
  const ov=document.querySelector(".story-overlay");
  const bars=ov.querySelector(".bars");
  bars.innerHTML="";
  for(let i=0;i<15;i++){
    const div=document.createElement("div");
    div.className="story-progress";div.innerHTML="<span></span>";
    bars.appendChild(div);
  }
  ov.querySelector(".prev").onclick=()=>{ prevP(); };
  ov.querySelector(".next").onclick=()=>{ nextP(); };
  startPStories();
});
