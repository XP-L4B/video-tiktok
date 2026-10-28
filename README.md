# video-tiktok
motion grafic video tiktok

## remotion/ — Riki TikTok 28/10/2026

Montaggio motion graphics del video `riki tiktok 28102026.mp4` realizzato con Remotion.
Vedi [`remotion/STORYBOARD.md`](remotion/STORYBOARD.md) per timestamp, layout e animazioni.

```bash
cd remotion
npm install
scripts/prepare.sh "/percorso/riki tiktok 28102026.mp4"   # crea public/speaker.mp4, sfx, face tracking
npm run studio    # anteprima
npm run render    # -> out/riki-tiktok-28102026-motion.mp4
```

Trascrizione: `remotion/scripts/script.txt` (testo) + `scripts/whisper.json` (timestamp),
allineati in `src/data/words.json` con `python3 scripts/align.py`.
