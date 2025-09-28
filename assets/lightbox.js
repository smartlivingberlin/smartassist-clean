let galleryItems=[];
let currentIndex=0;
let autoplayTimer=null;
let autoplayOn=true;

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

function startAutoplay(){
  stopAutoplay();
  autoplayTimer=setInterval(nextSlide,5000);
  autoplayOn=true; updateStatus();
}
function stopAutoplay(){
  if(autoplayTimer) clearInterval(autoplayTimer);
  autoplayOn=false; updateStatus();
}
function toggleAutoplay(){ autoplayOn?stopAutoplay():startAutoplay(); }
function updateStatus(){
  const status=document.querySelector(".lightbox .status");
  if(status) status.innerText=autoplayOn?"⏸ Auto-Play läuft":"▶ Manuell";
}

function closeLightbox(){
  stopAutoplay();
  const lb=document.querySelector(".lightbox");
  if(lb) lb.remove();
  document.removeEventListener("keydown",keyHandler);
}

function keyHandler(e){
  if(e.key==="ArrowRight"){ nextSlide(); stopAutoplay(); }
  if(e.key==="ArrowLeft"){ prevSlide(); stopAutoplay(); }
  if(e.key===" "){ e.preventDefault(); toggleAutoplay(); }
  if(e.key==="Escape"){ closeLightbox(); }
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
      <button class="close">×</button>
      <button class="prev">◀</button>
      <button class="next">▶</button>
      <button class="toggle">⏯</button>
      <div class="status"></div>
    </div>`;
  document.body.appendChild(lb);

  lb.querySelector(".close").onclick=closeLightbox;
  lb.querySelector(".prev").onclick=()=>{ prevSlide(); stopAutoplay(); };
  lb.querySelector(".next").onclick=()=>{ nextSlide(); stopAutoplay(); };
  lb.querySelector(".toggle").onclick=toggleAutoplay;
  lb.onclick=e=>{ if(e.target===lb) closeLightbox(); };

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
