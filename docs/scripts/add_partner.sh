#!/usr/bin/env bash
# Nutzung:
# scripts/add_partner.sh "Name" "Typ" "Fokus" "Land" "https://link"
set -e
NAME="$1"; TYPE="$2"; FOCUS="$3"; COUNTRY="$4"; LINK="$5"
[ -z "$NAME" ] && { echo "Name fehlt"; exit 1; }
FILE="data/partners.json"; TMP=".tmp.partners"
python3 - "$FILE" "$NAME" "$TYPE" "$FOCUS" "$COUNTRY" "$LINK" <<'PY'
import json,sys
fn,name,typ,focus,country,link=sys.argv[1:7]
try:
    data=json.load(open(fn,encoding="utf-8"))
    assert isinstance(data,list)
except Exception:
    data=[]
entry={"name":name,"type":typ or "Partner","focus":focus or "", "country":country or "", "link":link or ""}
# vorn einfügen
data=[entry]+data
json.dump(data,open(fn,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("✓ Partner hinzugefügt:",name)
PY
