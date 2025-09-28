let galleryItems=[];
let currentIndex=0;

function renderLightbox(index){
  const item=galleryItems[index];
  if(!item)return;
  const lb=document.querySelector(".lightbox");
  lb.querySelector(".media").innerHTML=item.media;
  lb.querySelector("h3").innerText=item.title;
  lb.querySelector("p").innerText=item.info;
  currentIndex=index;
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
    </div>`;
  document.body.appendChild(lb);

  lb.querySelector(".close").onclick=()=>lb.remove();
  lb.querySelector(".prev").onclick=()=>renderLightbox((currentIndex-1+galleryItems.length)%galleryItems.length);
  lb.querySelector(".next").onclick=()=>renderLightbox((currentIndex+1)%galleryItems.length);
  lb.onclick=e=>{ if(e.target===lb) lb.remove(); };
  currentIndex=index;
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
