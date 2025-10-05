(function(){
  const KEY="clickCounts";
  const get=()=>JSON.parse(localStorage.getItem(KEY)||"{}");
  const set=v=>localStorage.setItem(KEY,JSON.stringify(v));

  document.addEventListener('click',e=>{
    const a=e.target.closest("a[data-aff],a[data-aff-brand]");
    if(!a) return;
    const brand=a.dataset.aff||a.dataset.affBrand||a.textContent.trim();
    if(!brand) return;
    const c=get(); c[brand]=(c[brand]||0)+1; set(c);
  });

  window.mostClicked = function(brand){
    const c=get();
    return (c[brand]||0) >= 3; // Schwelle: 3+ Klicks
  };
})();
