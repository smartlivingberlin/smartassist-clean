const CACHE="smartassist-20250928162637";
const ASSETS=["index.html","katalog.html","news.html","partner.html","kontakt.html","assets/style.css"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))}); 
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))))});
