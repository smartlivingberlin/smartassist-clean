#!/usr/bin/env bash
# Nutzung:
# scripts/analytics.sh plausible "domain.tld/path"    # aktivieren
# scripts/analytics.sh umami "WEBSITE_ID" "https://umami.yourhost/js/script.js"    # aktivieren
# scripts/analytics.sh off                             # entfernen
set -e
MODE="$1"; ARG1="$2"; ARG2="$3"
FILES="index.html katalog.html news.html partner.html kontakt.html usecases.html"
case "$MODE" in
  plausible)
    [ -z "$ARG1" ] && { echo "Plausible Domain fehlt (z.B. smartlivingberlin.github.io/smartassist-clean)"; exit 1; }
    for f in $FILES; do
      [ -f "$f" ] || continue
      # vorhandene Umami entfernen
      sed -i '/umami\.js/d;/data-website-id=/d' "$f"
      grep -qi 'plausible.io/js/script.js' "$f" || \
        sed -i 's#</head>#<script defer data-domain="'"$ARG1"'" src="https://plausible.io/js/script.js"></script>\n</head>#' "$f"
    done
    echo "✓ Plausible eingebunden für $ARG1"
    ;;
  umami)
    [ -z "$ARG1" ] && { echo "Umami WEBSITE_ID fehlt"; exit 1; }
    [ -z "$ARG2" ] && ARG2="https://umami.is/script.js"
    for f in $FILES; do
      [ -f "$f" ] || continue
      # vorhandenes Plausible entfernen
      sed -i '/plausible\.io\/js\/script\.js/d' "$f"
      grep -qi 'umami' "$f" || \
        sed -i 's#</head>#<script async src="'"$ARG2"'" data-website-id="'"$ARG1"'"></script>\n</head>#' "$f"
    done
    echo "✓ Umami eingebunden (ID=$ARG1, JS=$ARG2)"
    ;;
  off)
    for f in $FILES; do
      [ -f "$f" ] || continue
      sed -i '/plausible\.io\/js\/script\.js/d;/umami.*data-website-id/d' "$f"
    done
    echo "✓ Analytics entfernt"
    ;;
  *)
    echo "Befehl unbekannt. Beispiele:"
    echo "  scripts/analytics.sh plausible smartlivingberlin.github.io/smartassist-clean"
    echo "  scripts/analytics.sh umami YOUR_ID https://umami.yourhost/js/script.js"
    echo "  scripts/analytics.sh off"
    exit 1
    ;;
esac
