import os,re,glob

def fix_html(path):
    txt=open(path,encoding="utf-8").read()

    # 1) Alle mehrfachen <title> bereinigen
    titles=re.findall(r"<title[^>]*>.*?</title>",txt,re.I|re.S)
    if len(titles)>1:
        main=titles[0]
        for t in titles[1:]: txt=txt.replace(t,"")
        txt=txt.replace(main, main.replace("\n"," ").strip())

    # 2) Kaputte og:description (enthaltenes <link>) säubern
    txt=re.sub(r'<meta property="og:description"[^>]*>', 
               '<meta property="og:description" content="Assistenz-Robotik & KI: Katalog, News, Partner – schnell, sauber, sicher.">', txt)

    # 3) Doppelte </head> entfernen
    txt=re.sub(r'</head>\s*</head>','</head>',txt)

    # 4) Doppelte og:image → nur die erste behalten
    imgs=re.findall(r'<meta property="og:image"[^>]*>',txt)
    if len(imgs)>1:
        for t in imgs[1:]: txt=txt.replace(t,"")

    # 5) Schönheitskorrektur: Whitespaces reduzieren
    txt=re.sub(r'\n{3,}','\n\n',txt)

    open(path,"w",encoding="utf-8").write(txt)
    print("✓ bereinigt:",path)

for f in glob.glob("*.html")+glob.glob("*/*.html"):
    try: fix_html(f)
    except Exception as e: print("⚠️ Fehler bei",f,e)
