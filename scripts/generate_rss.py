import json,datetime,html
DOMAIN="https://smartlivingberlin.github.io/smartassist-clean"
news=[]
try:
    with open("data/news.json",encoding="utf-8") as f:
        news=json.load(f)
except Exception:
    news=[]
items=[]
for n in news:
    title=n.get("title","News")
    link=n.get("link", f"{DOMAIN}/news.html")
    date=n.get("date") or datetime.date.today().isoformat()
    desc=n.get("summary","")
    # RSS pubDate
    try:
        y,m,d=map(int,date.split("-"))
        dt=datetime.datetime(y,m,d)
    except Exception:
        dt=datetime.datetime.utcnow()
    pub=dt.strftime("%a, %d %b %Y 00:00:00 +0000")
    items.append(f"<item><title>{html.escape(title)}</title><link>{html.escape(link)}</link><pubDate>{pub}</pubDate><description>{html.escape(desc)}</description></item>")
xml=f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>SmartAssist – News</title>
<link>{DOMAIN}/news.html</link>
<description>Assistenz-Robotik &amp; KI: kuratierte Meldungen</description>
{''.join(items)}
</channel></rss>"""
open("feed.xml","w",encoding="utf-8").write(xml)
print("✓ feed.xml aktualisiert (",len(items),"Einträge )")
