import json,os,sys,html
os.makedirs("og",exist_ok=True)
def svg(title,subtitle):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e1420"/><stop offset="1" stop-color="#224a94"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="60" y="360" font-family="Inter,Segoe UI,Arial" font-size="72" fill="#fff" font-weight="700">{html.escape(title)}</text>
  <text x="60" y="430" font-family="Inter,Segoe UI,Arial" font-size="36" fill="#cfe3ff">{html.escape(subtitle)}</text>
  <circle cx="1110" cy="90" r="36" fill="#cfe3ff"/><text x="1090" y="98" font-family="Arial" font-size="32">🤖</text>
</svg>'''
# Kernseiten
open("og/index.svg","w").write(svg("SmartAssist","Assistenz-Robotik & KI"))
open("og/katalog.svg","w").write(svg("Katalog","Finde passende Lösungen"))
open("og/news.svg","w").write(svg("News","Kurz & kuratiert"))
open("og/partner.svg","w").write(svg("Partner","Hersteller, Händler, Institute"))
open("og/usecases.svg","w").write(svg("Use-Cases","Pflege · Alltag · Sport · Küche"))
# Use-Cases
import json
ucs=json.load(open("data/usecases.json",encoding="utf-8"))
for uc in ucs:
    open(f"og/{uc['slug']}.svg","w").write(svg(uc["title"],"SmartAssist"))
