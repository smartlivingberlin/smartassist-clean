import json,os,re,html,datetime
DOMAIN="https://smartlivingberlin.github.io/smartassist-clean"
os.makedirs("top",exist_ok=True)
try:
    prods=json.load(open("data/products.json",encoding="utf-8"))
except:
    prods=[]

def slugify(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')

def score(p):
    sc=0
    if p.get("price_eur"): sc+=2
    if p.get("range_km"): sc+=1
    if p.get("battery_Wh"): sc+=1
    if p.get("youtube_id"): sc+=1
    if p.get("image"): sc+=1
    return sc

# Sammle (Kategorie, Tag) Kombinationen
combos=set()
for p in prods:
    cat=p.get("category","Alltag")
    for t in p.get("tags") or []:
        combos.add((cat,t))

index_cards=[]
for cat,tag in sorted(combos):
    items=[p for p in prods if (p.get("category")==cat and (p.get("tags") and tag in p["tags"]))]
    items.sort(key=score,reverse=True)
    if not items: continue
    slug=slugify(f"{cat}-{tag}-2025")
    title=f"Top {min(10,len(items))} {cat} für {tag} 2025"
    intro=f"Unsere Auswahl der besten {cat}-Produkte für den Anwendungsfall „{tag}“ – kuratiert nach Reichweite, Akku, Verfügbarkeit und Nutzwert."
    og = items[0].get("image") or f"https://picsum.photos/seed/{slug}/1200/700"
    # JSON-LD Article
    ld={
        "@context":"https://schema.org",
        "@type":"Article",
        "headline":title,
        "datePublished": datetime.date.today().isoformat(),
        "author": {"@type":"Organization","name":"SmartAssist"},
        "about": [{"@type":"Thing","name":cat},{"@type":"Thing","name":tag}]
    }
    cards="".join([f'''
      <div class="card item">
        <div class="badge">{html.escape(p.get("brand",""))}</div>
        <h3>{html.escape(p["name"])}</h3>
        <img src="{html.escape(p.get("image") or f"https://picsum.photos/seed/{slugify(p['name'])}/800/600")}" alt="" loading="lazy" style="width:100%;border-radius:12px">
        <p class="muted">{html.escape(p.get("helps",""))}</p>
        <div class="kv">
          {'<a class="btn btn-outline" data-aff-brand="'+html.escape(p.get("brand",""))+'" href="'+html.escape(p.get("link","#"))+'" target="_blank" rel="noopener">Website</a>' if p.get("link") else ''}
          {'<a class="btn" href="../product/'+html.escape(p.get("slug",""))+'.html">Details</a>' if p.get("slug") else ''}
        </div>
      </div>''' for p in items[:10]])
    html_page=f"""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<link rel="stylesheet" href="../assets/style.css">
<link rel="canonical" href="{DOMAIN}/top/{slug}.html">
<meta name="description" content="{html.escape(intro)}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:image" content="{og}">
<script type="application/ld+json">{json.dumps(ld,ensure_ascii=False)}</script>
</head><body>
<nav class="nav"><a class="nav-brand" href="../index.html">SmartAssist</a><a href="../katalog.html">Katalog</a><a href="../topics.html">Themen</a></nav>
<main class="container">
  <h1>{html.escape(title)}</h1>
  <p class="card">{html.escape(intro)}</p>
  <div class="grid">{cards}</div>
</main>
<footer class="footer">© 2025 SmartAssist · <a href="../lead.html">📘 Robotics-Guide</a></footer>
<script src="../assets/affiliates.js"></script>
</body></html>"""
    open(f"top/{slug}.html","w",encoding="utf-8").write(html_page)
    index_cards.append(f'<div class="card"><h3><a href="top/{slug}.html">{html.escape(title)}</a></h3><p class="muted">{html.escape(intro)}</p></div>')

# Index der Top-Seiten
open("top/index.html","w",encoding="utf-8").write(f"""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Top-Seiten – Programmatic</title>
<link rel="stylesheet" href="../assets/style.css"></head>
<body>
<nav class="nav"><a class="nav-brand" href="../index.html">SmartAssist</a><a href="../katalog.html">Katalog</a><a href="../topics.html">Themen</a></nav>
<main class="container">
  <h1>Top-Empfehlungen 2025</h1>
  {''.join(index_cards) if index_cards else '<div class="card">Noch keine Top-Seiten.</div>'}
</main>
<footer class="footer">© 2025 SmartAssist</footer>
<script src="../assets/affiliates.js"></script>
</body></html>""")
print("✓ Top-Seiten generiert:", len(index_cards))
