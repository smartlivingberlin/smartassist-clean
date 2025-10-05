import csv,json
partners=json.load(open('data/partners.json',encoding='utf-8'))
with open('export_partners.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=['name','type','focus','country','link'])
    w.writeheader(); [w.writerow({k: p.get(k,'') for k in w.fieldnames}) for p in partners]
print("✓ export_partners.csv erstellt (",len(partners),"Zeilen)")
