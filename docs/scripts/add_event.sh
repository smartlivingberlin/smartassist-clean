#!/usr/bin/env bash
# Nutzung: scripts/add_event.sh "Name" "Stadt" "Land" "YYYY-MM-DD" "YYYY-MM-DD" "Fokus" "https://link"
set -e
N="$1"; C="$2"; COUNTRY="$3"; F="$4"; T="$5"; FOC="$6"; L="$7"
FILE="data/events.json"
python3 - "$FILE" "$N" "$C" "$COUNTRY" "$F" "$T" "$FOC" "$L" <<'PY'
import json,sys
fn,n,c,country,fr,to,focus,link=sys.argv[1:8]
try: data=json.load(open(fn,encoding="utf-8")); assert isinstance(data,list)
except: data=[]
data=[{"name":n,"city":c,"country":country,"from":fr,"to":to,"focus":focus,"link":link}]+data
json.dump(data,open(fn,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("✓ Event hinzugefügt:",n)
PY
echo "git add data/events.json && git commit -m 'event: $N' && git push"
