import json,os,re,html,datetime
DOMAIN="https://smartlivingberlin.github.io/smartassist-clean"
os.makedirs("top",exist_ok=True)
prods=json.load(open("data/products.json",encoding="utf-8"))
def slugify(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def score(p): return sum(bool(p.get(f)) for f in ["price_eur","range_km","battery_Wh","youtube_id","image"])
combos=set()
for p in prods: 
  cat=p.get("category","Alltag")
  for t in p.get("tags") or []: combos.add((cat,t))
index_cards=[]
for cat,tag in sorted(combos):
  items=[p for p in prods if (p.get("category")==cat and tag in (p.get("tags") or []))]
  items.sort(key=score,reverse=True)
  if not items: continue
  slug=slugify(f"{cat}-{tag}-2025")
  title=f"Top {len(items)} {cat} für {tag} 2025"
  og=items[0].get("image") or f"https://picsum.photos/seed/{slug}/1200/700"
  reasons=[f"<p class='muted'><strong>Warum wir empfehlen:</strong> {html.escape(p.get('reason','Hoher Nutzwert'))}</p>" for p in items]
  cards="".join([f'''
    <div class="card item">
      <h3>{html.escape(p["name"])}</h3>
      <img src="{html.escape(p.get("image") or f"https://picsum.photos/seed/{slugify(p['name'])}/800/600")}" alt="" loading="lazy">
      <p>{html.escape(p.get("helps",""))}</p>
      {reasons[i]}
      <div class="kv">
        {'<a class="btn btn-outline" data-aff-brand="'+html.escape(p.get("brand",""))+'" href="'+html.escape(p.get("link","#"))+'" target="_blank">Website</a>' if p.get("link") else ''}
        {'<a class="btn" href="../product/'+html.escape(p.get("slug",""))+'.html">Details</a>' if p.get("slug") else ''}
      </div>
    </div>''' for i,p in enumerate(items[:10])])
  open(f"top/{slug}.html","w",encoding="utf-8").write(f"""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<link rel="stylesheet" href="../assets/style.css">
<link rel="canonical" href="{DOMAIN}/top/{slug}.html">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:image" content="{og}">
</head><body>
<nav class="nav"><a href="../index.html">SmartAssist</a></nav>
<main class="container">
  <h1>{html.escape(title)}</h1>
  <div class="grid">{cards}</div>
  <div class="card"><h3>📘 Robotics Guide</h3><p><a class="btn" href="../lead.html">Assistenz-Robotik 2026 PDF laden</a></p></div>
</main>
<footer class="footer">© 2025 SmartAssist</footer>
<script src="../assets/affiliates.js"></script>
<script src="../assets/conversion.js"></script>
</body></html>""")
  index_cards.append(f'<div class="card"><h3><a href="top/{slug}.html">{html.escape(title)}</a></h3></div>')
open("top/index.html","w",encoding="utf-8").write("<h1>Top-Empfehlungen</h1>"+ "".join(index_cards))
