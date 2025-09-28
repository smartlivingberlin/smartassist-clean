import json,datetime,xml.sax.saxutils as sx
news=[]
try: news=json.load(open("data/news.json",encoding="utf-8"))
except: pass
items=""
for n in news[:20]:
  title=sx.escape(n.get("title",""))
  link=sx.escape(n.get("link",""))
  date=n.get("date",datetime.date.today().isoformat())
  desc=sx.escape(n.get("summary",""))
  items+=f"<item><title>{title}</title><link>{link}</link><pubDate>{date}</pubDate><description>{desc}</description></item>"
rss=f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>SmartAssist News</title><link>https://smartlivingberlin.github.io/smartassist-clean/</link><description>Kuratierte News</description>{items}</channel></rss>'
open("feed.xml","w",encoding="utf-8").write(rss)
print("✓ feed.xml geschrieben")
