function openLightbox(html){
  const lb=document.createElement("div");
  lb.className="lightbox";
  lb.innerHTML=`<div class="lightbox-content">${html}<button class="close">×</button></div>`;
  document.body.appendChild(lb);
  lb.querySelector(".close").onclick=()=>lb.remove();
  lb.onclick=e=>{ if(e.target===lb) lb.remove(); };
}
function galleryInit(){
  document.querySelectorAll(".masonry .item").forEach(a=>{
    a.onclick=e=>{
      e.preventDefault();
      let media=a.querySelector("iframe")?.outerHTML||a.querySelector("img")?.outerHTML;
      let title=a.querySelector("h3")?.innerText||"";
      let info=a.querySelector("p")?.innerText||"";
      openLightbox(`<div class="media">${media}</div><h3>${title}</h3><p>${info}</p>`);
    };
  });
}
window.addEventListener("DOMContentLoaded",galleryInit);
