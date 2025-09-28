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
  autoplayOn=true;
  updateStatus();
}
function stopAutoplay(){
  if(autoplayTimer) clearInterval(autoplayTimer);
  autoplayOn=false;
  updateStatus();
}
function toggleAutoplay(){
  if(autoplayOn){ stopAutoplay(); } else { startAutoplay(); }
}
function updateStatus(){
  const status=document.querySelector(".lightbox .status");
  if(status) status.innerText=autoplayOn?"⏸ Auto-Play läuft":"▶ Manuell";
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

  lb.querySelector(".close").onclick=()=>{ stopAutoplay(); lb.remove(); };
  lb.querySelector(".prev").onclick=()=>{ prevSlide(); stopAutoplay(); };
  lb.querySelector(".next").onclick=()=>{ nextSlide(); stopAutoplay(); };
  lb.querySelector(".toggle").onclick=toggleAutoplay;
  lb.onclick=e=>{ if(e.target===lb){ stopAutoplay(); lb.remove(); } };
  currentIndex=index;
  startAutoplay();
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
