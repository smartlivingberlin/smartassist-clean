import json,requests,os
from urllib.parse import urlparse
P="data/products.json"
items=json.load(open(P,encoding="utf-8"))
changed=False
def ok(u):
  try:
    r=requests.head(u,timeout=8,allow_redirects=True)
    return r.status_code<400
  except Exception: return False
for x in items:
  for key in ["image","hero"]:
    u=x.get(key)
    if u and not ok(u):
      x[key]=f"https://picsum.photos/seed/{x['slug']}-{key}/1200/800"
      changed=True
  g=[]
  for u in x.get("gallery",[]):
    if ok(u): g.append(u)
    else:
      g.append(f"https://picsum.photos/seed/{x['slug']}-gal-{len(g)+1}/1200/800")
      changed=True
  x["gallery"]=g or [f"https://picsum.photos/seed/{x['slug']}-gal-1/1200/800"]
if changed:
  json.dump(items,open(P,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
  print("✓ images normalized & fallback set")
else:
  print("✓ all images ok")
