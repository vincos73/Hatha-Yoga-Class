import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { YOGA_SEQUENCE } from "./src/data/yogaSequence.js";

dotenv.config();

const app = express();
const PORT = 3000;

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

// Generate step audio PCM from Gemini or cache
async function getStepAudioPCM(stepId: string, speechScript: string, allowThrow = false, customApiKey?: string): Promise<Buffer> {
  const cachePath = path.join(CACHE_DIR, `${stepId}.pcm`);
  
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }
  
  if (!customApiKey && Date.now() < cloudTtsBypassedUntil) {
    if (allowThrow) {
      throw new Error("LocalFallbackActive");
    }
    const fallbackBuffer = Buffer.alloc(240000);
    return fallbackBuffer;
  }
  
  console.log(`[TTS] Requesting voice for ${stepId}${customApiKey ? " using custom API key" : ""}...`);
  let attempt = 0;
  const maxAttempts = 2;
  let delay = 1000;

  const activeAi = customApiKey
    ? new GoogleGenAI({
        apiKey: customApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : ai;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      // Call Gemini Text to Speech API
      const response = await activeAi.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Leggi con voce estremamente calma, rilassante, calda e rassicurante in italiano, facendo delle brevi pause naturali tra le frasi: ${speechScript}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Zephyr" }
            }
          }
        }
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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
          // If custom key gets quota error, throw immediately so client is notified of their key's quota limit
          throw new Error("CustomApiKeyQuotaExceeded");
        }

        // Activate cool-down bypass based on Gemini's specified delay or default to 60s
        let cooldownMs = 60 * 1000;
        try {
          const retryMatch = errorMsg.match(/retry in ([\d\.]+)s/i);
          if (retryMatch && retryMatch[1]) {
            cooldownMs = (parseFloat(retryMatch[1]) + 2) * 1000;
          } else {
            const errorDetails = error.details || error.error?.details;
            if (Array.isArray(errorDetails)) {
              const retryInfo = errorDetails.find((d: any) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo");
              if (retryInfo?.retryDelay) {
                const seconds = parseFloat(retryInfo.retryDelay);
                if (!isNaN(seconds)) {
                  cooldownMs = (seconds + 2) * 1000;
                }
              }
            }
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

  // Fallback to a silent 5-second buffer (24000 Hz * 2 bytes/sample * 5 seconds = 240000 bytes)
  const fallbackBuffer = Buffer.alloc(240000);
  return fallbackBuffer;
}

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", cachedStepsCount: fs.readdirSync(CACHE_DIR).length });
});

// API: Get sequence steps list
app.get("/api/sequence", (req, res) => {
  res.json(YOGA_SEQUENCE);
});

// API: Get cached status
app.get("/api/cache-status", (req, res) => {
  const files = fs.readdirSync(CACHE_DIR);
  const status: Record<string, boolean> = {};
  YOGA_SEQUENCE.forEach(step => {
    status[step.id] = files.includes(`${step.id}.pcm`);
  });
  res.json({
    cachedCount: Object.values(status).filter(Boolean).length,
    totalCount: YOGA_SEQUENCE.length,
    status,
    quotaExceeded: Date.now() < cloudTtsBypassedUntil,
    cooldownRemaining: Math.max(0, Math.round((cloudTtsBypassedUntil - Date.now()) / 1000))
  });
});

// API: Trigger background pre-generation of all step voice audios
app.post("/api/cache-warmup", async (req, res) => {
  res.json({ message: "Inizio preriscaldamento della cache in background." });
  
  const customApiKey = (req.headers["x-gemini-api-key"] as string) || (req.query.apiKey as string | undefined);
  
  // Warm up in background so response is non-blocking
  (async () => {
    console.log("[TTS Cache] Starting background cache warmup...");
    for (const step of YOGA_SEQUENCE) {
      // If we are currently rate-limited and NOT using a custom API key, wait until the cooldown expires
      if (!customApiKey) {
        while (Date.now() < cloudTtsBypassedUntil) {
          const waitTime = Math.max(1000, cloudTtsBypassedUntil - Date.now());
          console.log(`[TTS Cache] Rate limit cooldown active. Waiting ${Math.round(waitTime / 1000)}s before trying step: ${step.id}`);
          await new Promise(r => setTimeout(r, waitTime));
        }
      }
      
      try {
        await getStepAudioPCM(step.id, step.speechScript, false, customApiKey);
        // Wait 21 seconds (3 RPM) to perfectly respect the free-tier rate limits for both personal and shared keys
        const delay = 21000;
        await new Promise(r => setTimeout(r, delay));
      } catch (err) {
        console.log(`[TTS Cache] Soft bypass for ${step.id}:`, err);
      }
    }
    console.log("[TTS Cache] Warmup process settled. Total cached files:", fs.readdirSync(CACHE_DIR).length);
  })();
});

// API: Play a single step audio
app.get("/api/audio/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    const step = YOGA_SEQUENCE.find(s => s.id === stepId);
    if (!step) {
      res.status(404).json({ error: "Asana non trovata." });
      return;
    }
    
    const customApiKey = (req.headers["x-gemini-api-key"] as string) || (req.query.apiKey as string | undefined);
    
    // Pass true for allowThrow so that we don't swallow quota/rate errors
    const pcmBuffer = await getStepAudioPCM(step.id, step.speechScript, true, customApiKey);
    const wavHeader = createWavHeader(pcmBuffer.length);
    const wavFile = Buffer.concat([wavHeader, pcmBuffer]);
    
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", wavFile.length);
    res.send(wavFile);
  } catch (err: any) {
    const isRateLimit = err?.message?.includes("429") || err?.message?.includes("quota") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("LocalFallbackActive") || err?.message?.includes("CustomApiKeyQuotaExceeded");
    if (isRateLimit) {
      console.log(`[TTS] Cloud limit active for step ${req.params.stepId}. Utilizing local browser speech voice.`);
    } else {
      console.log(`[TTS] Action deferred for step ${req.params.stepId}`);
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
    
    const totalDurationSec = durationMin * 60;
    
    const customApiKey = (req.headers["x-gemini-api-key"] as string) || (req.query.apiKey as string | undefined);
    console.log(`[TTS Download] Generating combined audio of ${durationMin} minutes${customApiKey ? " with custom API key" : ""}...`);
    
    // Try to trigger background cache warming for any missing steps asynchronously (completely non-blocking)
    (async () => {
      for (const step of YOGA_SEQUENCE) {
        const cachePath = path.join(CACHE_DIR, `${step.id}.pcm`);
        if (!fs.existsSync(cachePath)) {
          if (!customApiKey && Date.now() < cloudTtsBypassedUntil) continue; // Skip to avoid hammering while in cooldown
          try {
            await getStepAudioPCM(step.id, step.speechScript, false, customApiKey);
            // Wait 21 seconds (3 RPM) to perfectly respect the free-tier rate limits for both personal and shared keys
            const delay = 21000;
            await new Promise(r => setTimeout(r, delay));
          } catch (_) {}
        }
      }
    })();
    
    // 0. Snapshot file sizes right now to ensure absolute consistency between Content-Length calculation and bytes streamed
    const snapshottedOriginalLengths: Record<string, number> = {};
    for (const step of YOGA_SEQUENCE) {
      const cachePath = path.join(CACHE_DIR, `${step.id}.pcm`);
      let originalLength = 240000; // default 5 seconds silence at 24000Hz (16-bit Mono)
      if (fs.existsSync(cachePath)) {
        try {
          originalLength = fs.statSync(cachePath).size;
        } catch (_) {}
      }
      snapshottedOriginalLengths[step.id] = originalLength;
    }
    
    // 1. Calculate PCM lengths for each step based on snapshot
    let totalSpeechBytes = 0;
    const snapshottedDownsampledLengths: Record<string, number> = {};
    for (const step of YOGA_SEQUENCE) {
      const originalLength = snapshottedOriginalLengths[step.id];
      const numSamples = Math.floor(originalLength / 2);
      const newNumSamples = Math.floor(numSamples / 2);
      const downsampledLength = newNumSamples * 2;
      
      snapshottedDownsampledLengths[step.id] = downsampledLength;
      totalSpeechBytes += downsampledLength;
    }
    
    const totalSpeechSec = totalSpeechBytes / (12000 * 2);
    
    // 2. Distribute remaining time as pauses
    const numPauses = YOGA_SEQUENCE.length - 1;
    let pauseSec = (totalDurationSec - totalSpeechSec) / numPauses;
    if (pauseSec < 2) {
      pauseSec = 2; // Hard floor of 2 seconds
    }
    
    console.log(`[TTS Download] Calculated pause: ${pauseSec.toFixed(1)} seconds between steps.`);
    
    const pauseBytesSize = Math.floor(pauseSec * 12000) * 2;
    const totalSilenceBytes = numPauses * pauseBytesSize;
    
    const totalDataSize = totalSpeechBytes + totalSilenceBytes;
    const wavHeader = createWavHeader(totalDataSize, 12000);
    
    // 3. Set response headers for direct stream download with anti-buffering & no-cache
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", `attachment; filename="sequenza_yoga_hatha_${durationMin}min.wav"`);
    res.setHeader("Content-Length", totalDataSize + 44);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    
    // Write WAV header immediately to prevent any client-side or gateway timeouts
    res.write(wavHeader);
    
    // 4. Pre-allocate silence buffer once to reuse
    const silenceBuffer = Buffer.alloc(pauseBytesSize);
    
    // 5. Stream each step sequential chunk by chunk
    for (let i = 0; i < YOGA_SEQUENCE.length; i++) {
      const step = YOGA_SEQUENCE[i];
      const cachePath = path.join(CACHE_DIR, `${step.id}.pcm`);
      const targetOriginalLength = snapshottedOriginalLengths[step.id];
      let pcm: Buffer;
      
      if (targetOriginalLength !== 240000) {
        try {
          const fileBuf = fs.readFileSync(cachePath);
          if (fileBuf.length === targetOriginalLength) {
            pcm = fileBuf;
          } else if (fileBuf.length > targetOriginalLength) {
            pcm = fileBuf.subarray(0, targetOriginalLength);
          } else {
            pcm = Buffer.concat([fileBuf, Buffer.alloc(targetOriginalLength - fileBuf.length)]);
          }
        } catch (_) {
          pcm = Buffer.alloc(targetOriginalLength);
        }
      } else {
        pcm = Buffer.alloc(240000);
      }
      
      const downsampled = downsamplePCM2x(pcm);
      
      let finalDownsampled = downsampled;
      const targetDownsampledLength = snapshottedDownsampledLengths[step.id];
      if (downsampled.length !== targetDownsampledLength) {
        if (downsampled.length > targetDownsampledLength) {
          finalDownsampled = downsampled.subarray(0, targetDownsampledLength);
        } else {
          finalDownsampled = Buffer.concat([downsampled, Buffer.alloc(targetDownsampledLength - downsampled.length)]);
        }
      }
      
      res.write(finalDownsampled);
      
      if (i < YOGA_SEQUENCE.length - 1) {
        res.write(silenceBuffer);
      }
    }
    
    res.end();
    console.log(`[TTS Download] Audio stream of ${durationMin} minutes completed successfully.`);
  } catch (err: any) {
    console.error("[TTS Download] Combined session audio generation failed:", err);
    // Only send status if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ error: "Impossibile scaricare l'audio. Riprova più tardi." });
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
