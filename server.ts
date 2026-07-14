import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { YOGA_SEQUENCE, getSequenceForDuration } from "./src/data/yogaSequence.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3001;

// Initialize GoogleGenAI client with the required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const CACHE_DIR = path.join(process.cwd(), "audio-cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Helper to write standard 44-byte WAV header for 24000Hz 16-bit Mono PCM
function createWavHeader(pcmLength: number, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  
  // RIFF identifier
  header.write("RIFF", 0);
  // file length - 8
  header.writeUInt32LE(pcmLength + 36, 4);
  // RIFF type
  header.write("WAVE", 8);
  // Format chunk marker
  header.write("fmt ", 12);
  // Length of format data
  header.writeUInt32LE(16, 16);
  // Type of format (1 = PCM)
  header.writeUInt16LE(1, 20);
  // Number of channels
  header.writeUInt16LE(numChannels, 22);
  // Sample rate
  header.writeUInt32LE(sampleRate, 24);
  // Byte rate = SampleRate * NumChannels * BitsPerSample/8
  header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  // Block align = NumChannels * BitsPerSample/8
  header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  // Bits per sample
  header.writeUInt16LE(bitsPerSample, 34);
  // Data chunk identifier
  header.write("data", 36);
  // Data chunk size
  header.writeUInt32LE(pcmLength, 40);
  
  return header;
}

// Helper to downsample 16-bit Mono PCM from 24000Hz to 12000Hz (cuts size in half)
function downsamplePCM2x(buffer: Buffer): Buffer {
  const numSamples = Math.floor(buffer.length / 2);
  const newNumSamples = Math.floor(numSamples / 2);
  const output = Buffer.alloc(newNumSamples * 2);
  
  for (let i = 0; i < newNumSamples; i++) {
    const sourceOffset = i * 4;
    const destOffset = i * 2;
    if (sourceOffset + 1 < buffer.length) {
      output.writeUInt16LE(buffer.readUInt16LE(sourceOffset), destOffset);
    }
  }
  return output;
}

// Bypass cloud API requests if rate limited (cool-down period)
let cloudTtsBypassedUntil = 0;

// Minimal in-memory guard for the cache-warmup endpoint
let warmupRunning = false;
const warmupLastRequestByIp = new Map<string, number>();

// Generate step audio PCM from Gemini or cache
async function getStepAudioPCM(stepId: string, speechScript: string, allowThrow = false, customApiKey?: string, cacheKey?: string): Promise<Buffer> {
  const key = cacheKey || stepId;
  const cachePath = path.join(CACHE_DIR, `${key}.pcm`);
  
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }
  
  const apiKeyToUse = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKeyToUse) {
    if (allowThrow) {
      throw new Error("NoApiKeyConfigured");
    }
    const fallbackBuffer = Buffer.alloc(240000);
    return fallbackBuffer;
  }

  if (!customApiKey && Date.now() < cloudTtsBypassedUntil) {
    if (allowThrow) {
      throw new Error("LocalFallbackActive");
    }
    const fallbackBuffer = Buffer.alloc(240000);
    return fallbackBuffer;
  }
  
  console.log(`[TTS] Requesting voice for ${key}${customApiKey ? " using custom API key" : " using default server key"}...`);
  let attempt = 0;
  const maxAttempts = 2;
  let delay = 1000;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "aistudio-build",
          "x-goog-api-key": apiKeyToUse
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Leggi con voce estremamente calma, rilassante, calda e rassicurante in italiano, facendo delle brevi pause naturali tra le frasi: ${speechScript}` }] }],
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
        throw new Error(errMsg);
      }

      const data = await response.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("NoVoiceData");
      }
      
      const pcmBuffer = Buffer.from(base64Audio, "base64");
      fs.writeFileSync(cachePath, pcmBuffer);
      return pcmBuffer;
    } catch (error: any) {
      console.error(`[TTS Error for ${stepId}]:`, error);
      const errorMsg = error?.message || "";
      const isQuota = errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED");
      
      if (isQuota) {
        if (customApiKey) {
          throw new Error("CustomApiKeyQuotaExceeded");
        }

        let cooldownMs = 60 * 1000;
        try {
          const retryMatch = errorMsg.match(/retry in ([\d\.]+)s/i);
          if (retryMatch && retryMatch[1]) {
            cooldownMs = (parseFloat(retryMatch[1]) + 2) * 1000;
          }
        } catch (_) {}

        cloudTtsBypassedUntil = Date.now() + cooldownMs;
        console.log(`[TTS] Cloud rate limit reached for step ${stepId}. Cooldown: ${Math.round(cooldownMs / 1000)}s. Activating local fallback mode.`);
        if (allowThrow) {
          throw new Error("LocalFallbackActive");
        }
        break;
      }
      
      if (attempt < maxAttempts) {
        console.log(`[TTS] Request retry in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        continue;
      }
      
      console.log(`[TTS] Action deferred for step ${stepId}.`);
      if (allowThrow) {
        throw new Error("LocalFallbackActive");
      }
      break;
    }
  }

  const fallbackBuffer = Buffer.alloc(240000);
  return fallbackBuffer;
}

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", cachedStepsCount: fs.readdirSync(CACHE_DIR).length });
});

// API: Get sequence steps list
app.get("/api/sequence", (req, res) => {
  const durationMin = parseInt(req.query.duration as string) || 15;
  const activeSequence = getSequenceForDuration(durationMin, YOGA_SEQUENCE);
  res.json(activeSequence);
});

// API: Get cached status
app.get("/api/cache-status", (req, res) => {
  const durationMin = parseInt(req.query.duration as string) || 15;
  const activeSequence = getSequenceForDuration(durationMin, YOGA_SEQUENCE);
  const files = fs.readdirSync(CACHE_DIR);
  const status: Record<string, boolean> = {};
  activeSequence.forEach(step => {
    status[step.id] = files.includes(`${step.id}_mantenimento.pcm`);
  });
  res.json({
    cachedCount: Object.values(status).filter(Boolean).length,
    totalCount: activeSequence.length,
    status,
    quotaExceeded: Date.now() < cloudTtsBypassedUntil,
    cooldownRemaining: Math.max(0, Math.round((cloudTtsBypassedUntil - Date.now()) / 1000)),
    hasServerApiKey: !!process.env.GEMINI_API_KEY
  });
});

// API: Trigger background pre-generation of all step voice audios
app.post("/api/cache-warmup", async (req, res) => {
  const durationMin = parseInt(req.query.duration as string) || 15;
  const activeSequence = getSequenceForDuration(durationMin, YOGA_SEQUENCE);
  const customApiKey = req.headers["x-gemini-api-key"] as string | undefined;

  // Minimal per-IP rate limit: at most one warmup request per minute
  const ip = req.ip || "unknown";
  if (Date.now() - (warmupLastRequestByIp.get(ip) || 0) < 60_000) {
    res.status(429).json({ error: "Attendi un minuto prima di richiedere un nuovo preriscaldamento." });
    return;
  }
  warmupLastRequestByIp.set(ip, Date.now());

  // Avoid piling up multiple background warmups on the shared default key
  if (warmupRunning && !customApiKey) {
    res.status(429).json({ error: "Un preriscaldamento è già in corso. Riprova tra qualche minuto." });
    return;
  }

  // Verify API key before starting background warmup
  if (customApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "aistudio-build",
          "x-goog-api-key": customApiKey
        }
      });
      
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errMsg);
      }
    } catch (error: any) {
      console.error("[TTS Cache] Custom API Key validation failed:", error);
      res.status(400).json({ error: `La chiave API Gemini inserita non è valida: ${error.message || error}` });
      return;
    }
  } else if (!process.env.GEMINI_API_KEY) {
    res.status(400).json({ error: "Chiave API Gemini non configurata sul server. Sblocca il limite inserendo una chiave personale in alto a destra." });
    return;
  }
  
  res.json({ message: "Inizio preriscaldamento della cache in background." });
  
  // Warm up in background so response is non-blocking
  (async () => {
    if (!customApiKey) {
      warmupRunning = true;
    }
    try {
      console.log(`[TTS Cache] Starting background cache warmup for ${durationMin}m (${activeSequence.length} steps)...`);
      for (const step of activeSequence) {
        // If we are currently rate-limited and NOT using a custom API key, wait until the cooldown expires
        if (!customApiKey) {
          while (Date.now() < cloudTtsBypassedUntil) {
            const waitTime = Math.max(1000, cloudTtsBypassedUntil - Date.now());
            console.log(`[TTS Cache] Rate limit cooldown active. Waiting ${Math.round(waitTime / 1000)}s before trying step: ${step.id}`);
            await new Promise(r => setTimeout(r, waitTime));
          }
        }

        try {
          const parts = step.speechScript.split(" | ");
          const mantenimentoText = parts[0] || "";
          const uscitaText = parts[1] || "";

          if (mantenimentoText.trim()) {
            await getStepAudioPCM(step.id, mantenimentoText, false, customApiKey, `${step.id}_mantenimento`);
          }
          if (uscitaText.trim()) {
            await getStepAudioPCM(step.id, uscitaText, false, customApiKey, `${step.id}_uscita`);
          }
          // Wait to respect rate limits (4s if custom, 21s if shared/default)
          const delay = customApiKey ? 4000 : 21000;
          await new Promise(r => setTimeout(r, delay));
        } catch (err) {
          console.log(`[TTS Cache] Soft bypass for ${step.id}:`, err);
        }
      }
      console.log("[TTS Cache] Warmup process settled. Total cached files:", fs.readdirSync(CACHE_DIR).length);
    } finally {
      warmupRunning = false;
    }
  })();
});

// API: Play a single step audio (mantenimento or uscita phase)
app.get("/api/audio/:stepId", async (req, res) => {
  const { stepId } = req.params;
  try {
    const step = YOGA_SEQUENCE.find(s => s.id === stepId);
    if (!step) {
      res.status(404).json({ error: "Asana non trovata." });
      return;
    }
    
    const phase = req.query.phase as string || "mantenimento";
    const parts = step.speechScript.split(" | ");
    const speechText = phase === "uscita" ? (parts[1] || "") : parts[0];
    
    if (!speechText.trim()) {
      const emptyBuffer = Buffer.alloc(4800); // 0.1s silence at 24000Hz 16-bit Mono
      const wavHeader = createWavHeader(emptyBuffer.length);
      const wavFile = Buffer.concat([wavHeader, emptyBuffer]);
      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Content-Length", wavFile.length);
      res.send(wavFile);
      return;
    }

    const cacheKey = `${step.id}_${phase === "uscita" ? "uscita" : "mantenimento"}`;
    const customApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    
    // Pass true for allowThrow so that we don't swallow quota/rate errors
    const pcmBuffer = await getStepAudioPCM(step.id, speechText, true, customApiKey, cacheKey);
    const wavHeader = createWavHeader(pcmBuffer.length);
    const wavFile = Buffer.concat([wavHeader, pcmBuffer]);
    
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", wavFile.length);
    res.send(wavFile);
  } catch (err: any) {
    const isRateLimit = err?.message?.includes("429") || err?.message?.includes("quota") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("LocalFallbackActive") || err?.message?.includes("CustomApiKeyQuotaExceeded");
    if (isRateLimit) {
      console.log(`[TTS] Cloud limit active for step ${stepId}. Utilizing local browser speech voice.`);
    } else {
      console.log(`[TTS] Action deferred for step ${stepId}`);
    }
    res.status(isRateLimit ? 429 : 500).json({ 
      error: err?.message === "CustomApiKeyQuotaExceeded" 
        ? "La tua chiave API Gemini personale ha superato la quota di utilizzo gratuito. Attendi qualche istante o controlla i dettagli della chiave."
        : "Sintesi vocale temporaneamente non disponibile. Verrà usata la voce locale del browser.",
      code: isRateLimit ? "QUOTA_EXCEEDED" : "SERVER_ERROR"
    });
  }
});

// Helper to estimate or fetch step PCM lengths
function getStepPCMInfo(stepId: string, cacheDir: string): { downsampledLength: number } {
  const cachePath = path.join(cacheDir, `${stepId}.pcm`);
  let originalLength = 240000; // default 5 seconds silence at 24000Hz (16-bit Mono)
  if (fs.existsSync(cachePath)) {
    try {
      originalLength = fs.statSync(cachePath).size;
    } catch (_) {}
  }
  
  const numSamples = Math.floor(originalLength / 2);
  const newNumSamples = Math.floor(numSamples / 2);
  const downsampledLength = newNumSamples * 2;
  
  return { downsampledLength };
}

// API: Download combined session audio with customized silence pauses
app.get("/api/audio-download", async (req, res) => {
  try {
    let durationMin = parseInt(req.query.duration as string) || 15;
    // Clamp defensively between 5 and 90 minutes
    if (durationMin < 5) durationMin = 5;
    if (durationMin > 90) durationMin = 90;
    
    const customApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    const activeSequence = getSequenceForDuration(durationMin, YOGA_SEQUENCE);
    console.log(`[TTS Download] Generating combined audio of ${durationMin} minutes (${activeSequence.length} steps)${customApiKey ? " with custom API key" : ""}...`);
    
    // 1. Generate any missing steps sequentially before starting the stream
    for (let i = 0; i < activeSequence.length; i++) {
      const step = activeSequence[i];
      const parts = step.speechScript.split(" | ");
      const mantenimentoText = parts[0] || "";
      const uscitaText = parts[1] || "";

      // Warm up mantenimento
      if (mantenimentoText.trim()) {
        const cachePathM = path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`);
        if (!fs.existsSync(cachePathM)) {
          console.log(`[TTS Download] Cache miss for step ${step.id} mantenimento. Generating before stream...`);
          try {
            await getStepAudioPCM(step.id, mantenimentoText, true, customApiKey, `${step.id}_mantenimento`);
            const delay = customApiKey ? 4000 : 21000;
            await new Promise(r => setTimeout(r, delay));
          } catch (err) {
            console.warn(`[TTS Download] Failed to pre-generate ${step.id} mantenimento, using silence fallback:`, err);
          }
        }
      }

      // Warm up uscita
      if (uscitaText.trim()) {
        const cachePathU = path.join(CACHE_DIR, `${step.id}_uscita.pcm`);
        if (!fs.existsSync(cachePathU)) {
          console.log(`[TTS Download] Cache miss for step ${step.id} uscita. Generating before stream...`);
          try {
            await getStepAudioPCM(step.id, uscitaText, true, customApiKey, `${step.id}_uscita`);
            const delay = customApiKey ? 4000 : 21000;
            await new Promise(r => setTimeout(r, delay));
          } catch (err) {
            console.warn(`[TTS Download] Failed to pre-generate ${step.id} uscita, using silence fallback:`, err);
          }
        }
      }
    }

    // Abort with a clear error instead of streaming a WAV with silent holes
    const missingSteps: string[] = [];
    for (const step of activeSequence) {
      const parts = step.speechScript.split(" | ");
      if (parts[0]?.trim() && !fs.existsSync(path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`))) missingSteps.push(step.id);
      else if (parts[1]?.trim() && !fs.existsSync(path.join(CACHE_DIR, `${step.id}_uscita.pcm`))) missingSteps.push(step.id);
    }
    if (missingSteps.length > 0) {
      res.status(409).json({ error: `${missingSteps.length} asana non sono ancora state sintetizzate (quota esaurita?). Riprova tra qualche minuto o collega una chiave API personale.` });
      return;
    }

    // 2. Snapshot the exact sizes of all cached files for both phases
    const snapshottedOriginalLengths: Record<string, { mantenimento: number; uscita: number }> = {};
    for (const step of activeSequence) {
      const cachePathM = path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`);
      const cachePathU = path.join(CACHE_DIR, `${step.id}_uscita.pcm`);
      
      let lenM = 240000;
      if (fs.existsSync(cachePathM)) {
        try { lenM = fs.statSync(cachePathM).size; } catch (_) {}
      }
      
      let lenU = 4800; // tiny silent fallback if no exit script
      const parts = step.speechScript.split(" | ");
      if (parts[1] && parts[1].trim()) {
        if (fs.existsSync(cachePathU)) {
          try { lenU = fs.statSync(cachePathU).size; } catch (_) {}
        } else {
          lenU = 240000;
        }
      } else {
        lenU = 4800;
      }
      
      snapshottedOriginalLengths[step.id] = { mantenimento: lenM, uscita: lenU };
    }
    
    // 3. Calculate downsampled lengths and total speech bytes
    let totalSpeechBytes = 0;
    const snapshottedDownsampledLengths: Record<string, { mantenimento: number; uscita: number }> = {};
    for (const step of activeSequence) {
      const { mantenimento: lenM, uscita: lenU } = snapshottedOriginalLengths[step.id];
      
      const numSamplesM = Math.floor(lenM / 2);
      const newNumSamplesM = Math.floor(numSamplesM / 2);
      const downM = newNumSamplesM * 2;
      
      const numSamplesU = Math.floor(lenU / 2);
      const newNumSamplesU = Math.floor(numSamplesU / 2);
      const downU = newNumSamplesU * 2;
      
      snapshottedDownsampledLengths[step.id] = { mantenimento: downM, uscita: downU };
      totalSpeechBytes += downM + downU;
    }
    
    // 4. Pauses are exactly 10 seconds per step, between mantenimento and uscita!
    // No extra pauses between steps.
    const holdSec = 10;
    const holdBytesSize = Math.floor(holdSec * 12000) * 2; // 12000Hz 16-bit Mono (2 bytes per sample)
    const totalSilenceBytes = activeSequence.length * holdBytesSize;
    
    const totalDataSize = totalSpeechBytes + totalSilenceBytes;
    const wavHeader = createWavHeader(totalDataSize, 12000);
    
    // 5. Set response headers for direct stream download with anti-buffering & no-cache
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", `attachment; filename="sequenza_yoga_hatha_${durationMin}min.wav"`);
    res.setHeader("x-audio-total-bytes", (totalDataSize + 44).toString());
    res.setHeader("Access-Control-Expose-Headers", "x-audio-total-bytes");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    
    // Write WAV header immediately to start download
    res.write(wavHeader);
    
    // 6. Pre-allocate 10-second silence buffer once to reuse
    const silenceBuffer = Buffer.alloc(holdBytesSize);
    
    // 7. Stream each step sequential chunk by chunk
    for (let i = 0; i < activeSequence.length; i++) {
      const step = activeSequence[i];
      const { mantenimento: targetMOrig, uscita: targetUOrig } = snapshottedOriginalLengths[step.id];
      const { mantenimento: targetMDown, uscita: targetUDown } = snapshottedDownsampledLengths[step.id];
      
      // Load and stream Mantenimento
      const cachePathM = path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`);
      let pcmM: Buffer;
      try {
        pcmM = fs.readFileSync(cachePathM);
      } catch (_) {
        pcmM = Buffer.alloc(targetMOrig);
      }
      
      let finalPCMM = pcmM;
      if (pcmM.length !== targetMOrig) {
        if (pcmM.length > targetMOrig) {
          finalPCMM = pcmM.subarray(0, targetMOrig);
        } else {
          finalPCMM = Buffer.concat([pcmM, Buffer.alloc(targetMOrig - pcmM.length)]);
        }
      }
      
      const downM = downsamplePCM2x(finalPCMM);
      let finalDownM = downM;
      if (downM.length !== targetMDown) {
        if (downM.length > targetMDown) {
          finalDownM = downM.subarray(0, targetMDown);
        } else {
          finalDownM = Buffer.concat([downM, Buffer.alloc(targetMDown - downM.length)]);
        }
      }
      
      res.write(finalDownM);
      
      // Write 10 seconds of silence between mantenimento and uscita
      res.write(silenceBuffer);
      
      // Load and stream Uscita
      const cachePathU = path.join(CACHE_DIR, `${step.id}_uscita.pcm`);
      let pcmU: Buffer;
      try {
        pcmU = fs.readFileSync(cachePathU);
      } catch (_) {
        pcmU = Buffer.alloc(targetUOrig);
      }
      
      let finalPCMU = pcmU;
      if (pcmU.length !== targetUOrig) {
        if (pcmU.length > targetUOrig) {
          finalPCMU = pcmU.subarray(0, targetUOrig);
        } else {
          finalPCMU = Buffer.concat([pcmU, Buffer.alloc(targetUOrig - pcmU.length)]);
        }
      }
      
      const downU = downsamplePCM2x(finalPCMU);
      let finalDownU = downU;
      if (downU.length !== targetUDown) {
        if (downU.length > targetUDown) {
          finalDownU = downU.subarray(0, targetUDown);
        } else {
          finalDownU = Buffer.concat([downU, Buffer.alloc(targetUDown - downU.length)]);
        }
      }
      
      res.write(finalDownU);
    }
    
    res.end();
    console.log(`[TTS Download] Audio stream of ${durationMin} minutes completed successfully.`);
  } catch (err: any) {
    console.error("[TTS Download] Combined session audio generation failed:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Impossibile scaricare l'audio. Riprova più tardi." });
    }
  }
});

// API: Download custom combined session audio
app.post("/api/audio-download-custom", async (req, res) => {
  try {
    const { steps } = req.body;
    if (!Array.isArray(steps) || steps.length === 0) {
      res.status(400).json({ error: "Sequenza vuota o non valida." });
      return;
    }
    
    // Map custom step IDs to full step objects
    const activeSequence: typeof YOGA_SEQUENCE = [];
    for (const item of steps) {
      const step = YOGA_SEQUENCE.find(s => s.id === item.id);
      if (step) {
        activeSequence.push(step);
      }
    }
    
    if (activeSequence.length === 0) {
      res.status(400).json({ error: "Nessun asana valido trovato nella sequenza." });
      return;
    }
    
    const customApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    console.log(`[TTS Download Custom] Generating custom combined audio of ${activeSequence.length} steps${customApiKey ? " with custom API key" : ""}...`);
    
    // 1. Generate any missing steps sequentially before starting the stream
    for (let i = 0; i < activeSequence.length; i++) {
      const step = activeSequence[i];
      const parts = step.speechScript.split(" | ");
      const mantenimentoText = parts[0] || "";
      const uscitaText = parts[1] || "";

      // Warm up mantenimento
      if (mantenimentoText.trim()) {
        const cachePathM = path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`);
        if (!fs.existsSync(cachePathM)) {
          console.log(`[TTS Download Custom] Cache miss for step ${step.id} mantenimento. Generating before stream...`);
          try {
            await getStepAudioPCM(step.id, mantenimentoText, true, customApiKey, `${step.id}_mantenimento`);
            const delay = customApiKey ? 4000 : 21000;
            await new Promise(r => setTimeout(r, delay));
          } catch (err) {
            console.warn(`[TTS Download Custom] Failed to pre-generate ${step.id} mantenimento, using silence fallback:`, err);
          }
        }
      }

      // Warm up uscita
      if (uscitaText.trim()) {
        const cachePathU = path.join(CACHE_DIR, `${step.id}_uscita.pcm`);
        if (!fs.existsSync(cachePathU)) {
          console.log(`[TTS Download Custom] Cache miss for step ${step.id} uscita. Generating before stream...`);
          try {
            await getStepAudioPCM(step.id, uscitaText, true, customApiKey, `${step.id}_uscita`);
            const delay = customApiKey ? 4000 : 21000;
            await new Promise(r => setTimeout(r, delay));
          } catch (err) {
            console.warn(`[TTS Download Custom] Failed to pre-generate ${step.id} uscita, using silence fallback:`, err);
          }
        }
      }
    }

    // Abort with a clear error instead of streaming a WAV with silent holes
    const missingSteps: string[] = [];
    for (const step of activeSequence) {
      const parts = step.speechScript.split(" | ");
      if (parts[0]?.trim() && !fs.existsSync(path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`))) missingSteps.push(step.id);
      else if (parts[1]?.trim() && !fs.existsSync(path.join(CACHE_DIR, `${step.id}_uscita.pcm`))) missingSteps.push(step.id);
    }
    if (missingSteps.length > 0) {
      res.status(409).json({ error: `${missingSteps.length} asana non sono ancora state sintetizzate (quota esaurita?). Riprova tra qualche minuto o collega una chiave API personale.` });
      return;
    }

    // 2. Snapshot the exact sizes of all cached files for both phases
    const snapshottedOriginalLengths: Record<string, { mantenimento: number; uscita: number }> = {};
    for (const step of activeSequence) {
      const cachePathM = path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`);
      const cachePathU = path.join(CACHE_DIR, `${step.id}_uscita.pcm`);
      
      let lenM = 240000;
      if (fs.existsSync(cachePathM)) {
        try { lenM = fs.statSync(cachePathM).size; } catch (_) {}
      }
      
      let lenU = 4800; // tiny silent fallback if no exit script
      const parts = step.speechScript.split(" | ");
      if (parts[1] && parts[1].trim()) {
        if (fs.existsSync(cachePathU)) {
          try { lenU = fs.statSync(cachePathU).size; } catch (_) {}
        } else {
          lenU = 240000;
        }
      } else {
        lenU = 4800;
      }
      
      snapshottedOriginalLengths[step.id] = { mantenimento: lenM, uscita: lenU };
    }
    
    // 3. Calculate downsampled lengths and total speech bytes
    let totalSpeechBytes = 0;
    const snapshottedDownsampledLengths: Record<string, { mantenimento: number; uscita: number }> = {};
    for (const step of activeSequence) {
      const { mantenimento: lenM, uscita: lenU } = snapshottedOriginalLengths[step.id];
      
      const numSamplesM = Math.floor(lenM / 2);
      const newNumSamplesM = Math.floor(numSamplesM / 2);
      const downM = newNumSamplesM * 2;
      
      const numSamplesU = Math.floor(lenU / 2);
      const newNumSamplesU = Math.floor(numSamplesU / 2);
      const downU = newNumSamplesU * 2;
      
      snapshottedDownsampledLengths[step.id] = { mantenimento: downM, uscita: downU };
      totalSpeechBytes += downM + downU;
    }
    
    // 4. Pauses are exactly 10 seconds per step, between mantenimento and uscita
    const holdSec = 10;
    const holdBytesSize = Math.floor(holdSec * 12000) * 2; // 12000Hz 16-bit Mono (2 bytes per sample)
    const totalSilenceBytes = activeSequence.length * holdBytesSize;
    
    const totalDataSize = totalSpeechBytes + totalSilenceBytes;
    const wavHeader = createWavHeader(totalDataSize, 12000);
    
    // 5. Set response headers for direct stream download with anti-buffering & no-cache
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", `attachment; filename="sequenza_yoga_personalizzata.wav"`);
    res.setHeader("x-audio-total-bytes", (totalDataSize + 44).toString());
    res.setHeader("Access-Control-Expose-Headers", "x-audio-total-bytes");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    
    // Write WAV header immediately to start download
    res.write(wavHeader);
    
    // 6. Pre-allocate 10-second silence buffer once to reuse
    const silenceBuffer = Buffer.alloc(holdBytesSize);
    
    // 7. Stream each step sequential chunk by chunk
    for (let i = 0; i < activeSequence.length; i++) {
      const step = activeSequence[i];
      const { mantenimento: targetMOrig, uscita: targetUOrig } = snapshottedOriginalLengths[step.id];
      const { mantenimento: targetMDown, uscita: targetUDown } = snapshottedDownsampledLengths[step.id];
      
      // Load and stream Mantenimento
      const cachePathM = path.join(CACHE_DIR, `${step.id}_mantenimento.pcm`);
      let pcmM: Buffer;
      try {
        pcmM = fs.readFileSync(cachePathM);
      } catch (_) {
        pcmM = Buffer.alloc(targetMOrig);
      }
      
      let finalPCMM = pcmM;
      if (pcmM.length !== targetMOrig) {
        if (pcmM.length > targetMOrig) {
          finalPCMM = pcmM.subarray(0, targetMOrig);
        } else {
          finalPCMM = Buffer.concat([pcmM, Buffer.alloc(targetMOrig - pcmM.length)]);
        }
      }
      
      const downM = downsamplePCM2x(finalPCMM);
      let finalDownM = downM;
      if (downM.length !== targetMDown) {
        if (downM.length > targetMDown) {
          finalDownM = downM.subarray(0, targetMDown);
        } else {
          finalDownM = Buffer.concat([downM, Buffer.alloc(targetMDown - downM.length)]);
        }
      }
      
      res.write(finalDownM);
      
      // Write 10 seconds of silence between mantenimento and uscita
      res.write(silenceBuffer);
      
      // Load and stream Uscita
      const cachePathU = path.join(CACHE_DIR, `${step.id}_uscita.pcm`);
      let pcmU: Buffer;
      try {
        pcmU = fs.readFileSync(cachePathU);
      } catch (_) {
        pcmU = Buffer.alloc(targetUOrig);
      }
      
      let finalPCMU = pcmU;
      if (pcmU.length !== targetUOrig) {
        if (pcmU.length > targetUOrig) {
          finalPCMU = pcmU.subarray(0, targetUOrig);
        } else {
          finalPCMU = Buffer.concat([pcmU, Buffer.alloc(targetUOrig - pcmU.length)]);
        }
      }
      
      const downU = downsamplePCM2x(finalPCMU);
      let finalDownU = downU;
      if (downU.length !== targetUDown) {
        if (downU.length > targetUDown) {
          finalDownU = downU.subarray(0, targetUDown);
        } else {
          finalDownU = Buffer.concat([downU, Buffer.alloc(targetUDown - downU.length)]);
        }
      }
      
      res.write(finalDownU);
    }
    
    res.end();
    console.log(`[TTS Download Custom] Custom audio stream of ${activeSequence.length} steps completed successfully.`);
  } catch (err: any) {
    console.error("[TTS Download Custom] Custom combined session audio generation failed:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Impossibile scaricare l'audio personalizzato. Riprova più tardi." });
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Hatha Yoga server listening on http://localhost:${PORT}`);
  });
}

startServer();
