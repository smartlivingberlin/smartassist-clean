import os
DOMAIN="https://smartlivingberlin.github.io/smartassist-clean"
urls=[]
for root,_,files in os.walk("."):
  for f in files:
    if f.endswith(".html"):
      p=os.path.join(root,f).replace("./","")
      urls.append(f"{DOMAIN}/{p}")
xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+"".join([f"<url><loc>{u}</loc></url>" for u in sorted(urls)])+"</urlset>"
open("sitemap.xml","w").write(xml)
print("✓ sitemap.xml aktualisiert", len(urls))
