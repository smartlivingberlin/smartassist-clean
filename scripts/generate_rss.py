import json,datetime
d=json.load(open("data/news.json",encoding="utf-8"))
items=d.get("items",[])[:30]
now=datetime.datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")
rss=['<?xml version="1.0" encoding="UTF-8"?>',
'<rss version="2.0"><channel>',
'<title>SmartAssist – News</title>',
'<link>https://smartlivingberlin.github.io/smartassist-clean/news.html</link>',
'<description>Assistenz-Robotik & KI – Kuratierte News</description>',
f'<lastBuildDate>{now}</lastBuildDate>']
for x in items:
  pub=x.get("published") or now
  rss+=['<item>',
        f'<title><![CDATA[{x["title"]}]]></title>',
        f'<link>{x["link"]}</link>',
        f'<guid isPermaLink="false">{x["id"]}</guid>',
        f'<pubDate>{pub}</pubDate>',
        f'<description><![CDATA[{x.get("summary","")}]]></description>',
        '</item>']
rss+=['</channel></rss>']
open("news.xml","w",encoding="utf-8").write("\n".join(rss))
print("✓ news.xml geschrieben")
