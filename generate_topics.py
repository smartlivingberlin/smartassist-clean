import json,os
DOMAIN="https://smartlivingberlin.github.io/smartassist-clean"
topics=json.load(open("data/topics.json",encoding="utf-8"))
try: prods=json.load(open("data/products.json",encoding="utf-8"))
except: prods=[]
os.makedirs("topics",exist_ok=True)
cards=[]
for t in topics:
    tags=set(t.get("tags",[]))
    matches=[p for p in prods if tags & set(p.get("tags") or [])]
    prod_html="".join([f'<div class="card"><h3>{p["name"]}</h3><p class="muted">{p.get("helps","")}</p><a class="btn btn-outline" href="{p.get("link","#")}" target="_blank">Website</a></div>' for p in matches] ) or '<div class="card">Noch keine passenden Produkte.</div>'
    open(f"topics/{t['slug']}.html","w",encoding="utf-8").write(f"""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{t['title']} – Themen</title>
<link rel="stylesheet" href="../assets/style.css"></head>
<body><nav class="nav"><a class="nav-brand" href="../index.html">SmartAssist</a><a href="../katalog.html">Katalog</a><a href="../topics.html"><strong>Themen</strong></a></nav>
<main class="container"><h1>{t['title']}</h1><p class="card">{t.get("intro","")}</p><div class="grid">{prod_html}</div></main>
<footer class="footer">© 2025 SmartAssist</footer></body></html>""")
    cards.append(f'<div class="card"><h3><a href="topics/{t["slug"]}.html">{t["title"]}</a></h3><p class="muted">{t.get("intro","")}</p></div>')
open("topics.html","w",encoding="utf-8").write(f"""<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Themen – SmartAssist</title>
<link rel="stylesheet" href="assets/style.css"></head><body>
<nav class="nav"><a class="nav-brand" href="index.html">SmartAssist</a><a href="katalog.html">Katalog</a><a href="topics.html"><strong>Themen</strong></a><a href="news.html">News</a></nav>
<main class="container"><h1>Themen-Hubs</h1>{''.join(cards)}</main><footer class="footer">© 2025 SmartAssist</footer></body></html>""")
print("✓ Themen generiert:", len(topics))
