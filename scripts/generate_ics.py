import json,os,datetime
from html import escape
BASE="events"
os.makedirs(BASE,exist_ok=True)
def vevent(ev):
    def dt(s): return s.replace("-","")+"T000000Z"
    desc = (ev.get("focus") or "") + ((" • "+ev.get("link","")) if ev.get("link") else "")
    return f"""BEGIN:VEVENT
UID:{escape(ev['name'])}-{ev['from']}@smartassist
DTSTAMP:{datetime.datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}
DTSTART:{dt(ev['from'])}
DTEND:{dt(ev['to'])}
SUMMARY:{escape(ev['name'])}
LOCATION:{escape(ev.get('city',''))} {escape(ev.get('country',''))}
DESCRIPTION:{escape(desc)}
END:VEVENT"""
with open("data/events.json",encoding="utf-8") as f:
    events=json.load(f)
ics_header="BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SmartAssist//Events//DE\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n"
ics_footer="END:VCALENDAR\n"
# Gesamt
open("events/events.ics","w",encoding="utf-8").write(ics_header + "\n".join(vevent(e) for e in events) + ics_footer)
# Einzel
for e in events:
    slug=e["name"].lower().replace(" ","-")
    open(f"events/{slug}.ics","w",encoding="utf-8").write(ics_header+vevent(e)+ics_footer)
print("✓ ICS erzeugt:", len(events), "Events")
