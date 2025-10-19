let galleryItems=[];
let currentIndex=0;
let autoplayTimer=null;
let autoplayOn=true;
let touchStartX=0;

function renderLightbox(index){
  const item=galleryItems[index];
  if(!item)return;
  const lb=document.querySelector(".lightbox");
  lb.querySelector(".media").innerHTML=item.media;
  lb.querySelector("h3").innerText=item.title;
  lb.querySelector("p").innerText=item.info;
  currentIndex=index;
}
function nextSlide(){ renderLightbox((currentIndex+1)%galleryItems.length); }
function prevSlide(){ renderLightbox((currentIndex-1+galleryItems.length)%galleryItems.length); }

function startAutoplay(){ stopAutoplay(); autoplayTimer=setInterval(nextSlide,5000); autoplayOn=true; updateStatus(); }
function stopAutoplay(){ if(autoplayTimer) clearInterval(autoplayTimer); autoplayOn=false; updateStatus(); }
function toggleAutoplay(){ autoplayOn?stopAutoplay():startAutoplay(); }
function updateStatus(){ const s=document.querySelector(".lightbox .status"); if(s) s.innerText=autoplayOn?"â¸ Auto-Play lÃ¤uft":"â–¶ Manuell"; }

function closeLightbox(){ stopAutoplay(); const lb=document.querySelector(".lightbox"); if(lb) lb.remove(); document.removeEventListener("keydown",keyHandler); }

function keyHandler(e){
  if(e.key==="ArrowRight"){ nextSlide(); stopAutoplay(); }
  if(e.key==="ArrowLeft"){ prevSlide(); stopAutoplay(); }
  if(e.key===" "){ e.preventDefault(); toggleAutoplay(); }
  if(e.key==="Escape"){ closeLightbox(); }
}

function touchStart(e){ touchStartX=e.changedTouches[0].screenX; }
function touchEnd(e){
  const dx=e.changedTouches[0].screenX-touchStartX;
  if(Math.abs(dx)>50){
    if(dx<0){ nextSlide(); stopAutoplay(); }
    else{ prevSlide(); stopAutoplay(); }
  }
}

function openLightbox(index){
  const item=galleryItems[index];
  if(!item)return;
  const lb=document.createElement("div");
  lb.className="lightbox";
  lb.innerHTML=`
    <div class="lightbox-content">
      <div class="media">${item.media}</div>
      <h3>${item.title}</h3>
      <p>${item.info}</p>
      <button class="close">Ã—</button>
      <button class="prev">â—€</button>
      <button class="next">â–¶</button>
      <button class="toggle">â¯</button>
      <div class="status"></div>
    </div>`;
  document.body.appendChild(lb);

  lb.querySelector(".close").onclick=closeLightbox;
  lb.querySelector(".prev").onclick=()=>{ prevSlide(); stopAutoplay(); };
  lb.querySelector(".next").onclick=()=>{ nextSlide(); stopAutoplay(); };
  lb.querySelector(".toggle").onclick=toggleAutoplay;
  lb.onclick=e=>{ if(e.target===lb) closeLightbox(); };

  // Touch Events
  lb.addEventListener("touchstart",touchStart);
  lb.addEventListener("touchend",touchEnd);

  currentIndex=index;
  startAutoplay();
  document.addEventListener("keydown",keyHandler);
}

function galleryInit(){
  galleryItems=[];
  document.querySelectorAll(".masonry .item").forEach((a,i)=>{
    const media=a.querySelector("iframe")?.outerHTML||a.querySelector("img")?.outerHTML;
    const title=a.querySelector("h3")?.innerText||"";
    const info=a.querySelector("p")?.innerText||"";
    galleryItems.push({media,title,info});
    a.onclick=e=>{
      e.preventDefault();
      openLightbox(i);
    };
  });
}
window.addEventListener("DOMContentLoaded",galleryInit);
