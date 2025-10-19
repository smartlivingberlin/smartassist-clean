(function(){
  function hostMatch(url, pat){ try{ return new URL(url).host.includes(pat); }catch(_){ return false; } }
  fetch("data/affiliates.json").then(r=>r.json()).then(cfg=>{
    const brands = cfg.brand_params||{}, fall = cfg.domain_fallback||{}, def = cfg.default_params||"";
    document.querySelectorAll("a[data-aff], a[data-aff-brand]").forEach(a=>{
      const brand = a.dataset.aff || a.dataset.affBrand || "";
      let params = brands[brand] || "";
      if(!params){
        for(const pat in fall){ if(hostMatch(a.href, pat)){ params = fall[pat]; break; } }
      }
      if(!params) params = def;
      if(params) a.href = a.href + (a.href.includes("?")?"&":"?") + params;
    });
  });
})();
