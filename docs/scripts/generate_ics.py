import json,datetime
E=json.load(open("data/events.json",encoding="utf-8"))
def dt(s): # to UTC-ish basic
  return s.replace("-","").replace(":","")+"Z"
ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SmartAssist//Events//DE"]
for e in E:
  ics+=["BEGIN:VEVENT",
        "UID:"+e["title"].replace(" ","_")+"@smartassist",
        "DTSTART:"+dt(e["start"]),
        "DTEND:"+dt(e["end"]),
        "SUMMARY:"+e["title"],
        "LOCATION:"+e.get("location",""),
        "URL:"+e.get("url",""),
        "END:VEVENT"]
ics+=["END:VCALENDAR"]
open("events.ics","w",encoding="utf-8").write("\n".join(ics))
print("✓ events.ics geschrieben")
