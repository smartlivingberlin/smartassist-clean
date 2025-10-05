#!/usr/bin/env bash
# Nutzung: scripts/add_news.sh "Titel" "YYYY-MM-DD" "Thema" "Kurztext" "https://link" "YOUTUBE_ID" "https://bild.url"
set -e
T="$1"; D="${2:-$(date +%F)}"; TOPIC="${3:-Allgemein}"; SUM="${4:-}"; LINK="${5:-}"; YT="${6:-}"; IMG="${7:-}"
FILE="data/news.json"
python3 - "$FILE" "$T" "$D" "$TOPIC" "$SUM" "$LINK" "$YT" "$IMG" <<'PY'
import json,sys
fn,t,d,topic,s,link,yt,img=sys.argv[1:8]
try: data=json.load(open(fn,encoding="utf-8")); assert isinstance(data,list)
except: data=[]
data=[{"title":t,"date":d,"topic":topic,"summary":s,"link":link,"youtube_id":yt or None,"image":img or None}]+data
json.dump(data,open(fn,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("✓ News hinzugefügt:",t)
PY
echo "git add data/news.json && git commit -m 'news: $T' && git push"
