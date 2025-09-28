import csv,json
prods=json.load(open('data/products.json',encoding='utf-8'))
with open('export_products.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=['name','category','helps','link','docs','image','brand'])
    w.writeheader(); [w.writerow({k: p.get(k,'') for k in w.fieldnames}) for p in prods]
print("✓ export_products.csv erstellt (",len(prods),"Zeilen)")
