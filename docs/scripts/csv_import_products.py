import csv,json,sys
fn=sys.argv[1] if len(sys.argv)>1 else 'import_products.csv'
rows=list(csv.DictReader(open(fn,encoding='utf-8')))
try: cur=json.load(open('data/products.json',encoding='utf-8')); assert isinstance(cur,list)
except: cur=[]
# einfache Merge-Strategie: vorne anfügen, Duplikate nach name ignorieren
names={p.get('name','').strip().lower() for p in cur}
new=[]
for r in rows:
    nm=(r.get('name','') or '').strip()
    if nm and nm.lower() not in names:
        new.append({k:r.get(k,'') for k in ['name','category','helps','link','docs','image','brand']})
data=new+cur
json.dump(data,open('data/products.json','w',encoding='utf-8'),ensure_ascii=False,indent=2)
print(f"✓ {len(new)} neue Produkte importiert, Gesamt {len(data)}")
