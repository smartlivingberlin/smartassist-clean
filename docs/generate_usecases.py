import json,os,sys
DOMAIN=os.environ.get("DOMAIN","")
data=json.load(open("data/usecases.json",encoding="utf-8"))
template="""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} – SmartAssist</title>
<link rel="stylesheet" href="../assets/style.css">
<link rel="canonical" href="{canon}">
<meta name="description" content="{intro}">
<meta property="og:title" content="{title} – SmartAssist">
<meta property="og:description" content="{intro}">
<meta property="og:image" content="{ogimg}">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"CollectionPage","name":"{title}","url":"{canon}","about":[{kwjson}]}}</script>
</head><body>
<nav class="nav"><a href="../index.html">SmartAssist</a><a href="../katalog.html">Katalog</a><a href="../news.html">News</a><a href="../partner.html">Partner</a><a href="../kontakt.html">Kontakt</a></nav>
<main class="container">
  <h1>{title}</h1>
  <p class="card">{intro}</p>
  <div class="card">Relevante Schlagwörter: {kw}</div>
  <p><a class="badge" href="../katalog.html">{cta}</a></p>
</main>
<footer>© 2025 SmartAssist</footer>
</body></html>"""
os.makedirs("usecases",exist_ok=True)
index_cards=[]
for uc in data:
    slug=uc["slug"]; title=uc["title"]; intro=uc["intro"]; kw=uc.get("keywords",[]); cta=uc.get("cta","Zum Katalog")
    canon=f"{DOMAIN}/usecases/{slug}.html" if DOMAIN else f"usecases/{slug}.html"
    ogimg=f"{DOMAIN}/og/{slug}.svg" if DOMAIN else f"../og/{slug}.svg"
    kwjson=",".join([f'{{"@type":"Thing","name":"{k}"}}' for k in kw])
    html=template.format(title=title,intro=intro,kw=", ".join(kw),kwjson=kwjson,cta=cta,canon=canon,ogimg=ogimg)
    open(f"usecases/{slug}.html","w",encoding="utf-8").write(html)
    index_cards.append(f'<div class="card"><h3>{title}</h3><p>{intro}</p><a class="badge" href="usecases/{slug}.html">Ansehen</a></div>')
# Liste/Hub
open("usecases.html","w",encoding="utf-8").write("""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Use-Cases – SmartAssist</title>
<link rel="stylesheet" href="assets/style.css">
<link rel="canonical" href="{canon}">
<meta property="og:title" content="Use-Cases – SmartAssist">
<meta property="og:description" content="Anwendungsfälle in Pflege, Alltag, Sport & Küche.">
<meta property="og:image" content="{og}">
</head><body>
<nav class="nav"><a href="index.html">SmartAssist</a><a href="katalog.html">Katalog</a><a href="news.html">News</a><a href="partner.html">Partner</a><a href="kontakt.html">Kontakt</a></nav>
<main class="container"><h1>Use-Cases</h1>{cards}</main><footer>© 2025 SmartAssist</footer></body></html>""".format(
    canon=f"{DOMAIN}/usecases.html" if DOMAIN else "usecases.html",
    og=f"{DOMAIN}/og/usecases.svg" if DOMAIN else "og/usecases.svg",
    cards="\n".join(index_cards)
))
