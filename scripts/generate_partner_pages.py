import json, os, pathlib, html
from urllib.parse import quote

P=json.load(open("data/partners.json",encoding="utf-8"))
out=pathlib.Path("partners"); out.mkdir(exist_ok=True)

TPL_DETAIL = """<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{name} – Partner – SmartAssist</title>
<link rel="stylesheet" href="../assets/style.css">
<meta property="og:title" content="{name} – Partner">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{logo}">
</head><body>
<nav class="nav"><a href="../index.html">🏠</a> <a href="../partner.html">Partner</a></nav>
<main class="container">
  <article class="card">
    <img src="{logo}" alt="{name} Logo" loading="eager" style="max-width:260px">
    <h1>{name}</h1>
    <p class="muted">{desc}</p>
    <p><strong>Land:</strong> {country} · <strong>Kategorien:</strong> {cats}</p>
    <div class="btn-group">
      {url_btn}
      <a class="btn" href="../partner-kontakt.html?partner={slug}&to={mailto}">Kontakt aufnehmen</a>
    </div>
  </article>
</main>
<footer class="footer">© 2025 SmartAssist</footer>
</body></html>"""

for x in P:
    url_btn = f'<a class="btn btn-outline" href="{html.escape(x.get("url","#"))}" target="_blank" rel="noopener">Website</a>' if x.get("url") else ""
    html_out = TPL_DETAIL.format(
        name=html.escape(x["name"]),
        desc=html.escape(x.get("description","")),
        logo=html.escape(x.get("logo","")),
        country=html.escape(x.get("country","")),
        cats=html.escape(", ".join(x.get("categories",[]))),
        url_btn=url_btn,
        slug=html.escape(x["slug"]),
        mailto=quote(x.get("email","info@example.com"))
    )
    open(out/f'{x["slug"]}.html',"w",encoding="utf-8").write(html_out)

# Logowand / Partner-Hauptseite
TPL_INDEX = """<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Partner – SmartAssist</title>
<link rel="stylesheet" href="assets/style.css">
</head><body>
<nav class="nav"><a class="nav-brand" href="index.html">SmartAssist</a><a href="partner.html"><strong>Partner</strong></a></nav>
<main class="container">
  <h1>Partner</h1>
  <p class="muted">Hersteller, Händler & Forschungspartner aus Assistenz, Mobilität, Sport & Smart-Home.</p>
  <div class="grid logos">{logos}</div>
  <p class="card">Ihre Firma fehlt? <a class="btn" href="partner-signup.html">Partner werden</a></p>
</main>
<footer class="footer">© 2025 SmartAssist</footer>
</body></html>"""

logos = "".join([f'<a class="card logo" href="partners/{html.escape(x["slug"])}.html"><img src="{html.escape(x.get("logo",""))}" alt="{html.escape(x["name"])}" loading="lazy"><div><strong>{html.escape(x["name"])}</strong></div></a>'
                 for x in P])
open("partner.html","w",encoding="utf-8").write(TPL_INDEX.format(logos=logos))
print("✓ Partnerseiten generiert:", len(P))
