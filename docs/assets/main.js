window.addEventListener("scroll",()=>{
  document.querySelectorAll(".fadein").forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight-100) el.style.opacity=1;
  });
});
