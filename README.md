# Montaggio narrativo dinamico · TikTok

Master verticale 1080×1920, 30 fps, circa 2 minuti. Il presentatore alterna primo piano, split laterale, maschera circolare e picture-in-picture. Le grafiche spiegano distrazione, personalizzazione, delega cognitiva e gamification; la dimostrazione dell’app usa la ripresa reale del video.

## Rigenerazione

Servono Python 3.10+, FFmpeg con libx264 e Node.js 22+ per l’anteprima Remotion.

1. Copiare il filmato originale in `public/source.mp4`.
2. Installare le dipendenze: `python3 -m pip install -r requirements.txt`.
3. Rigenerare e controllare i sottotitoli con `python3 scripts/transcribe.py`.
4. Esportare il montaggio con `python3 scripts/render_director.py`.

Il master è `out/tiktok-director.mp4` e viene copiato in `public/edit-master.mp4`. La pipeline pulisce leggermente la voce, uniforma il volume e aggiunge whoosh e click sintetizzati a basso livello. Non contiene musica di terzi.

## Modifiche

- `storyboard/director.json`: tempi, layout, concetti e titoli.
- `scripts/render_director.py`: composizione per fotogramma, maschere, crop, easing, diagrammi, sottotitoli e sound design.
- `src/words.json`: parole e timestamp, da rigenerare dal filmato e rileggere prima della pubblicazione.
- `scripts/transcribe.py`: trascrizione italiana con faster-whisper medium.

I diagrammi rappresentano concetti e non dati quantitativi. L’indicazione dei cinque membri e della beta riprende il parlato originale.

## Remotion

`npm ci` e `npm run dev` aprono il master in Remotion Studio. Remotion è qui un contenitore di anteprima/esportazione del master: il montaggio dettagliato è modificabile nel codice Python e nel JSON di regia. Non è una timeline nativa After Effects.

## Verifica

Il master viene renderizzato con FFmpeg; sono controllati sintassi Python, TypeScript, durata, tracce audio/video e fotogrammi dei layout. La precisione della trascrizione automatica resta da verificare editorialmente. I file video generati sono esclusi da Git.
