(function(){
  // News (cards in news.html)
  if(location.pathname.endsWith('/news.html')){
    fetch('data/news.json').then(r=>r.json()).then(d=>{
      const items=d.items.slice(0,12).map(x=>({
        "@context":"https://schema.org","@type":"NewsArticle",
        "headline": x.title, "datePublished": x.published || "",
        "url": x.link, "image": x.thumb||"", "publisher": {"@type":"Organization","name": x.source}
      }));
      const s=document.createElement('script'); s.type='application/ld+json';
      s.textContent=JSON.stringify(items); document.head.appendChild(s);
    });
  }
  // Produktseiten (product/*.html): falls Metadaten vorhanden
  if(/\/product\/.+\.html$/.test(location.pathname)){
    const title=document.querySelector('h1')?.innerText||document.title;
    const img=document.querySelector('img')?.src||"";
    const json={"@context":"https://schema.org","@type":"Product","name":title,"image":img};
    const s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(json);
    document.head.appendChild(s);
  }
})();
