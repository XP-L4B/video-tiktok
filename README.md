# Video TikTok · Achivia

Progetto Remotion per il video di circa 2 minuti su distrazione, IA e gamification.
Formato 1080 × 1920, 30 fps. Palette antracite e verde menta, 28 scene grafiche, illustrazioni animate, diagrammi e sottotitoli con evidenziazione della parola attiva.

## Avvio

Richiede Node.js 22 o successivo.

1. Copia il video originale in `public/source.mp4`.
2. Esegui `npm ci`.
3. Esegui `npm run dev` per aprire Remotion Studio.
4. Esegui `npm run render` per esportare `out/tiktok.mp4`.

Il file video originale è escluso da Git.

## Modifiche

- `src/timeline.json`: testi, tempi, illustrazioni e tipo di ogni grafica. È la fonte condivisa da entrambi gli esportatori.
- `src/words.json`: trascrizione con tempi parola per parola; correggere qui eventuali errori residui del riconoscimento automatico.
- `src/Graphics.tsx` e `src/Illustrations.tsx`: aspetto e animazione delle grafiche.
- `src/TikTok.tsx`: montaggio, posizioni e sottotitoli.

I tempi si riferiscono al video originale senza tagli. Gli schemi sono rappresentazioni concettuali del discorso; non sono grafici di dati scientifici. Le indicazioni sul piano gratuito e sulla beta riprendono il parlato e vanno riviste se si aggiorna il video.

## Esportazione alternativa senza browser

Con Python 3 e FFmpeg compilato con libass:

```bash
npm run render:ffmpeg
```

Produce il video completo e `out/captions.srt`. Usa gli stessi tempi e contenuti, con un aspetto simile e animazioni più semplici rispetto a Remotion. Non richiede pacchetti Python aggiuntivi.

## Verifica

- `npm run check`: controllo TypeScript.
- Esportazione alternativa verificata su fotogrammi rappresentativi e sul file completo.
- L'anteprima e l'esportazione Remotion richiedono verifica locale: Chromium non si avvia nell'ambiente in cui è stato preparato questo progetto.

La trascrizione automatica è stata corretta nei termini evidenti (Achivia, task, scorciatoie); è consigliata una revisione dei sottotitoli prima della pubblicazione.
