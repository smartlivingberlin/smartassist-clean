import os,html
for f in os.listdir("."):
  pass
pages=[]
for root,_,files in os.walk("."):
  for fn in files:
    if fn.endswith(".html") and not root.startswith("./og"):
      pages.append(os.path.join(root,fn))
os.makedirs("og/pages",exist_ok=True)
for p in pages:
  name=p.replace("./","")
  svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0f172a"/><text x="60" y="340" fill="#fff" font-size="64" font-family="Inter,Segoe UI,Arial">{html.escape(name[:40])}</text><text x="60" y="430" fill="#cbd5e1" font-size="32">SmartAssist</text></svg>'''
  out="og/pages/"+name.replace("/","_")+".svg"
  os.makedirs(os.path.dirname(out),exist_ok=True)
  open(out,"w",encoding="utf-8").write(svg)
print("✓ OG pages generiert:", len(pages))
