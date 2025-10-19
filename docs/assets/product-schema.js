(async function(){
  try{
    const res=await fetch('data/products.json',{cache:'no-store'});
    const items=await res.json();
    const ld={"@context":"https://schema.org","@graph":items.map(x=>({
      "@type":"Product","name":x.name,"category":x.category||"Assistenz",
      "description":x.helps||undefined,"image":x.image||undefined,
      "brand": x.brand?{"@type":"Brand","name":x.brand}:undefined,
      "offers": x.link?{"@type":"Offer","url":x.link,"priceCurrency":"EUR"}:undefined
    }))};
    const s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(ld);
    document.head.appendChild(s);
  }catch(e){}
})();
