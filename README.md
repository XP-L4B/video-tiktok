# TikTok · Storytelling a schermo diviso

Montaggio verticale 1080 × 1920, 30 fps, circa 2 minuti. La metà superiore è un filmato illustrato animato; la metà inferiore mostra il video originale. I sottotitoli dinamici occupano la fascia in fondo all’animazione, senza coprire il volto.

Le 28 scene seguono il parlato: notifiche che assediano un personaggio, consumatori e lavoratori che coincidono, interessi elaborati dall’IA per creare un feed personale, pezzi del cervello delegati a una macchina, risparmio di energia e trasformazione delle attività in un percorso di quest. I titoli sono brevi; oggetti, spostamenti, percorsi e trasformazioni raccontano il contenuto.

## Preparazione

Richiede Node.js 22+, Python 3.10+ e FFmpeg con libass.

1. Copia il video originale in `public/source.mp4`.
2. Esegui `npm ci` e `python3 -m pip install -r requirements.txt`.
3. Esegui `npm run story` per generare `public/story-top.mp4`.
4. Esegui `npm run dev` per aprire il montaggio in Remotion Studio.
5. Esegui `npm run render` per esportare con Remotion, oppure `npm run render:ffmpeg` per esportare senza browser.

L’esportatore FFmpeg produce `out/tiktok-storytelling.mp4` e `out/captions.srt`.

## Modifiche

- `storyboard/scenes.json`: tempi, brevi titoli e tipo delle scene.
- `scripts/render_story.py`: disegni vettoriali, personaggio e animazioni per fotogramma. Usa Pillow e FFmpeg; non richiede Chromium.
- `src/words.json`: sottotitoli con tempi parola per parola.
- `src/TikTok.tsx`: composizione Remotion 50/50 e sottotitoli.
- `scripts/render_split.py`: esportazione equivalente con FFmpeg/libass.

Dopo ogni modifica alle illustrazioni o alle scene, riesegui `npm run story`. I file MP4 e le dipendenze non sono inclusi in Git. Non sono richiesti servizi a pagamento o chiavi API.

## Verifica e limiti

Controllo TypeScript e sintassi Python verificati. Il video viene esportato e controllato con FFmpeg. Il render Remotion richiede una verifica locale perché Chromium non si avvia nell’ambiente di preparazione.

Le illustrazioni rappresentano concetti del parlato; non sono grafici di dati scientifici. La dashboard è un’illustrazione, non una schermata reale dell’app. La trascrizione automatica è stata corretta nei termini evidenti: rileggere i sottotitoli prima della pubblicazione. Piano gratuito e beta riprendono le dichiarazioni nel video originale.
