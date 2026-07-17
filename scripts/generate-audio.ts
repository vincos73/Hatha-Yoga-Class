// Standalone CLI script to pre-generate TTS audio files for the yoga sequence.
// Run with: npm run generate-audio
// Only generates files that are missing from audio-cache/; existing files are left untouched.

import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import fs from "fs";
import path from "path";
import { YOGA_SEQUENCE, type YogaStep } from "../src/data/yogaSequence.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY non trovata. Creala in .env.local (vedi .env.example).");
  process.exit(1);
}

const CACHE_DIR = path.join(process.cwd(), "audio-cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Delay between one TTS request and the next, to keep a prudent pace on a paid key.
const REQUEST_DELAY_MS = 3000;
// Delay before a single retry after a quota/rate-limit error.
const QUOTA_RETRY_DELAY_MS = 15000;

interface GenerationTarget {
  file: string;
  text: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Collect the (up to two) generation targets for a single step: mantenimento and uscita phases.
function getTargetsForStep(step: YogaStep): GenerationTarget[] {
  const parts = step.speechScript.split(" | ");
  const targets: GenerationTarget[] = [];

  const mantenimentoText = parts[0]?.trim();
  if (mantenimentoText) {
    targets.push({ file: `${step.id}_mantenimento.pcm`, text: mantenimentoText });
  }

  const uscitaText = parts[1]?.trim();
  if (uscitaText) {
    targets.push({ file: `${step.id}_uscita.pcm`, text: uscitaText });
  }

  return targets;
}

// Call the Gemini TTS API for a single piece of text, returning the raw PCM buffer.
// Mirrors the request made server-side in server.ts.
async function requestTtsAudio(text: string): Promise<{ pcmBuffer: Buffer; candidatesTokenCount?: number }> {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "aistudio-build",
      "x-goog-api-key": GEMINI_API_KEY as string
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Leggi con voce estremamente calma, rilassante, calda e rassicurante in italiano, facendo delle brevi pause naturali tra le frasi: ${text}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Zephyr" }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    const errMsg = errJson.error?.message || `HTTP error! status: ${response.status}`;
    const error = new Error(errMsg) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("NoVoiceData");
  }

  const pcmBuffer = Buffer.from(base64Audio, "base64");
  return { pcmBuffer, candidatesTokenCount: data.usageMetadata?.candidatesTokenCount };
}

function isQuotaError(error: any): boolean {
  const status = error?.status;
  const message = error?.message || "";
  return status === 429 || message.includes("quota") || message.includes("RESOURCE_EXHAUSTED");
}

async function main() {
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const step of YOGA_SEQUENCE) {
    const targets = getTargetsForStep(step);

    for (const target of targets) {
      const filePath = path.join(CACHE_DIR, target.file);

      if (fs.existsSync(filePath) || fs.existsSync(`${filePath}.b64`)) {
        console.log(`[skip] ${target.file} (già presente)`);
        skipped++;
        continue;
      }

      try {
        let result;
        try {
          result = await requestTtsAudio(target.text);
        } catch (error: any) {
          if (isQuotaError(error)) {
            console.log(`[attesa] ${target.file}: limite di quota raggiunto, nuovo tentativo tra 15 secondi...`);
            await sleep(QUOTA_RETRY_DELAY_MS);
            result = await requestTtsAudio(target.text);
          } else {
            throw error;
          }
        }

        const b64 = result.pcmBuffer.toString("base64").replace(/(.{76})/g, "$1\n");
        fs.writeFileSync(`${filePath}.b64`, b64);
        const kb = (result.pcmBuffer.length / 1024).toFixed(1);
        const tokenInfo = result.candidatesTokenCount !== undefined ? `, ${result.candidatesTokenCount} token output` : "";
        console.log(`[ok] ${target.file} (${kb} KB${tokenInfo})`);
        generated++;
      } catch (error: any) {
        console.log(`[errore] ${target.file}: ${error?.message || error}`);
        failed++;
      }

      await sleep(REQUEST_DELAY_MS);
    }
  }

  let totalBytes = 0;
  for (const file of fs.readdirSync(CACHE_DIR)) {
    totalBytes += fs.statSync(path.join(CACHE_DIR, file)).size;
  }
  const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);

  console.log(`Completato: ${generated} generati, ${skipped} già presenti, ${failed} falliti. Dimensione totale cache: ${totalMb} MB.`);

  if (failed > 0) {
    process.exit(1);
  }

  if (failed === 0 && generated > 0) {
    console.log("Ora committa la cartella audio-cache/ nel repo: git add audio-cache && git commit");
  }

  process.exit(0);
}

main();
