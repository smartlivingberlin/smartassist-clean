document.addEventListener('DOMContentLoaded',()=>{
  // Smooth scroll on in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href=a.getAttribute('href'); if(href==='#') return;
      const t=document.querySelector(href); if(!t) return;
      e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
});
