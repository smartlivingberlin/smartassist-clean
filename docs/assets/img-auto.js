(function(){
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll("img[data-auto]").forEach(img=>{
      const src=img.getAttribute("src");
      if(!src) return;
      const base=src.split("/").pop().split(".")[0];
      const sizes=[300,600,900];
      const srcset=sizes.map(s=>`assets/img-opt/${base}-${s}.webp ${s}w`).join(", ");
      img.setAttribute("srcset",srcset);
      img.setAttribute("sizes","(max-width:640px) 100vw, 33vw");
    });
  });
})();
