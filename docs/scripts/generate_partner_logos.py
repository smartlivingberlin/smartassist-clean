import json,os,hashlib
os.makedirs("partner-logos",exist_ok=True)
try: partners=json.load(open("data/partners.json",encoding="utf-8"))
except: partners=[]
def logo_svg(text,color="#2563eb"):
    initials="".join([w[0].upper() for w in text.split()[:2]]) or "P"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160" viewBox="0 0 320 160">
<rect rx="18" ry="18" width="320" height="160" fill="{color}" />
<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="64" font-family="Inter,Segoe UI,Arial" fill="#fff">{initials}</text>
</svg>'''
for p in partners:
    name=p.get("name","Partner")
    col="#" + hashlib.md5(name.encode()).hexdigest()[:6]
    open(f"partner-logos/{name.lower().replace(' ','-')}.svg","w").write(logo_svg(name,col))
print("✓ Partner-Logos erzeugt:", len(partners))
