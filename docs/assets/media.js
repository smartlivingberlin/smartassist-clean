// Themenbild-Engine: nimmt lokale Bilder (assets/img/...) falls vorhanden,
// sonst thematisch passende Unsplash-Query (lizenzfreundliche Platzhalter).
// Nutzung: imgUrl({tags:[...], category:'Pflege'}, 'card', 'ExoCare X1')
const SA_MEDIA = (() => {
  const local = {
    // Wenn du echte Bilder hast, leg sie hier ab (Dateinamen frei wählbar) und mappe:
    // 'exo1': 'assets/img/exo1.jpg',
  };
  const queries = [
    {match:/exoske(let|)t|pflege|rehab|care|orthop/i, q:"exoskeleton, healthcare robotics"},
    {match:/amr|transport|logistik|warehouse|lager/i, q:"amr robot, warehouse automation"},
    {match:/vr|ar|vision|sehhilfe|brille/i, q:"vr headset rehab, ar training"},
    {match:/smart.?home|staubsauger|lidar|haushalt/i, q:"smart home robot, lidar map"},
    {match:/sport|outdoor|mobility|mobilität/i, q:"robotics outdoor mobility, assistive device"},
    {match:/drone|drohne|uav/i, q:"drone technology"},
    {match:/conference|messe|event/i, q:"robotics conference"}
  ];
  function pickQuery(meta){
    const hay = [
      ...(meta.tags||[]).join(' '),
      meta.category||'',
      meta.brand||'',
      meta.name||''
    ].join(' ').toLowerCase();
    const hit = queries.find(x=>x.match.test(hay));
    return hit ? hit.q : "assistive robotics";
  }
  function unsplash(q, seed){
    // stabiler Platzhalter mit Query + optionalem Seed (für Wiedererkennbarkeit)
    const s = encodeURIComponent((seed||'')+q);
    return `https://source.unsplash.com/featured/900x600?${s}`;
  }
  function imgUrl(meta, kind='card', seed=''){
    // 1) explizites Bild vom Datensatz
    if(meta.image && !/picsum\.photos/.test(meta.image)) return meta.image;
    // 2) lokaler Treffer
    if(meta.id && local[meta.id]) return local[meta.id];
    // 3) thematische Unsplash-Query
    return unsplash(pickQuery(meta), seed||meta.id||meta.name||'smartassist');
  }
  function altText(meta, fallback='Bild'){
    const parts = [meta.name||'', meta.brand||'', meta.category||''].filter(Boolean);
    return parts.length ? parts.join(' – ') : fallback;
  }
  return { imgUrl, altText };
})();
