# Hata Yoga by Luemy

Guida vocale interattiva per la pratica dell'Hatha Yoga, pensata per principianti, con interfaccia e voce in italiano.

## Funzionalità

- Sessioni rapide da 15/30/45 minuti, con ritmo adattato alla durata scelta
- Guida vocale AI (Gemini TTS, voce "Zephyr") con cache lato server e fallback automatico alla voce di sistema del browser
- Yoga Builder per comporre sequenze personalizzate, con avvisi di sicurezza (riscaldamento mancante, asimmetrie destra/sinistra)
- Coach del respiro con respirazione quadrata per il pranayama
- Download della lezione completa in formato WAV
- Salvataggio delle sequenze personalizzate nel browser

## Stack

- Frontend: React 19 + Vite + Tailwind 4
- Server: Express + tsx
- Sintesi vocale: Gemini API (TTS)

## Avvio locale

Prerequisiti: Node.js

1. Installa le dipendenze:
   `npm install`
2. Crea `.env.local` a partire da `.env.example` e imposta `GEMINI_API_KEY` (opzionale: senza chiave l'app funziona comunque, usando la voce di sistema del browser)
3. Avvia l'app:
   `npm run dev`
4. Apri http://localhost:3001

## Build di produzione

`npm run build` per generare i file di build, poi `npm start` per avviare il server (porta configurabile tramite la variabile d'ambiente `PORT`).

## Note

Gli utenti possono collegare una chiave API Gemini personale dall'interfaccia (pulsante "Sblocca Limite") per superare i limiti di quota della chiave condivisa. La chiave viene salvata solo nel localStorage del browser e inviata al server tramite header, senza essere memorizzata lato server.

## Audio pre-generati

I file vocali delle pose vivono in `audio-cache/` e sono versionati nel repository: al deploy l'app li trova già pronti e non effettua alcuna chiamata TTS.

Nel repo i file sono testo base64 (`<id>.pcm.b64`), non PCM binario: la pipeline di deploy di AI Studio ricodifica i file come testo UTF-8 e corromperebbe un binario. Il server decodifica pigramente il `.b64` e materializza il `.pcm` su disco al primo utilizzo, poi serve direttamente quello.

Per generarli o rigenerarli in locale: configura `GEMINI_API_KEY` in `.env.local`, esegui `npm run generate-audio` (genera solo i file `.pcm.b64` mancanti, direttamente in formato base64), poi committa la cartella `audio-cache/`.

Attenzione: la cache è indicizzata per id della posa, non per contenuto del testo. Se si modifica lo `speechScript` di una posa occorre eliminare i relativi file `.pcm` e rigenerarli, altrimenti l'app continuerà a servire l'audio precedente senza segnalare nulla.

## Avvertenza medica

Questa applicazione ha scopo puramente informativo e non sostituisce il parere di un medico o di un insegnante qualificato. Consulta un medico prima di iniziare qualsiasi programma di esercizio fisico, soprattutto in caso di infortuni, gravidanza o condizioni preesistenti. Interrompi immediatamente la pratica se avverti dolore.

---

Distribuito con licenza MIT.
