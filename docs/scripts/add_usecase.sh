#!/usr/bin/env bash
# Nutzung:
# scripts/add_usecase.sh "slug" "Titel" "Intro" "Keyword1,Keyword2,Keyword3" "CTA-Text"
set -e
SLUG="$1"; TITLE="$2"; INTRO="$3"; KWS="$4"; CTA="${5:-Zum Katalog}"
[ -z "$SLUG" ] && { echo "slug fehlt"; exit 1; }
FILE="data/usecases.json"
python3 - "$FILE" "$SLUG" "$TITLE" "$INTRO" "$KWS" "$CTA" <<'PY'
import json,sys
fn,slug,title,intro,kws,cta=sys.argv[1:7]
try:
    data=json.load(open(fn,encoding="utf-8"))
    assert isinstance(data,list)
except Exception:
    data=[]
kw=[k.strip() for k in (kws or "").split(",") if k.strip()]
entry={"slug":slug,"title":title or slug,"intro":intro or "", "keywords":kw, "cta":cta or "Zum Katalog"}
# vorn einfügen
data=[entry]+data
json.dump(data,open(fn,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("✓ Use-Case hinzugefügt:",slug)
PY
echo "Tipp: danach 'python3 generate_usecases.py && python3 generate_og.py' ausführen"
