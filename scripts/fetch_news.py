import feedparser, json, pathlib, time, hashlib

SRC=json.load(open("data/news_sources.json"))
out_current=pathlib.Path("data/news.json")
out_archive=pathlib.Path("data/news-archive.json")

def hash_entry(e):
    return hashlib.md5((e.get("title","")+e.get("link","")).encode("utf-8")).hexdigest()

def extract_thumb(e):
    # Manche Feeds haben media_content oder enclosure
    if "media_content" in e and e.media_content:
        return e.media_content[0].get("url")
    if "links" in e:
        for l in e.links:
            if l.get("type","").startswith("image/"):
                return l.get("href")
    return None

entries=[]
for f in SRC.get("feeds",[]):
    d=feedparser.parse(f["url"])
    for e in d.entries[:5]:
        entries.append({
            "title": e.get("title",""),
            "link": e.get("link",""),
            "source": f["title"],
            "published": e.get("published",""),
            "summary": e.get("summary","")[:220],
            "id": hash_entry(e),
            "thumb": extract_thumb(e)
        })

# Archiv laden
archive=[]
if out_archive.exists():
    archive=json.load(open(out_archive,encoding="utf-8"))

# Neue Einträge vorn einfügen
known_ids={a["id"] for a in archive}
for e in entries:
    if e["id"] not in known_ids:
        archive.insert(0,e)
        known_ids.add(e["id"])

archive=archive[:500]

json.dump({"fetched":time.ctime(),"items":entries},open(out_current,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
json.dump(archive,open(out_archive,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print(f"✓ news.json:{len(entries)} / archive:{len(archive)}")
