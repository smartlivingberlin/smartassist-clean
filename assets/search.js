function normalize(s){return (s||"").toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function filterItems(arr,q,proj){q=normalize(q); if(!q) return arr;
  return arr.filter(it=>normalize(proj(it)).includes(q));
}
