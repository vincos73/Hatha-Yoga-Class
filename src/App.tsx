import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flower2,
  Key,
  ArrowLeft,
} from "lucide-react";
import { YOGA_SEQUENCE, YogaStep, getSequenceForDuration } from "./data/yogaSequence";
import { playSingingBowlChime } from "./utils";
import { BUILD_NUMBER } from "./buildNumber";
import { getCategoryTheme } from "./theme";
import { SettingsPanel } from "./components/SettingsPanel";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { BuilderScreen } from "./components/BuilderScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { CompletedScreen } from "./components/CompletedScreen";

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "practice" | "completed" | "builder">("welcome");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [duration, setDuration] = useState(15); // Session duration in minutes
  const [isMuted, setIsMuted] = useState(false);
  const [practicePhase, setPracticePhase] = useState<"narration" | "hold" | "uscita">("narration");
  const [currentHoldRemaining, setCurrentHoldRemaining] = useState(10); // Hold is 10 seconds!
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState(15 * 60);

  // Yoga Builder custom states
  const [isPlayingCustom, setIsPlayingCustom] = useState(false);
  const [customSequence, setCustomSequence] = useState<YogaStep[]>([]);
  const [activeTabMode, setActiveTabMode] = useState<"quick" | "builder">("quick");
  const [builderFilter, setBuilderFilter] = useState<"all" | "harvard">("harvard");
  const [isChimeEnabled, setIsChimeEnabled] = useState(true);

  // Saved sequences states
  const [savedSequences, setSavedSequences] = useState<{ name: string; steps: YogaStep[] }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("saved_yoga_sequences") || "[]");
    } catch (_) {
      return [];
    }
  });
  const [newSequenceName, setNewSequenceName] = useState("");

  const saveCurrentSequence = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (customSequence.length === 0) return;
    const updated = [...savedSequences, { name: trimmed, steps: [...customSequence] }];
    setSavedSequences(updated);
    localStorage.setItem("saved_yoga_sequences", JSON.stringify(updated));
    setNewSequenceName("");
  };

  const deleteSavedSequence = (index: number) => {
    const updated = savedSequences.filter((_, idx) => idx !== index);
    setSavedSequences(updated);
    localStorage.setItem("saved_yoga_sequences", JSON.stringify(updated));
  };

  // Yoga Builder helper functions
  const addStepToCustom = (step: YogaStep) => {
    setCustomSequence(prev => [...prev, { ...step }]);
  };

  const removeStepFromCustom = (index: number) => {
    setCustomSequence(prev => prev.filter((_, idx) => idx !== index));
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    setCustomSequence(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveStepDown = (index: number) => {
    setCustomSequence(prev => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  // Compute the id of the opposite-side twin step by swapping the known suffixes
  const getCounterpartStepId = (stepId: string): string | null => {
    if (stepId.endsWith("_sinistro")) return stepId.slice(0, -"_sinistro".length) + "_destro";
    if (stepId.endsWith("_destro")) return stepId.slice(0, -"_destro".length) + "_sinistro";
    if (stepId.endsWith("_sinistra")) return stepId.slice(0, -"_sinistra".length) + "_destra";
    if (stepId.endsWith("_destra")) return stepId.slice(0, -"_destra".length) + "_sinistra";
    return null;
  };

  const toggleStepSide = (index: number) => {
    setCustomSequence(prev => {
      const step = prev[index];
      if (!step.side || step.side === "entrambi") return prev;
      const counterpartId = getCounterpartStepId(step.id);
      if (!counterpartId) return prev;
      const counterpart = YOGA_SEQUENCE.find(s => s.id === counterpartId);
      if (!counterpart) return prev;
      const copy = [...prev];
      copy[index] = { ...counterpart };
      return copy;
    });
  };

  // Cache check status
  const [cacheStatus, setCacheStatus] = useState<{
    cachedCount: number;
    totalCount: number;
    isWarming: boolean;
  }>({
    cachedCount: 0,
    totalCount: YOGA_SEQUENCE.length,
    isWarming: false
  });

  const [activeTab, setActiveTab] = useState<"entrata" | "mantenimento" | "uscita">("entrata");

  // Download states: 'idle' | 'preparing' | 'downloading' | 'completed' | 'error'
  const [downloadState, setDownloadState] = useState<"idle" | "preparing" | "downloading" | "completed" | "error">("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Voice Engine settings: 'ai' | 'system'
  const [voiceEngine, setVoiceEngine] = useState<"ai" | "system">("ai");
  const [hasQuotaError, setHasQuotaError] = useState(false);

  // Custom user Gemini API Key states
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem("custom_gemini_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);

  const saveApiKey = (key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      // Validate the key without consuming TTS quota
      fetch("/api/validate-key", {
        method: "POST",
        headers: { "x-gemini-api-key": trimmed }
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Chiave API non valida.");
          }
          localStorage.setItem("custom_gemini_api_key", trimmed);
          setCustomApiKey(trimmed);
          setHasQuotaError(false);
          setVoiceEngine("ai");
          setKeySaveSuccess(true);
          setTimeout(() => setKeySaveSuccess(false), 3000);
          fetchCacheStatus();
        })
        .catch(err => {
          console.error("API Key save failed:", err);
          localStorage.removeItem("custom_gemini_api_key");
          setCustomApiKey("");
          fetchCacheStatus();
          alert(err.message || "Errore durante la verifica della chiave API. Assicurati che sia corretta.");
        });
    } else {
      localStorage.removeItem("custom_gemini_api_key");
      setCustomApiKey("");
      setKeySaveSuccess(true);
      setTimeout(() => setKeySaveSuccess(false), 3000);
      fetchCacheStatus();
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef(isMuted);
  const isChimeEnabledRef = useRef(isChimeEnabled);
  const autoPlayNextRef = useRef(autoPlayNext);
  isMutedRef.current = isMuted;
  isChimeEnabledRef.current = isChimeEnabled;
  autoPlayNextRef.current = autoPlayNext;
  const italianVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  // Tracks consecutive AI voice failures (fetch/playback) across steps; reset on success.
  // Only a confirmed quota error or repeated consecutive failures should downgrade the whole session.
  const consecutiveAiFailuresRef = useRef(0);

  const activeSequence = isPlayingCustom ? customSequence : getSequenceForDuration(duration, YOGA_SEQUENCE);

  // Custom Builder sequences always hold 10s (as advertised in the builder UI); quick sessions use a fixed 15s hold
  const holdTimeSec = isPlayingCustom ? 10 : 15;

  const currentStep = activeSequence[currentStepIndex] || activeSequence[0] || YOGA_SEQUENCE[0];

  // Safety checks for custom sequence
  const customHasWarmup = customSequence.some(s => s.category === "riscaldamento");
  const customHasBalance = customSequence.some(s => s.category === "equilibrio");
  const customHasBackbend = customSequence.some(s => s.category === "piegamento");

  const customBalanceAlert = customHasBalance && !customHasWarmup;
  const customBackbendAlert = customHasBackbend && !customHasWarmup;

  const customAsymmetricWarnings: string[] = [];
  customSequence.forEach((step, idx) => {
    if (step.side && step.side !== "entrambi") {
      const oppositeSide = step.side === "sinistro" ? "destro" : "sinistro";
      const hasOpposite = customSequence.some((otherStep, oIdx) =>
        oIdx !== idx &&
        otherStep.title === step.title &&
        otherStep.side === oppositeSide
      );
      if (!hasOpposite) {
        const sideLabel = step.side === "sinistro" ? "sinistro" : "destro";
        const label = `${step.asanaName || step.title} (${sideLabel})`;
        if (!customAsymmetricWarnings.includes(label)) {
          customAsymmetricWarnings.push(label);
        }
      }
    }
  });

  const customHasBreathing = customSequence.some(s => s.category === "respirazione");
  const customLongSequenceTip = customSequence.length > 6 && !customHasBreathing;

  // Check cache status when duration changes
  useEffect(() => {
    fetchCacheStatus();
  }, [duration]);

  const fetchCacheStatus = async () => {
    try {
      const res = await fetch(`/api/cache-status?duration=${duration}`);
      if (res.ok) {
        const data = await res.json();
        setCacheStatus(prev => ({
          ...prev,
          cachedCount: data.cachedCount,
          totalCount: data.totalCount
        }));

        const hasCustomKey = !!localStorage.getItem("custom_gemini_api_key");
        const noApiKey = !data.hasServerApiKey && !hasCustomKey;
        if ((data.quotaExceeded || noApiKey) && !hasCustomKey) {
          setHasQuotaError(true);
          setVoiceEngine("system");
        } else {
          setHasQuotaError(false);
          setVoiceEngine("ai");
        }
      }
    } catch (err) {
      console.log("Error checking cache:", err);
    }
  };

  // Shared download flow: run the request, stream the response tracking progress, then trigger the file save
  const performAudioDownload = async (makeRequest: () => Promise<Response>, filename: string) => {
    if (downloadState !== "idle" && downloadState !== "completed" && downloadState !== "error") return;

    setDownloadState("preparing");
    setDownloadProgress(0);

    try {
      const response = await makeRequest();
      if (!response.ok) {
        let errMsg = "Errore durante la generazione dell'audio.";
        try {
          const text = await response.text();
          try {
            const errData = JSON.parse(text);
            if (errData && errData.error) {
              errMsg = errData.error;
            }
          } catch (_) {
            if (text && text.length < 150) {
              errMsg = text;
            }
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const contentLengthHeader = response.headers.get("x-audio-total-bytes") || response.headers.get("content-length");
      const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

      setDownloadState("downloading");

      const reader = response.body?.getReader();
      if (!reader) {
        // Fallback if reader is not supported (unlikely in modern browsers)
        const blob = await response.blob();
        triggerBlobDownload(blob, filename);
        return;
      }

      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          if (totalBytes > 0) {
            const progress = Math.round((receivedBytes / totalBytes) * 100);
            setDownloadProgress(progress);
          }
        }
      }

      // Combine all chunks into a single Blob
      const blob = new Blob(chunks, { type: "audio/wav" });
      triggerBlobDownload(blob, filename);
    } catch (err: any) {
      console.error("Errore durante il download dell'audio:", err);
      setDownloadError(err?.message || "Errore sconosciuto.");
      setDownloadState("error");
      setTimeout(() => {
        setDownloadState("idle");
        setDownloadError(null);
      }, 5000);
    }
  };

  const downloadCombinedAudio = async () => {
    const headers: Record<string, string> = {};
    const storedKey = localStorage.getItem("custom_gemini_api_key");
    if (storedKey) {
      headers["x-gemini-api-key"] = storedKey;
    }

    await performAudioDownload(
      () => fetch(`/api/audio-download?duration=${duration}`, { headers }),
      `sequenza_yoga_hatha_${duration}min.wav`
    );
  };

  const triggerBlobDownload = (blob: Blob, filename = `sequenza_yoga_hatha_${duration}min.wav`) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setDownloadState("completed");
    setDownloadProgress(100);

    // Reset back to idle after 5 seconds
    setTimeout(() => {
      setDownloadState("idle");
      setDownloadProgress(0);
    }, 5000);
  };

  const downloadCustomAudio = async () => {
    if (customSequence.length === 0) return;

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    const storedKey = localStorage.getItem("custom_gemini_api_key");
    if (storedKey) {
      headers["x-gemini-api-key"] = storedKey;
    }

    await performAudioDownload(
      () => fetch("/api/audio-download-custom", {
        method: "POST",
        headers,
        body: JSON.stringify({ steps: customSequence.map(s => ({ id: s.id })) })
      }),
      "sequenza_yoga_personalizzata.wav"
    );
  };

  // Master timer effect for practice hold duration & total session time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        // Decrement total session timer
        setTotalSecondsRemaining(prev => Math.max(0, prev - 1));

        // If we are in the hold phase, decrement the hold timer
        if (practicePhase === "hold") {
          setCurrentHoldRemaining(prev => {
            if (prev <= 1) {
              // Hold phase completed! Transition to uscita
              if (isChimeEnabledRef.current && !isMutedRef.current) {
                playSingingBowlChime(150); // Lower tone to signal transition
              }
              setPracticePhase("uscita");
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, practicePhase, currentStepIndex, autoPlayNext]);

  // Reset practice phase to narration when changing step index
  useEffect(() => {
    setPracticePhase("narration");
    setActiveTab("entrata");
  }, [currentStepIndex]);

  // Load the Italian voice asynchronously (voices list arrives via the voiceschanged event)
  useEffect(() => {
    const pickItalianVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      italianVoiceRef.current = voices.find(v => v.lang.startsWith("it-") || v.lang === "it_IT") || null;
    };
    pickItalianVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickItalianVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickItalianVoice);
  }, []);

  // Synchronize audio / speech synthesis element
  useEffect(() => {
    // 1. Clean up any ongoing playback first
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }

    const scriptParts = currentStep.speechScript.split(" | ");
    const mantenimentoScript = scriptParts[0] || "";
    const uscitaScript = scriptParts[1] || "";

    const handleUscitaEnd = () => {
      if (currentStepIndex < activeSequence.length - 1) {
        if (autoPlayNextRef.current) {
          setCurrentStepIndex(idx => idx + 1);
          setPracticePhase("narration");
        } else {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
        setScreen("completed");
      }
    };

    if (voiceEngine === "system") {
      if (isPlaying) {
        if (practicePhase === "narration") {
          const utterance = new SpeechSynthesisUtterance(mantenimentoScript);
          utterance.lang = "it-IT";

          if (italianVoiceRef.current) {
            utterance.voice = italianVoiceRef.current;
          }
          utterance.rate = 0.85; // Relaxing, slightly slower pace for yoga
          utterance.volume = isMutedRef.current ? 0 : 1;

          utterance.onend = () => {
            setPracticePhase("hold");
            setCurrentHoldRemaining(holdTimeSec);
            if (isChimeEnabledRef.current && !isMutedRef.current) {
              playSingingBowlChime(220); // standard warm chime
            }
          };

          utterance.onerror = (e) => {
            console.error("SpeechSynthesis error:", e);
            setIsPlaying(false);
          };

          window.speechSynthesis.speak(utterance);
        } else if (practicePhase === "uscita") {
          if (uscitaScript.trim()) {
            const utterance = new SpeechSynthesisUtterance(uscitaScript);
            utterance.lang = "it-IT";

            if (italianVoiceRef.current) {
              utterance.voice = italianVoiceRef.current;
            }
            utterance.rate = 0.85;
            utterance.volume = isMutedRef.current ? 0 : 1;

            utterance.onend = () => {
              handleUscitaEnd();
            };

            utterance.onerror = (e) => {
              console.error("SpeechSynthesis error:", e);
              setIsPlaying(false);
            };

            window.speechSynthesis.speak(utterance);
          } else {
            handleUscitaEnd();
          }
        }
      }

      return () => {
        window.speechSynthesis.cancel();
      };
    } else {
      // AI Mode
      let objectUrl: string | null = null;
      let cancelled = false;
      // A single incident can surface through both audio.onerror and the
      // play() rejection — count it at most once per effect run.
      let failureHandled = false;

      // Shared handler for any AI voice failure (fetch error or HTML audio playback error).
      // A confirmed quota error, or two consecutive failures, downgrades the whole session
      // to the system voice. A single isolated glitch just skips this step's AI narration
      // and advances the phase normally (no chime) so the practice doesn't get stuck.
      const handleAiFailure = (err: unknown, isQuota: boolean) => {
        if (cancelled || failureHandled) return;
        failureHandled = true;
        console.warn("AI Voice failed for this step.", err);
        consecutiveAiFailuresRef.current += 1;
        if (isQuota || consecutiveAiFailuresRef.current >= 2) {
          // Confirmed quota exhaustion, or repeated failures: fall back to system voice for the rest of the session
          setHasQuotaError(true);
          setVoiceEngine("system");
        } else {
          // Isolated glitch: don't downgrade the whole session, just skip this step's AI narration.
          // Advance the phase as audio.onended would, but without the chime (no audio actually played).
          if (practicePhase === "narration") {
            setPracticePhase("hold");
            setCurrentHoldRemaining(holdTimeSec);
          } else if (practicePhase === "uscita") {
            handleUscitaEnd();
          }
        }
      };

      if (isPlaying && (practicePhase === "narration" || practicePhase === "uscita")) {
        const storedKey = localStorage.getItem("custom_gemini_api_key");
        const headers: Record<string, string> = {};
        if (storedKey) headers["x-gemini-api-key"] = storedKey;

        fetch(`/api/audio/${currentStep.id}?phase=${practicePhase === "uscita" ? "uscita" : "mantenimento"}`, { headers })
          .then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            if (cancelled) return;

            objectUrl = URL.createObjectURL(blob);
            const audio = new Audio(objectUrl);
            audioRef.current = audio;
            audio.muted = isMutedRef.current;

            audio.onended = () => {
              consecutiveAiFailuresRef.current = 0;
              if (practicePhase === "narration") {
                setPracticePhase("hold");
                setCurrentHoldRemaining(holdTimeSec);
                if (isChimeEnabledRef.current && !isMutedRef.current) {
                  playSingingBowlChime(220); // standard warm chime
                }
              } else if (practicePhase === "uscita") {
                handleUscitaEnd();
              }
            };

            audio.onerror = (e) => {
              // HTML audio playback failure (not a fetch/HTTP error) is never a quota issue.
              handleAiFailure(e, false);
            };

            return audio.play();
          })
          .catch(err => {
            // Stale request cancelled by the effect cleanup: not a failure.
            if (cancelled) return;
            // iOS Safari rejects play() without a recent user gesture (screen
            // lock, auto-advance while idle). That's not a voice failure and
            // must not trigger the quota fallback: pause the practice so the
            // next tap on play — a real gesture — resumes with audio allowed.
            if ((err as DOMException)?.name === "NotAllowedError") {
              setIsPlaying(false);
              return;
            }
            // pause() interrupting an in-flight play() during cleanup: benign.
            if ((err as DOMException)?.name === "AbortError") return;
            // The client sees a 429 HTTP status when the server responds with a quota error.
            handleAiFailure(err, !!(err as Error)?.message?.includes("429"));
          });
      }

      return () => {
        cancelled = true;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        }
      };
    }
  }, [currentStepIndex, voiceEngine, isPlaying, practicePhase]);

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Handle volume mute/unmute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Navigate back to welcome screen
  const exitPractice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setScreen("welcome");
  };

  const theme = getCategoryTheme(currentStep.category);

  // Big CTA: start the quick (duration-based) practice session
  const handleStartQuickPractice = () => {
    setIsPlayingCustom(false);
    setCurrentStepIndex(0);
    setScreen("practice");
    setIsPlaying(true);
    setPracticePhase("narration");
    setTotalSecondsRemaining(duration * 60);

    setCurrentHoldRemaining(15);
  };

  // Big CTA: start the custom (builder) practice session
  const handleStartCustomPractice = () => {
    if (customSequence.length === 0) return;
    setIsPlayingCustom(true);
    setCurrentStepIndex(0);
    setScreen("practice");
    setIsPlaying(true);
    setPracticePhase("narration");

    // Calculate exact seconds
    const speechSec = customSequence.reduce((acc, s) => {
      const wordCount = s.speechScript.split(/\s+/).filter(Boolean).length;
      return acc + Math.max(4, wordCount / 2.2);
    }, 0);
    const totalSec = speechSec + (customSequence.length * 10);
    setTotalSecondsRemaining(Math.round(totalSec));
    setCurrentHoldRemaining(10);
  };

  const handleBackHomeFromCompleted = () => {
    setScreen("welcome");
    setDownloadState("idle");
    setDownloadProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f2] text-[#2d3e35] font-sans flex flex-col justify-between selection:bg-[#7ba691]/20 select-none relative overflow-x-hidden">

      {/* Ambient background blur blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#d1e7dd] rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#e9ecef] rounded-full blur-[120px] opacity-70"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#f8f9fa] rounded-full blur-[80px] opacity-50"></div>
      </div>

      {/* HEADER BAR */}
      <header className="relative z-40 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3" id="app_header_logo">
            <div className="w-10 h-10 rounded-full bg-[#7ba691] flex items-center justify-center text-white shadow-sm shadow-[#7ba691]/20">
              <Flower2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#2d3e35] font-serif">Hata Yoga <span className="font-light opacity-60 italic">by Luemy</span></h1>
              <p className="text-[9px] font-mono uppercase tracking-widest text-[#7ba691] font-bold">Guida per Principianti</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/30 text-[#2d3e35] border border-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7ba691] animate-pulse"></span>
              {cacheStatus.cachedCount === cacheStatus.totalCount ? "Audio Pronti" : `Audio Pronti: ${cacheStatus.cachedCount}/${cacheStatus.totalCount}`}
            </span>

            <button
              onClick={() => setShowSettings(prev => !prev)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-full transition-all border backdrop-blur-xl shadow-sm ${
                customApiKey
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  : "bg-white/40 hover:bg-white/60 text-[#2d3e35] border-white/30"
              }`}
              id="api_key_settings_btn"
              title="Configura chiave API Gemini personale"
            >
              <Key className={`w-3.5 h-3.5 ${customApiKey ? "text-emerald-600" : "text-[#7ba691]"}`} />
              <span>{customApiKey ? "Chiave Collegata" : "Sblocca Limite (API)"}</span>
            </button>

            {screen === "practice" && (
              <button
                onClick={exitPractice}
                className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-white/40 hover:bg-white/60 font-bold py-2 px-4 rounded-full transition-all border border-white/30 backdrop-blur-xl shadow-sm"
                id="quit_practice_btn"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Menu
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SCREEN ROUTER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center relative z-10">

        {/* SETTINGS PANEL (API KEY CONFIGURATION) */}
        <SettingsPanel
          showSettings={showSettings}
          customApiKey={customApiKey}
          keySaveSuccess={keySaveSuccess}
          onClose={() => setShowSettings(false)}
          onChangeKey={(v) => setCustomApiKey(v)}
          onSaveKey={saveApiKey}
        />

        <AnimatePresence mode="wait">

          {screen === "welcome" && (
            <WelcomeScreen
              key="welcome"
              activeTabMode={activeTabMode}
              setActiveTabMode={setActiveTabMode}
              setIsPlayingCustom={setIsPlayingCustom}
              customSequence={customSequence}
              setCustomSequence={setCustomSequence}
              duration={duration}
              setDuration={setDuration}
              activeSequence={activeSequence}
              cacheStatus={cacheStatus}
              onStartQuickPractice={handleStartQuickPractice}
              onOpenBuilder={() => setScreen("builder")}
              downloadState={downloadState}
              downloadProgress={downloadProgress}
              downloadError={downloadError}
              onDownloadAudio={downloadCombinedAudio}
            />
          )}

          {screen === "builder" && (
            <BuilderScreen
              key="builder"
              customSequence={customSequence}
              setCustomSequence={setCustomSequence}
              builderFilter={builderFilter}
              setBuilderFilter={setBuilderFilter}
              savedSequences={savedSequences}
              newSequenceName={newSequenceName}
              setNewSequenceName={setNewSequenceName}
              saveCurrentSequence={saveCurrentSequence}
              deleteSavedSequence={deleteSavedSequence}
              addStepToCustom={addStepToCustom}
              removeStepFromCustom={removeStepFromCustom}
              moveStepUp={moveStepUp}
              moveStepDown={moveStepDown}
              toggleStepSide={toggleStepSide}
              getCounterpartStepId={getCounterpartStepId}
              downloadState={downloadState}
              downloadProgress={downloadProgress}
              downloadError={downloadError}
              downloadCustomAudio={downloadCustomAudio}
              onBack={() => setScreen("welcome")}
              onStartCustomPractice={handleStartCustomPractice}
              setIsPlayingCustom={setIsPlayingCustom}
              customBalanceAlert={customBalanceAlert}
              customBackbendAlert={customBackbendAlert}
              customAsymmetricWarnings={customAsymmetricWarnings}
              customLongSequenceTip={customLongSequenceTip}
            />
          )}

          {screen === "practice" && (
            <PracticeScreen
              key="practice"
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              activeSequence={activeSequence}
              practicePhase={practicePhase}
              currentHoldRemaining={currentHoldRemaining}
              totalSecondsRemaining={totalSecondsRemaining}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              isMuted={isMuted}
              toggleMute={toggleMute}
              isChimeEnabled={isChimeEnabled}
              setIsChimeEnabled={setIsChimeEnabled}
              autoPlayNext={autoPlayNext}
              setAutoPlayNext={setAutoPlayNext}
              voiceEngine={voiceEngine}
              setVoiceEngine={setVoiceEngine}
              hasQuotaError={hasQuotaError}
              setHasQuotaError={setHasQuotaError}
              theme={theme}
            />
          )}

          {screen === "completed" && (
            <CompletedScreen
              key="completed"
              duration={duration}
              activeSequence={activeSequence}
              downloadState={downloadState}
              downloadProgress={downloadProgress}
              downloadError={downloadError}
              downloadCombinedAudio={downloadCombinedAudio}
              onBackHome={handleBackHomeFromCompleted}
            />
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/20 bg-white/5 backdrop-blur-md py-6 text-center text-xs text-[#2d3e35]/65">
        <p className="text-[10px] text-[#2d3e35]/50 max-w-3xl mx-auto px-4 leading-relaxed">Questa applicazione ha scopo puramente informativo e non sostituisce il parere di un medico o di un insegnante qualificato. Consulta un medico prima di iniziare qualsiasi programma di esercizio fisico, soprattutto in caso di infortuni, gravidanza o condizioni preesistenti. Interrompi immediatamente la pratica se avverti dolore.</p>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 Hata Yoga by Luemy. Tutti i diritti riservati. <span className="opacity-60">· Build #{BUILD_NUMBER}</span></p>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-[#2d3e35] transition-colors cursor-pointer">Respirazione Consapevole</span>
            <span>•</span>
            <span className="hover:text-[#2d3e35] transition-colors cursor-pointer">Hata Yoga</span>
            <span>•</span>
            <span className="hover:text-[#2d3e35] transition-colors cursor-pointer">Meditazione</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
