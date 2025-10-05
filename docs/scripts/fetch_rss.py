import json,feedparser,datetime,hashlib
from html import unescape
import re
CONFIG=json.load(open("data/rss_sources.json",encoding="utf-8"))
try:
    news=json.load(open("data/news.json",encoding="utf-8"))
except:
    news=[]
def clean(t): 
    t = unescape(t or "")
    return re.sub(r'\s+',' ', t).strip()
def to_date(p):
    try:
        return datetime.datetime(*p).date().isoformat()
    except Exception:
        return datetime.date.today().isoformat()
seen=set((n.get("link",""), n.get("title","")) for n in news)
items=[]
for url in CONFIG["feeds"]:
    d=feedparser.parse(url)
    for e in d.entries[:CONFIG.get("max_items",12)]:
        title=clean(getattr(e,"title",""))
        link=getattr(e,"link","")
        if (link,title) in seen: continue
        date = to_date(getattr(e,'published_parsed',None) or getattr(e,'updated_parsed',None) or datetime.datetime.utcnow().timetuple())
        summary=clean(getattr(e,"summary",""))
        items.append({
            "title": title, "date": date, "topic":"Extern",
            "summary": summary[:240] + ("…" if len(summary)>240 else ""),
            "link": link
        })
news = (items + news)[:200]
json.dump(news,open("data/news.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("✓ RSS geladen:", len(items), "neu")
