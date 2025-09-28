import feedparser, json, pathlib, time, hashlib

SRC=json.load(open("data/news_sources.json"))
out_current=pathlib.Path("data/news.json")
out_archive=pathlib.Path("data/news-archive.json")

def hash_entry(e):
    return hashlib.md5((e.get("title","")+e.get("link","")).encode("utf-8")).hexdigest()

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
            "id": hash_entry(e)
        })

# Archiv laden
archive=[]
if out_archive.exists():
    archive=json.load(open(out_archive,encoding="utf-8"))

# Neue Einträge einfügen, falls noch nicht da
known_ids={a["id"] for a in archive}
for e in entries:
    if e["id"] not in known_ids:
        archive.insert(0,e)  # vorne anhängen
        known_ids.add(e["id"])

# Begrenzen (z. B. max 500 Einträge)
archive=archive[:500]

json.dump({"fetched":time.ctime(),"items":entries},open(out_current,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
json.dump(archive,open(out_archive,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print(f"✓ news.json:{len(entries)} / archive:{len(archive)}")
