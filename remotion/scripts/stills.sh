#!/bin/sh
# Render review stills at the given seconds: scripts/stills.sh 1.0 2.5 ...
for s in "$@"; do
  f=$(python3 -c "print(round($s*30))")
  npx remotion still RikiTiktok "out/stills/t$s.jpg" --frame="$f" --image-format=jpeg --log=error
done
