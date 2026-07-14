import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Download, 
  Sparkles, 
  Clock, 
  Heart, 
  Info, 
  Layers, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Activity, 
  Volume2, 
  VolumeX,
  RefreshCw,
  Wind,
  Flower2,
  ChevronRight,
  Sparkle,
  Laptop,
  Key,
  Bell,
  BellOff,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { YOGA_SEQUENCE, YogaStep, getSequenceForDuration } from "./data/yogaSequence";

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const playSingingBowlChime = (pitch = 180) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Non-harmonic overtones for a rich Tibetan singing bowl sound:
    const frequencies = [pitch, pitch * 2, pitch * 2.76, pitch * 3.2, pitch * 5.4];
    const gains = [0.5, 0.25, 0.15, 0.1, 0.05];
    
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.0);
    
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = index % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      if (index > 0) {
        osc.frequency.setValueAtTime(freq + Math.sin(index) * 1.5, ctx.currentTime);
      }
      
      oscGain.gain.setValueAtTime(gains[index], ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0 - index * 0.4);
      
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 5.0);
    });
  } catch (e) {
    console.warn("Could not play singing bowl chime:", e);
  }
};

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

  // Breathing Coach state
  const [breath, setBreath] = useState<{
    phase: "inspira" | "espira" | "trattieni_pieno" | "trattieni_vuoto";
    count: number;
  }>({ phase: "inspira", count: 4 });
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
      // Warm up cache immediately with the new key and verify it!
      fetch("/api/cache-warmup", {
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
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMutedRef = useRef(isMuted);
  const isChimeEnabledRef = useRef(isChimeEnabled);
  const autoPlayNextRef = useRef(autoPlayNext);
  isMutedRef.current = isMuted;
  isChimeEnabledRef.current = isChimeEnabled;
  autoPlayNextRef.current = autoPlayNext;
  const italianVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const activeSequence = isPlayingCustom ? customSequence : getSequenceForDuration(duration, YOGA_SEQUENCE);

  // Estimate total speech duration in seconds
  const totalSpeechSec = activeSequence.reduce((acc, step) => {
    const wordCount = step.speechScript.split(/\s+/).filter(Boolean).length;
    return acc + Math.max(4, wordCount / 2.2);
  }, 0);
  const totalDurationSec = duration * 60;
  const numPauses = Math.max(1, activeSequence.length - 1);
  const calculatedHoldTime = Math.max(5, Math.round((totalDurationSec - totalSpeechSec) / numPauses));
  // Custom Builder sequences always hold 10s (as advertised in the builder UI); quick sessions use the calculated pacing
  const holdTimeSec = isPlayingCustom ? 10 : calculatedHoldTime;

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

  // Check cache status when duration changes (warmup stays manual, see startCacheWarmup)
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

  const startCacheWarmup = async () => {
    setCacheStatus(prev => ({ ...prev, isWarming: true }));
    try {
      const headers: Record<string, string> = {};
      const storedKey = localStorage.getItem("custom_gemini_api_key");
      if (storedKey) {
        headers["x-gemini-api-key"] = storedKey;
      }

      await fetch(`/api/cache-warmup?duration=${duration}`, { method: "POST", headers });
      
      // Poll cache status every 2 seconds to show real progress
      const interval = setInterval(async () => {
        const res = await fetch(`/api/cache-status?duration=${duration}`);
        if (res.ok) {
          const data = await res.json();
          setCacheStatus(prev => ({
            ...prev,
            cachedCount: data.cachedCount
          }));
          
          const hasCustomKey = !!localStorage.getItem("custom_gemini_api_key");
          if (data.quotaExceeded && !hasCustomKey) {
            setHasQuotaError(true);
            setVoiceEngine("system");
          } else {
            setHasQuotaError(false);
          }
          
          if (data.cachedCount === data.totalCount) {
            clearInterval(interval);
            setCacheStatus(prev => ({ ...prev, isWarming: false }));
          }
        }
      }, 2000);
    } catch (err) {
      console.log("Warmup trigger error:", err);
      setCacheStatus(prev => ({ ...prev, isWarming: false }));
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
              console.warn("AI Voice failed or quota exceeded. Automatically falling back to browser system voice.", e);
              setHasQuotaError(true);
              setVoiceEngine("system");
            };

            return audio.play();
          })
          .catch(err => {
            console.warn("Playback prevented or error:", err);
            setHasQuotaError(true);
            setVoiceEngine("system");
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

  // Breathing Coach logic: 4-second cycles (inspira / espira) or 4x4 Square for Pranayama
  useEffect(() => {
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }

    if (!isPlaying) return;

    const isPranayama = currentStep.category === "respirazione";

    // Reset breath state when step changes
    setBreath({ phase: "inspira", count: 4 });

    breathingTimerRef.current = setInterval(() => {
      setBreath(prev => {
        if (prev.count === 1) {
          let nextPhase: typeof prev.phase = "inspira";
          if (isPranayama) {
            // Sama Vritti: Inspira -> Trattieni Pieno -> Espira -> Trattieni Vuoto
            switch (prev.phase) {
              case "inspira": nextPhase = "trattieni_pieno"; break;
              case "trattieni_pieno": nextPhase = "espira"; break;
              case "espira": nextPhase = "trattieni_vuoto"; break;
              case "trattieni_vuoto": nextPhase = "inspira"; break;
            }
          } else {
            // Standard 2-phase: Inspira -> Espira
            nextPhase = prev.phase === "inspira" ? "espira" : "inspira";
          }
          return { phase: nextPhase, count: 4 };
        }
        return { phase: prev.phase, count: prev.count - 1 };
      });
    }, 1000);

    return () => {
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current);
      }
    };
  }, [currentStepIndex, isPlaying]);

  // Navigate back to welcome screen
  const exitPractice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setScreen("welcome");
  };

  // Category Theme Mapper
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "integrazione":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Integrazione", orbColor: "from-[#7ba691] to-[#5b8370]", illustration: "lotus" };
      case "riscaldamento":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Riscaldamento", orbColor: "from-[#8db4a1] to-[#7ba691]", illustration: "wave" };
      case "in piedi":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Posizione in Piedi", orbColor: "from-[#7ba691] to-[#4c6e5c]", illustration: "mountain" };
      case "equilibrio":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Equilibrio", orbColor: "from-[#9ebcae] to-[#7ba691]", illustration: "scale" };
      case "torsione":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Torsione", orbColor: "from-[#7ba691] to-[#608774]", illustration: "spiral" };
      case "piegamento":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Piegamento indietro", orbColor: "from-[#b5cdc0] to-[#7ba691]", illustration: "arch" };
      case "apertura_anche":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Apertura Anche", orbColor: "from-[#7ba691] to-[#517563]", illustration: "butterfly" };
      case "defaticamento":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Defaticamento", orbColor: "from-[#a5c0b1] to-[#7ba691]", illustration: "horizontal_waves" };
      case "rilassamento":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Savasana", orbColor: "from-[#2d3e35] to-[#1a2b23]", illustration: "stars" };
      case "respirazione":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Pranayama", orbColor: "from-[#7ba691] to-[#405c4d]", illustration: "sacred_breath" };
      case "meditazione":
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Meditazione", orbColor: "from-[#86ad99] to-[#2d3e35]", illustration: "mandala" };
      default:
        return { bg: "bg-white/40 border-white/50 text-[#2d3e35]", badge: "Asana", orbColor: "from-[#7ba691] to-[#2d3e35]", illustration: "default" };
    }
  };

  const theme = getCategoryTheme(currentStep.category);

  // Render elegant custom SVGs based on yoga category to act as visual representation
  const renderIllustration = (type: string) => {
    switch (type) {
      case "lotus":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90 animate-pulse">
            <circle cx="50" cy="50" r="40" className="stroke-[#7ba691]/20 fill-none stroke-1" strokeDasharray="4 4" />
            <path d="M50 25 C40 40, 45 60, 50 75 C55 60, 60 40, 50 25 Z" className="fill-[#7ba691]/10 stroke-[#7ba691] stroke-1" />
            <path d="M50 35 C30 45, 35 65, 50 75 C65 65, 70 45, 50 35 Z" className="fill-[#7ba691]/20 stroke-[#7ba691]/80 stroke-1" />
            <path d="M50 45 C20 50, 25 70, 50 75 C75 70, 80 50, 50 45 Z" className="fill-[#7ba691]/30 stroke-[#7ba691]/60 stroke-1" />
            <circle cx="50" cy="72" r="3" className="fill-[#2d3e35]" />
          </svg>
        );
      case "wave":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90">
            <path d="M10 50 Q25 35, 40 50 T70 50 T100 50" className="fill-none stroke-[#7ba691] stroke-2 animate-pulse" />
            <path d="M10 60 Q25 45, 40 60 T70 60 T100 60" className="fill-none stroke-[#7ba691]/60 stroke-1.5" />
            <path d="M10 40 Q25 25, 40 40 T70 40 T100 40" className="fill-none stroke-[#2d3e35]/30 stroke-1" />
            <circle cx="50" cy="50" r="12" className="stroke-[#7ba691]/20 fill-none stroke-1" strokeDasharray="3 3" />
          </svg>
        );
      case "mountain":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90">
            <polygon points="50,15 85,80 15,80" className="fill-[#7ba691]/5 stroke-[#7ba691] stroke-2" />
            <polygon points="50,15 65,80 35,80" className="fill-[#7ba691]/15 stroke-[#7ba691]/80 stroke-1" />
            <polygon points="50,15 55,50 45,50" className="fill-[#2d3e35]/10" />
            <line x1="10" y1="80" x2="90" y2="80" className="stroke-[#2d3e35] stroke-2" />
          </svg>
        );
      case "scale":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90">
            <line x1="50" y1="20" x2="50" y2="80" className="stroke-[#2d3e35] stroke-2" />
            <line x1="20" y1="35" x2="80" y2="35" className="stroke-[#7ba691] stroke-2 animate-spin-slow" style={{ transformOrigin: '50px 35px' }} />
            <circle cx="50" cy="35" r="4" className="fill-[#2d3e35]" />
            <circle cx="20" cy="35" r="8" className="fill-[#7ba691]/10 stroke-[#7ba691]/80 stroke-1" />
            <circle cx="80" cy="35" r="8" className="fill-[#7ba691]/20 stroke-[#7ba691]/80 stroke-1" />
          </svg>
        );
      case "spiral":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90 animate-spin-slow">
            <path d="M50 50 A10 10 0 0 1 60 60 A20 20 0 0 1 40 80 A30 30 0 0 1 10 50 A40 40 0 0 1 50 10 A45 45 0 0 1 95 50" className="fill-none stroke-[#7ba691] stroke-2" />
            <circle cx="50" cy="50" r="3" className="fill-[#2d3e35]" />
          </svg>
        );
      case "arch":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90">
            <path d="M15 80 C15 20, 85 20, 85 80" className="fill-none stroke-[#7ba691] stroke-3" />
            <path d="M25 80 C25 35, 75 35, 75 80" className="fill-none stroke-[#7ba691]/40 stroke-1.5" strokeDasharray="4 4" />
            <circle cx="50" cy="30" r="6" className="fill-[#7ba691]/10 stroke-[#7ba691] stroke-1" />
            <line x1="10" y1="80" x2="90" y2="80" className="stroke-[#2d3e35] stroke-1.5" />
          </svg>
        );
      case "butterfly":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90">
            <path d="M50 50 C30 20, 15 40, 45 70 C48 73, 49 75, 50 75 C51 75, 52 73, 55 70 C85 40, 70 20, 50 50 Z" className="fill-[#7ba691]/5 stroke-[#7ba691] stroke-1.5" />
            <path d="M50 50 C40 30, 25 45, 47 65 C50 62, 50 62, 53 65 C75 45, 60 30, 50 50 Z" className="fill-[#7ba691]/15 stroke-[#7ba691]/80 stroke-1" />
            <line x1="50" y1="30" x2="50" y2="78" className="stroke-[#2d3e35] stroke-2" />
            <circle cx="50" cy="27" r="2" className="fill-[#2d3e35]" />
          </svg>
        );
      case "horizontal_waves":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90">
            <line x1="10" y1="35" x2="90" y2="35" className="stroke-[#7ba691]/20 stroke-1" />
            <line x1="10" y1="50" x2="90" y2="50" className="stroke-[#7ba691] stroke-2 animate-pulse" />
            <line x1="10" y1="65" x2="90" y2="65" className="stroke-[#7ba691]/20 stroke-1" />
            <path d="M25 50 Q50 35, 75 50" className="fill-none stroke-[#2d3e35]/65 stroke-1.5" />
            <circle cx="50" cy="50" r="4" className="fill-[#2d3e35]" />
          </svg>
        );
      case "stars":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#2d3e35] opacity-90">
            <circle cx="50" cy="50" r="35" className="fill-[#2d3e35]/90 stroke-[#7ba691]/60 stroke-2" />
            <circle cx="35" cy="35" r="1.5" className="fill-white animate-pulse" />
            <circle cx="65" cy="40" r="1" className="fill-white animate-pulse" />
            <circle cx="45" cy="65" r="2" className="fill-white" />
            <circle cx="58" cy="60" r="1.5" className="fill-white" />
            <path d="M40 50 L42 45 L47 43 L42 41 L40 36 L38 41 L33 43 L38 45 Z" className="fill-[#7ba691] animate-pulse" />
          </svg>
        );
      case "sacred_breath":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-95">
            <circle cx="50" cy="50" r="30" className="fill-none stroke-[#7ba691] stroke-1.5 animate-breathe" />
            <circle cx="50" cy="50" r="15" className="fill-none stroke-[#7ba691]/60 stroke-1" />
            <circle cx="50" cy="50" r="45" className="fill-none stroke-[#7ba691]/20 stroke-0.5" strokeDasharray="5 5" />
            <path d="M50 5 L50 95 M5 50 L95 50" className="stroke-[#7ba691]/10 stroke-0.5" />
            <circle cx="50" cy="50" r="4" className="fill-[#2d3e35]" />
          </svg>
        );
      case "mandala":
        return (
          <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto text-[#7ba691] opacity-90 animate-spin-slow">
            <circle cx="50" cy="50" r="40" className="fill-none stroke-[#7ba691] stroke-1" />
            <path d="M50 10 A40 40 0 0 0 10 50 A40 40 0 0 0 50 90 A40 40 0 0 0 90 50 A40 40 0 0 0 50 10" className="fill-none stroke-[#7ba691]/80 stroke-1" />
            <path d="M50 20 A30 30 0 0 0 20 50 A30 30 0 0 0 50 80 A30 30 0 0 0 80 50 A30 30 0 0 0 50 20" className="fill-none stroke-[#7ba691]/60 stroke-1" />
            <circle cx="50" cy="50" r="10" className="fill-white/80 stroke-[#7ba691] stroke-1" />
            <circle cx="50" cy="50" r="2" className="fill-[#2d3e35]" />
          </svg>
        );
      default:
        return (
          <div className="w-48 h-48 mx-auto flex items-center justify-center bg-white/20 border border-white/40 rounded-full backdrop-blur-md">
            <Flower2 className="w-20 h-20 text-[#7ba691] animate-pulse" />
          </div>
        );
    }
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
            
            {cacheStatus.cachedCount < cacheStatus.totalCount && (
              <button
                onClick={startCacheWarmup}
                disabled={cacheStatus.isWarming}
                className="inline-flex items-center gap-1.5 text-xs bg-white/40 hover:bg-white/60 text-[#2d3e35] font-semibold py-2 px-4 rounded-full transition-all border border-white/30 backdrop-blur-xl shadow-sm disabled:opacity-50 animate-pulse-subtle"
                id="warmup_cache_btn"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cacheStatus.isWarming ? "animate-spin" : ""}`} />
                {cacheStatus.isWarming ? "Caricamento..." : "Scarica Guida"}
              </button>
            )}

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
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="overflow-hidden bg-white/75 backdrop-blur-lg border border-white/80 rounded-2xl shadow-xl z-20"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#1a2b23] flex items-center gap-2 text-base">
                      <Key className="w-4 h-4 text-[#7ba691]" />
                      Configurazione Chiave API Gemini Personale
                    </h3>
                    <p className="text-xs text-[#2d3e35]/70 leading-relaxed">
                      L'applicazione utilizza di default una chiave condivisa che ha una quota limitata a sole 10 sintesi vocali premium al giorno su tutta la piattaforma. 
                      Per sessioni lunghe (come quella da 30, 45 o 90 minuti) o per evitare errori di quota, puoi collegare la tua chiave API personale gratuita.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-xs text-[#2d3e35]/60 hover:text-rose-700 font-bold bg-white/40 px-2.5 py-1 rounded-lg border border-white/50 transition-all"
                  >
                    Chiudi
                  </button>
                </div>

                <div className="bg-[#7ba691]/10 border border-[#7ba691]/20 p-3.5 rounded-xl text-xs text-[#2d3e35]/90 space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-[#1a2b23]">Come ottenere la tua chiave gratuita:</p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Vai su <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#7ba691] underline font-bold hover:text-[#5a8671]">Google AI Studio</a></li>
                    <li>Accedi con il tuo account Google e clicca su <strong>"Get API key"</strong></li>
                    <li>Crea una nuova chiave (gratuita) e incollala qui sotto</li>
                    <li>Le chiavi personali gratuite supportano fino a <strong>15 richieste al minuto</strong>, sbloccando completamente l'errore dei 30 minuti!</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="password"
                      placeholder="Incolla la tua chiave API Gemini (AIzaSy...)"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      className="w-full bg-white/50 border border-white/60 focus:border-[#7ba691] outline-none rounded-xl py-2.5 px-3.5 text-xs text-[#2d3e35] font-mono transition-all pr-12 placeholder:text-[#2d3e35]/40"
                    />
                    {customApiKey && (
                      <button
                        onClick={() => saveApiKey("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Cancella
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => saveApiKey(customApiKey)}
                    className="bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    {keySaveSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Salvato!
                      </>
                    ) : (
                      "Salva Chiave"
                    )}
                  </button>
                </div>
                
                {keySaveSuccess && (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Chiave salvata correttamente nel browser! Sintesi vocale premium abilitata con limiti di quota personali gratuiti.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* WELCOME SCREEN */}
          {screen === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Title & Info */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1 bg-white/40 border border-white/50 px-3.5 py-1 rounded-full text-xs text-[#2d3e35] font-medium backdrop-blur-md">
                    <Sparkle className="w-3.5 h-3.5 fill-[#7ba691]/20 text-[#7ba691] animate-spin-slow" />
                    Hata Yoga Tradizionale per Tutti
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#1a2b23] tracking-tight leading-tight italic font-medium">
                    Ritrova l'equilibrio con la tua pratica.
                  </h2>
                  <p className="text-[#2d3e35]/80 leading-relaxed text-sm md:text-base">
                    Una guida scientificamente strutturata basata sull'integrazione di corpo e respiro per principianti, ispirata ai principi di sicurezza ed efficacia medica.
                  </p>
                </div>

                {/* Mode Selector Tab Bar */}
                <div className="flex gap-2 p-1 bg-white/30 border border-white/50 rounded-2xl backdrop-blur-md max-w-sm">
                  <button
                    onClick={() => {
                      setActiveTabMode("quick");
                      setIsPlayingCustom(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTabMode === "quick" 
                        ? "bg-[#2d3e35] text-white shadow-md shadow-[#2d3e35]/15" 
                        : "text-[#2d3e35]/80 hover:bg-white/20"
                    }`}
                  >
                    Sessione Rapida
                  </button>
                  <button
                    onClick={() => {
                      setActiveTabMode("builder");
                      setIsPlayingCustom(true);
                      // Initialize custom sequence with a default template if empty
                      if (customSequence.length === 0) {
                        const defaultTemplate = YOGA_SEQUENCE.filter(s => 
                          ["integrazione_sukhasana", "riscaldamento_gatto_mucca", "piedi_tadasana", "rilassamento_savasana"].includes(s.id)
                        );
                        setCustomSequence(defaultTemplate);
                      }
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTabMode === "builder" 
                        ? "bg-[#2d3e35] text-white shadow-md shadow-[#2d3e35]/15" 
                        : "text-[#2d3e35]/80 hover:bg-white/20"
                    }`}
                  >
                    Yoga Builder
                  </button>
                </div>

                {activeTabMode === "quick" ? (
                  <>
                    {/* Duration Picker */}
                    <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[#1a2b23] text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#7ba691]" />
                          Seleziona la Durata della Sessione
                        </h3>
                        <span className="text-xs text-[#2d3e35] font-mono font-bold bg-white/40 px-2.5 py-1 rounded-md border border-white/50">
                          {duration} minuti
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2" id="duration_selector">
                        {[15, 30, 45].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setDuration(mins)}
                            className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all border ${
                              duration === mins
                                ? "bg-[#7ba691] text-white border-[#7ba691] shadow-md shadow-[#7ba691]/20 scale-[1.03]"
                                : "bg-white/20 text-[#2d3e35]/80 border-white/30 hover:bg-white/40"
                            }`}
                          >
                            {mins} min
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#2d3e35]/65 leading-relaxed">
                        * La durata della sessione seleziona in automatico un set bilanciato di asana (9 passi per 15 min, 16 passi per 30 min, tutti i 23 passi per 45 min) e ne adatta il ritmo di tenuta complessivo.
                      </p>
                    </div>
                    {/* Primary CTA Block */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setIsPlayingCustom(false);
                          setCurrentStepIndex(0);
                          setScreen("practice");
                          setIsPlaying(true);
                          setPracticePhase("narration");
                          setTotalSecondsRemaining(duration * 60);

                          // Recompute the hold time inline: holdTimeSec from the current render
                          // may still reflect a stale isPlayingCustom value at click time
                          const seq = getSequenceForDuration(duration, YOGA_SEQUENCE);
                          const speechSec = seq.reduce((acc, s) => {
                            const w = s.speechScript.split(/\s+/).filter(Boolean).length;
                            return acc + Math.max(4, w / 2.2);
                          }, 0);
                          const hold = Math.max(5, Math.round((duration * 60 - speechSec) / Math.max(1, seq.length - 1)));
                          setCurrentHoldRemaining(hold);
                        }}
                        className="flex-1 bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md shadow-[#2d3e35]/15 hover:shadow-lg flex items-center justify-center gap-2 text-base"
                        id="start_practice_btn"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        Inizia la Pratica Online
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-xl space-y-4">
                    <h3 className="font-bold text-[#1a2b23] text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#7ba691]" />
                      Pratica Personalizzata Posa per Posa
                    </h3>
                    <p className="text-xs text-[#2d3e35]/80 leading-relaxed">
                      Con lo <strong>Yoga Builder</strong> puoi trascinare e comporre le tue posizioni preferite, scegliere se eseguirle a destra, a sinistra o da entrambi i lati, visualizzare la durata stimata e verificare che la sequenza rispetti i principi di una pratica bilanciata.
                    </p>
                    <button
                      onClick={() => setScreen("builder")}
                      className="w-full bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      <Layers className="w-4.5 h-4.5" />
                      Apri lo Yoga Builder
                    </button>
                  </div>
                )}

                {/* Status & Quota Explanation Banners */}
                {cacheStatus.cachedCount < cacheStatus.totalCount ? (
                  <div className="bg-amber-50/40 backdrop-blur-md border border-amber-200/60 p-4 rounded-2xl text-[12px] text-amber-900/90 leading-relaxed space-y-2 shadow-sm">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Sintesi Vocale Premium in Preparazione ({cacheStatus.cachedCount}/{cacheStatus.totalCount} asana pronte)
                    </p>
                    <p>
                      La sintesi vocale avanzata (AI) ha un limite giornaliero di generazione gratuito. Di conseguenza, alcune posizioni useranno la voce di sistema del browser per la guida online.
                    </p>
                    <p className="text-amber-950 bg-white/40 p-2.5 rounded-xl border border-white/60">
                      💡 <strong>Consiglio di Pratica</strong>: Avvia la <strong>"Pratica Online"</strong>! Il browser utilizzerà in automatico la propria voce di sistema (gratuita e illimitata) per darti una guida vocale completa al 100% per tutte le asana!
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50/40 backdrop-blur-md border border-emerald-200/60 p-4 rounded-2xl text-[12px] text-emerald-900/90 leading-relaxed space-y-1.5 shadow-sm">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Sintesi Vocale Premium Pronta al 100%!
                    </p>
                    <p>
                      Tutte le {cacheStatus.totalCount} asana sono state sintetizzate con voce AI ultra-realistica. Puoi praticare online con la massima qualità!
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5">
                {activeTabMode === "quick" ? (
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                      <h3 className="font-bold text-[#1a2b23] font-serif flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#7ba691]" />
                        Struttura della Sequenza
                      </h3>
                      <span className="text-[10px] uppercase font-mono font-bold bg-white/30 text-[#2d3e35] px-2 py-0.5 rounded border border-white/40">
                        {activeSequence.length} Passi
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2" id="sequence_list_outline">
                      {activeSequence.map((step, idx) => {
                        const stepTheme = getCategoryTheme(step.category);
                        return (
                          <div 
                            key={step.id} 
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/20 border border-transparent hover:border-white/20 transition-all"
                          >
                            <span className="w-5 h-5 rounded-full bg-white/40 text-[#2d3e35] border border-white/40 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 shadow-sm">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#1a2b23] truncate">
                                {step.asanaName || step.title}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] font-medium text-[#2d3e35]/65">
                                  {stepTheme.badge}
                                </span>
                                {step.side && step.side !== "entrambi" && (
                                  <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-white/30 border border-white/30 text-[#2d3e35]/70 rounded font-mono">
                                    {step.side}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-[#2d3e35]/40 mt-1" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-white/20 pb-3">
                      <Flower2 className="w-5 h-5 text-[#7ba691]" />
                      <h3 className="font-bold text-[#1a2b23] font-serif">Harvard Medical School Guide</h3>
                    </div>
                    
                    <p className="text-xs text-[#2d3e35]/85 leading-relaxed">
                      Lo Yoga Builder include e valorizza la rinomata **guida medica di Harvard** per principianti. Costruisci una routine focalizzata su stabilità, flessibilità e scarico in totale sicurezza.
                    </p>

                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-[#1a2b23]/90 flex items-center gap-2.5 bg-emerald-50/45 p-3 rounded-2xl border border-emerald-100/50 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>Sicurezza Scientifica</strong>: Pose sicure, senza sforzi cervicali o articolari estremi.</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#1a2b23]/90 flex items-center gap-2.5 bg-emerald-50/45 p-3 rounded-2xl border border-emerald-100/50 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>Badge Harvard Core</strong>: Individua subito le posizioni raccomandate.</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#1a2b23]/90 flex items-center gap-2.5 bg-emerald-50/45 p-3 rounded-2xl border border-emerald-100/50 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>Equilibrio Totale</strong>: Consiglia Integrazione, Riscaldamento e Rilassamento.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* YOGA BUILDER SCREEN */}
          {screen === "builder" && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* Header block */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl">
                <div className="space-y-1">
                  <button 
                    onClick={() => setScreen("welcome")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d3e35]/80 hover:text-[#1a2b23] transition-colors mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Torna alla Home
                  </button>
                  <h2 className="text-2xl font-bold font-serif text-[#1a2b23] flex items-center gap-2">
                    <Layers className="w-6 h-6 text-[#7ba691]" />
                    Yoga Builder Personalizzato
                  </h2>
                  <p className="text-xs text-[#2d3e35]/80">
                    Componi la tua sequenza posa dopo posa. Catalogo ispirato alla guida della Harvard Medical School.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setCustomSequence([]);
                    }}
                    className="px-4 py-2 border border-rose-200 bg-rose-50/40 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl text-xs font-bold transition-all"
                  >
                    Svuota Lista
                  </button>
                  <button
                    onClick={() => {
                      const defaultTemplate = YOGA_SEQUENCE.filter(s => 
                        ["integrazione_sukhasana", "riscaldamento_gatto_mucca", "piedi_tadasana", "piegamento_cobra", "rilassamento_savasana"].includes(s.id)
                      );
                      setCustomSequence(defaultTemplate);
                    }}
                    className="px-4 py-2 border border-[#7ba691]/40 bg-white/30 text-[#2d3e35] hover:bg-white/50 rounded-xl text-xs font-bold transition-all"
                  >
                    Carica Esempio Harvard
                  </button>
                </div>
              </div>

              {/* Grid workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: available poses list & saved sequences */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  {/* Available poses card */}
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/20 pb-3">
                      <h3 className="font-bold text-[#1a2b23] font-serif flex items-center gap-2 text-sm">
                        <Flower2 className="w-4 h-4 text-[#7ba691]" />
                        Seleziona Posizioni
                      </h3>
                      
                      {/* Category Filter */}
                      <div className="flex gap-1.5 p-1 bg-white/40 border border-white/50 rounded-xl">
                        <button
                          onClick={() => setBuilderFilter("harvard")}
                          className={`py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            builderFilter === "harvard" 
                              ? "bg-[#2d3e35] text-white" 
                              : "text-[#2d3e35]/80 hover:bg-white/20"
                          }`}
                        >
                          Harvard Core
                        </button>
                        <button
                          onClick={() => setBuilderFilter("all")}
                          className={`py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            builderFilter === "all" 
                              ? "bg-[#2d3e35] text-white" 
                              : "text-[#2d3e35]/80 hover:bg-white/20"
                          }`}
                        >
                          Tutte ({YOGA_SEQUENCE.length})
                        </button>
                      </div>
                    </div>

                    {/* Scrollable catalogue */}
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {YOGA_SEQUENCE.filter(s => builderFilter === "all" || s.isHarvardCore).map((step) => {
                        const stepTheme = getCategoryTheme(step.category);
                        return (
                          <div 
                            key={step.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/25 border border-white/30 hover:bg-white/40 transition-all shadow-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[#1a2b23] truncate">
                                  {step.asanaName || step.title}
                                </h4>
                                {step.isHarvardCore && (
                                  <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded font-mono shrink-0">
                                    Harvard Core
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[9px] font-medium text-[#2d3e35]/65">
                                  {stepTheme.badge}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => addStepToCustom(step)}
                              className="p-1.5 bg-[#2d3e35] hover:bg-[#1a2b23] text-white rounded-xl transition-all shadow-sm hover:scale-[1.05]"
                              title="Aggiungi alla sequenza"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Saved Sequences Card */}
                  {savedSequences.length > 0 && (
                    <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                      <h3 className="font-bold text-[#1a2b23] font-serif flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-[#7ba691]" />
                        Le Mie Sequenze Salvate
                      </h3>
                      
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {savedSequences.map((seq, idx) => (
                          <div 
                            key={`saved_${idx}`}
                            className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/20 border border-white/30 hover:bg-white/35 transition-all shadow-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#1a2b23] truncate">
                                {seq.name}
                              </h4>
                              <p className="text-[10px] text-[#2d3e35]/65 mt-0.5">
                                {seq.steps.length} posizioni • ~{Math.round(seq.steps.length * 1.5)} min
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setCustomSequence([...seq.steps]);
                                  setIsPlayingCustom(true);
                                }}
                                className="px-2.5 py-1.5 bg-[#2d3e35] hover:bg-[#1a2b23] text-white rounded-lg text-[10px] font-bold transition-all shadow-sm"
                              >
                                Carica
                              </button>
                              <button
                                onClick={() => deleteSavedSequence(idx)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-lg transition-colors"
                                title="Elimina sequenza"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: custom sequence timeline */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  
                  {/* Selected list panel */}
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                      <h3 className="font-bold text-[#1a2b23] font-serif flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-[#7ba691]" />
                        La Tua Sequenza
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-[#2d3e35] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                        {customSequence.length} Asana
                      </span>
                    </div>

                    {customSequence.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/40 rounded-2xl space-y-3">
                        <Layers className="w-8 h-8 text-[#2d3e35]/40 animate-pulse" />
                        <p className="text-xs text-[#2d3e35]/70 font-medium max-w-xs">
                          La tua sequenza è ancora vuota. Aggiungi delle posizioni dal catalogo dell'Harvard Core a sinistra per iniziare.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {customSequence.map((step, idx) => {
                          const stepTheme = getCategoryTheme(step.category);
                          const counterpartId = step.side && step.side !== "entrambi" ? getCounterpartStepId(step.id) : null;
                          const hasCounterpart = !!counterpartId && YOGA_SEQUENCE.some(s => s.id === counterpartId);
                          return (
                            <div 
                              key={`${step.id}_index_${idx}`}
                              className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-white/55 shadow-sm transition-all hover:bg-white/50"
                            >
                              {/* Step index */}
                              <span className="w-5 h-5 rounded-full bg-white/60 text-[#2d3e35] border border-white/50 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                {idx + 1}
                              </span>

                              {/* Title & Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#1a2b23] truncate">
                                  {step.asanaName || step.title}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] font-medium text-[#2d3e35]/60">
                                    {stepTheme.badge}
                                  </span>
                                  {step.side && (
                                    hasCounterpart ? (
                                      <button
                                        onClick={() => toggleStepSide(idx)}
                                        className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-white/50 border border-white/60 text-[#2d3e35]/75 hover:bg-[#2d3e35] hover:text-white rounded font-mono transition-all"
                                        title="Clicca per passare al lato opposto"
                                      >
                                        Lato: {step.side}
                                      </button>
                                    ) : (
                                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-white/50 border border-white/60 text-[#2d3e35]/75 rounded font-mono">
                                        Lato: {step.side}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Action controls */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => moveStepUp(idx)}
                                  disabled={idx === 0}
                                  className="p-1 text-[#2d3e35]/70 hover:text-[#1a2b23] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => moveStepDown(idx)}
                                  disabled={idx === customSequence.length - 1}
                                  className="p-1 text-[#2d3e35]/70 hover:text-[#1a2b23] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeStepFromCustom(idx)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 rounded-lg transition-colors ml-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {customSequence.length > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-white/20">
                        <input
                          type="text"
                          placeholder="Salva questa sequenza con un nome..."
                          value={newSequenceName}
                          onChange={(e) => setNewSequenceName(e.target.value)}
                          className="flex-1 bg-white/40 border border-white/50 rounded-xl px-3 py-2 text-xs font-semibold text-[#1a2b23] focus:outline-none focus:border-[#7ba691] placeholder-[#2d3e35]/50"
                        />
                        <button
                          onClick={() => saveCurrentSequence(newSequenceName)}
                          className="bg-[#2d3e35] hover:bg-[#1a2b23] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Salva
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Validation and Action block */}
                  <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b border-white/20 pb-3">
                      <div>
                        <span className="text-[10px] text-[#2d3e35]/65 font-bold uppercase tracking-wider">Durata Stimata</span>
                        <div className="text-lg font-bold text-[#1a2b23] mt-0.5">
                          {Math.round(customSequence.length * 1.5)} Minuti
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#2d3e35]/65 font-bold uppercase tracking-wider">Tempo Tenuta</span>
                        <div className="text-lg font-bold text-[#1a2b23] mt-0.5">
                          10s per posa
                        </div>
                      </div>
                    </div>

                    {/* Flow Validation Checklist */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-[#2d3e35]/65 font-bold uppercase tracking-wider">Analisi Sequenza</span>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#2d3e35]/95">
                          {customSequence.some(s => s.category === "integrazione") ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span>Contiene 1 posizione di integrazione</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#2d3e35]/95">
                          {customSequence.some(s => s.category === "riscaldamento") ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span>Contiene almeno 1 riscaldamento</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#2d3e35]/95">
                          {customSequence.some(s => s.category === "rilassamento") ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span>Termina con rilassamento (Savasana)</span>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Safety Alerts (HMS Inspired) */}
                    {(customBalanceAlert || customBackbendAlert || customAsymmetricWarnings.length > 0 || customLongSequenceTip) && (
                      <div className="space-y-2 pt-2.5 border-t border-white/20">
                        <span className="text-[10px] text-[#2d3e35]/65 font-bold uppercase tracking-wider">Sicurezza e Consigli</span>
                        <div className="space-y-1.5">
                          {customBalanceAlert && (
                            <div className="flex items-start gap-2 p-2 bg-amber-50/50 border border-amber-200/50 rounded-xl text-[10px] text-amber-900/90 leading-relaxed font-semibold">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>⚠️ Pose di equilibrio presenti senza riscaldamento previo. Aggiungi Balasana o Gatto/Mucca prima.</span>
                            </div>
                          )}
                          {customBackbendAlert && (
                            <div className="flex items-start gap-2 p-2 bg-amber-50/50 border border-amber-200/50 rounded-xl text-[10px] text-amber-900/90 leading-relaxed font-semibold">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>⚠️ I piegamenti all'indietro sollecitano la colonna vertebrale. Aggiungi riscaldamenti prima.</span>
                            </div>
                          )}
                          {customAsymmetricWarnings.map((label, wIdx) => (
                            <div key={`asym_${wIdx}`} className="flex items-start gap-2 p-2 bg-amber-50/50 border border-amber-200/50 rounded-xl text-[10px] text-amber-900/90 leading-relaxed font-semibold">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>⚠️ Asimmetria: manca il lato opposto per <strong>{label}</strong>. Per bilanciare, inserisci entrambi i lati.</span>
                            </div>
                          ))}
                          {customLongSequenceTip && (
                            <div className="flex items-start gap-2 p-2 bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-[10px] text-emerald-950/90 leading-relaxed font-semibold">
                              <Sparkle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>💡 Consiglio: La sequenza è lunga, considera di inserire una tecnica di respirazione (es. Sama Vritti).</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => {
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
                        }}
                        disabled={customSequence.length === 0}
                        className="flex-1 bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Avvia Pratica
                      </button>

                      <button
                        onClick={downloadCustomAudio}
                        disabled={customSequence.length === 0 || (downloadState !== "idle" && downloadState !== "completed" && downloadState !== "error")}
                        className="flex-1 bg-white/40 border border-[#7ba691] hover:bg-white/60 text-[#2d3e35] font-bold py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
                      >
                        {downloadState === "downloading" ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#7ba691]" />
                        ) : (
                          <Download className="w-4 h-4 text-[#7ba691]" />
                        )}
                        {downloadState === "downloading" ? `Esportazione: ${downloadProgress}%` : "Scarica Audio"}
                      </button>
                    </div>

                    {downloadState === "downloading" && (
                      <div className="w-full bg-white/40 h-1.5 rounded-full overflow-hidden border border-white/50 shadow-inner">
                        <div 
                          className="bg-[#7ba691] h-full rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* ACTIVE PRACTICE SCREEN */}
          {screen === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              
              {/* Left Column: Visual Guide & Breathing Coach */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                
                {/* Visualizer Frame */}
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl flex flex-col justify-center items-center relative overflow-hidden flex-1 min-h-[320px]">
                  
                  {/* Subtle decorative background circle */}
                  <div className="absolute w-72 h-72 rounded-full bg-[#d1e7dd]/30 blur-[40px] -z-10 translate-y-4"></div>

                  <div className="text-center space-y-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${theme.bg}`}>
                      {theme.badge}
                    </span>
                    <h3 className="text-3xl font-serif mt-2 italic text-[#1a2b23] leading-tight">
                      {currentStep.asanaName || currentStep.title}
                    </h3>
                  </div>

                  {/* Body pose vector or category illustration */}
                  <div className="my-6">
                    {renderIllustration(theme.illustration)}
                  </div>

                  <div className="text-center w-full max-w-xs">
                    <p className="text-xs text-[#2d3e35]/60 font-mono">
                      {currentStep.side && currentStep.side !== "entrambi" ? `Lato: ${currentStep.side}` : "Eseguire al centro o su entrambi i lati"}
                    </p>
                  </div>
                </div>

                {/* Interactive Breathing Coach & Mindfulness Orb */}
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-[#7ba691] animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2d3e35]/60 font-mono">Coach del Respiro</h4>
                  </div>

                  {/* Pulsing Breathing Orb */}
                  <div className="relative flex items-center justify-center w-36 h-36">
                    {/* Pulsing visual rings */}
                    <div className="absolute w-full h-full rounded-full bg-[#7ba691]/15 animate-pulse-ring"></div>
                    <div className="absolute w-4/5 h-4/5 rounded-full bg-[#7ba691]/25 animate-pulse-ring" style={{ animationDelay: '1.5s' }}></div>
                    
                    {/* Center Core Orb */}
                    <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${theme.orbColor} text-white flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ${
                      breath.phase === "inspira" ? "scale-110" : "scale-90"
                    }`}>
                      <span className="text-[11px] font-bold tracking-widest uppercase font-mono">
                        {breath.phase === "inspira" && "Inspira"}
                        {breath.phase === "espira" && "Espira"}
                        {breath.phase === "trattieni_pieno" && "Trattieni"}
                        {breath.phase === "trattieni_vuoto" && "Trattieni"}
                      </span>
                      <span className="text-3xl font-extrabold font-mono mt-0.5">
                        {breath.count}
                      </span>
                      <span className="text-[9px] opacity-85 mt-0.5"> secondi </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-[#2d3e35]/80 italic px-4">
                      {breath.phase === "inspira" && "Lascia che l'addome si espanda spontaneamente."}
                      {breath.phase === "espira" && "Rilascia le spalle e sgonfia delicatamente la pancia."}
                      {breath.phase === "trattieni_pieno" && "Mantieni la calma a polmoni pieni."}
                      {breath.phase === "trattieni_vuoto" && "Assapora la quiete del vuoto interiore."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Step Instructions & Controls */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                
                {/* Instruction Cards with Tabs */}
                <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl flex flex-col justify-between flex-1">
                  
                  {/* Step Navigation Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#2d3e35]/55 font-bold">
                          Passo {currentStepIndex + 1} di {activeSequence.length} • Tempo Rimasto: {formatTime(totalSecondsRemaining)}
                        </span>
                        <h3 className="text-xl font-bold text-[#1a2b23] font-serif">
                          Guida all'Esecuzione
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/40 border border-white/50 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#2d3e35]/80 shadow-sm transition-all duration-300">
                        <Clock className="w-3.5 h-3.5 text-[#7ba691] animate-pulse" />
                        {practicePhase === "narration" && (
                          <span className="text-[#7ba691] animate-pulse">Entrata...</span>
                        )}
                        {practicePhase === "hold" && (
                          <span className="text-[#7ba691] font-bold">Mantenimento: {currentHoldRemaining}s</span>
                        )}
                        {practicePhase === "uscita" && (
                          <span className="text-[#7ba691] animate-pulse">Uscita...</span>
                        )}
                      </div>
                    </div>

                    {/* Step Timeline Progress Indicator */}
                    <div 
                      className="grid gap-1 py-2" 
                      id="interactive_timeline"
                      style={{ gridTemplateColumns: `repeat(${activeSequence.length}, minmax(0, 1fr))` }}
                    >
                      {activeSequence.map((step, idx) => {
                        const isCurrent = idx === currentStepIndex;
                        const isPast = idx < currentStepIndex;
                        return (
                          <button
                            key={step.id}
                            onClick={() => setCurrentStepIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              isCurrent 
                                ? "bg-[#7ba691] w-full" 
                                : isPast 
                                  ? "bg-[#7ba691]/45" 
                                  : "bg-white/20 border border-white/10"
                            }`}
                            title={step.title}
                          />
                        );
                      })}
                    </div>

                    {/* Unified Instruction Panel */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1" id="instruction_panel">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#7ba691]">1. Entrata</span>
                        <p className="text-xs text-[#2d3e35]/85 leading-relaxed bg-white/25 p-3.5 rounded-2xl border border-white/40 shadow-sm">{currentStep.description.entrata}</p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#7ba691]">2. Mantenimento Guidato (40 secondi)</span>
                        <div className="p-4 rounded-2xl border border-white/50 shadow-sm bg-white/45 border-l-4 border-l-[#7ba691]">
                          <p className="text-xs font-semibold text-[#1a2b23] leading-relaxed italic">{currentStep.description.mantenimento}</p>
                          <div className="flex gap-2 items-start text-[10px] text-[#2d3e35]/65 mt-3">
                            <Info className="w-3.5 h-3.5 text-[#2d3e35]/40 shrink-0 mt-0.5" />
                            <span>Concentrati sull'allungamento e mantieni fermo lo sguardo. Respira ad ogni allungamento.</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#7ba691]">3. Uscita</span>
                        <p className="text-xs text-[#2d3e35]/85 leading-relaxed bg-white/25 p-3.5 rounded-2xl border border-white/40 shadow-sm">{currentStep.description.uscita}</p>
                      </div>
                    </div>
                  </div>

                  {/* Teacher script quote box */}
                  <div className="bg-white/45 backdrop-blur-md rounded-2xl p-4 border border-white/60 space-y-2 mt-4 shadow-sm">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7ba691] flex items-center gap-1">
                      <Flower2 className="w-3 h-3" />
                      Voce della Guida
                    </span>
                    <p className="text-xs text-[#2d3e35]/80 leading-relaxed italic pl-3 border-l-2 border-[#7ba691]/40">
                      "{currentStep.speechScript}"
                    </p>
                  </div>
                </div>

                {/* Master Audio Control Center */}
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#7ba691] animate-pulse" />
                      <h4 className="text-xs font-extrabold text-[#2d3e35] uppercase tracking-wider font-mono">Pannello Audio</h4>
                    </div>

                    {/* Auto Play toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-[#2d3e35]/65 font-medium">Autoplay successivo</span>
                      <input 
                        type="checkbox" 
                        checked={autoPlayNext}
                        onChange={(e) => setAutoPlayNext(e.target.checked)}
                        className="accent-[#7ba691] w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Custom Player Controls */}
                  <div className="flex items-center justify-between bg-white/25 px-6 py-4 rounded-2xl border border-white/30">
                    <button
                      onClick={() => {
                        if (currentStepIndex > 0) {
                          setCurrentStepIndex(prev => prev - 1);
                        }
                      }}
                      disabled={currentStepIndex === 0}
                      className="p-2.5 rounded-full hover:bg-white/20 text-[#2d3e35] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      title="Passo Precedente"
                    >
                      <SkipBack className="w-5 h-5 fill-current" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-full bg-[#2d3e35] hover:bg-[#1a2b23] text-white flex items-center justify-center shadow-lg hover:scale-[1.04] transition-all"
                      title={isPlaying ? "Metti in Pausa" : "Riproduci Guida Vocale"}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-white text-white" />
                      ) : (
                        <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (currentStepIndex < activeSequence.length - 1) {
                          setCurrentStepIndex(prev => prev + 1);
                        }
                      }}
                      disabled={currentStepIndex === activeSequence.length - 1}
                      className="p-2.5 rounded-full hover:bg-white/20 text-[#2d3e35] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      title="Passo Successivo"
                    >
                      <SkipForward className="w-5 h-5 fill-current" />
                    </button>

                    {/* Mute button */}
                    <button
                      onClick={toggleMute}
                      className="p-2.5 rounded-full hover:bg-white/20 text-[#2d3e35] transition-colors"
                      title={isMuted ? "Attiva Audio" : "Disattiva Audio"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Chime Toggle Button */}
                    <button
                      onClick={() => setIsChimeEnabled(prev => !prev)}
                      className="p-2.5 rounded-full hover:bg-white/20 text-[#2d3e35] transition-colors"
                      title={isChimeEnabled ? "Disattiva Campana" : "Attiva Campana"}
                    >
                      {isChimeEnabled ? (
                        <Bell className="w-5 h-5 text-[#7ba691]" />
                      ) : (
                        <BellOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Help Tip / Voice Engine Selector */}
                  <div className="flex flex-col items-center gap-2.5 pt-2 border-t border-[#2d3e35]/10">
                    <div className="flex items-center gap-3 text-xs">
                      <button
                        onClick={() => {
                          setVoiceEngine("ai");
                          setHasQuotaError(false);
                        }}
                        className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-bold shadow-sm ${
                          voiceEngine === "ai"
                            ? "bg-[#7ba691] text-white"
                            : "bg-white/30 text-[#2d3e35]/70 hover:bg-white/50"
                        }`}
                        title="Voce Calda ed Espressiva Generata via Cloud AI"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Voce AI (Gemini)</span>
                      </button>
                      
                      <button
                        onClick={() => setVoiceEngine("system")}
                        className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-bold shadow-sm ${
                          voiceEngine === "system"
                            ? "bg-[#2d3e35] text-white"
                            : "bg-white/30 text-[#2d3e35]/70 hover:bg-white/50"
                        }`}
                        title="Sintesi Vocale Locale Offline (Illimitata)"
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Voce di Sistema</span>
                      </button>
                    </div>

                    {hasQuotaError ? (
                      <p className="text-[10px] text-amber-800 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 animate-pulse text-center max-w-sm">
                        ⚠️ Quota AI esaurita per oggi. Passaggio automatico alla Voce di Sistema (gratuita e illimitata).
                      </p>
                    ) : (
                      <p className="text-[10px] text-[#2d3e35]/50 text-center">
                        {voiceEngine === "ai" 
                          ? "Guida vocale ad alta definizione generata tramite l'Intelligenza Artificiale."
                          : "Sintesi vocale locale del browser. Funziona istantaneamente, offline e senza limiti."}
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* SESSION COMPLETED SCREEN */}
          {screen === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl space-y-6 text-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#d1e7dd] flex items-center justify-center text-emerald-800 shadow-inner">
                  <Flower2 className="w-9 h-9 animate-spin-slow" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-[#1a2b23] mt-2">
                  Sessione Completata!
                </h2>
                <p className="text-xs text-[#2d3e35]/80 max-w-xs leading-relaxed">
                  Complimenti per esserti dedicato questo tempo. La tua mente e il tuo corpo ti ringraziano. Namastè.
                </p>
              </div>

              <div className="bg-white/30 border border-white/40 rounded-2xl p-5 space-y-1.5 shadow-sm text-left">
                <div className="flex justify-between text-xs text-[#2d3e35]/70">
                  <span>Pratica Eseguita:</span>
                  <span className="font-bold text-[#1a2b23]">Hata Yoga Sequenza</span>
                </div>
                <div className="flex justify-between text-xs text-[#2d3e35]/70">
                  <span>Durata Totale:</span>
                  <span className="font-bold text-[#1a2b23]">{duration} minuti</span>
                </div>
                <div className="flex justify-between text-xs text-[#2d3e35]/70">
                  <span>Asana Eseguite:</span>
                  <span className="font-bold text-[#1a2b23]">{activeSequence.length} posizioni</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={downloadCombinedAudio}
                  disabled={downloadState !== "idle" && downloadState !== "completed" && downloadState !== "error"}
                  className="relative overflow-hidden w-full bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-base shadow-md disabled:opacity-85 disabled:cursor-not-allowed cursor-pointer"
                >
                  {/* Progress indicator background overlay */}
                  {downloadState === "downloading" && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    {downloadState === "idle" && (
                      <>
                        <Download className="w-5 h-5 text-[#7ba691]" />
                        <span>Scarica l'Audio della Lezione (WAV)</span>
                      </>
                    )}
                    
                    {downloadState === "preparing" && (
                      <>
                        <Loader2 className="w-5 h-5 text-[#7ba691] animate-spin" />
                        <span>Generazione file audio...</span>
                      </>
                    )}
                    
                    {downloadState === "downloading" && (
                      <>
                        <Loader2 className="w-5 h-5 text-[#7ba691] animate-spin" />
                        <span>Esportazione: {downloadProgress}%</span>
                      </>
                    )}
                    
                    {downloadState === "completed" && (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-bounce" />
                        <span className="text-emerald-100">Audio Scaricato con Successo!</span>
                      </>
                    )}
                    
                    {downloadState === "error" && (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-300" />
                        <span className="text-rose-200">{downloadError || "Riprova più tardi"}</span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setScreen("welcome");
                    setDownloadState("idle");
                    setDownloadProgress(0);
                  }}
                  className="w-full bg-white/40 border border-white/50 hover:bg-white/60 text-[#2d3e35] font-bold py-3.5 px-6 rounded-2xl transition-all text-sm shadow-sm cursor-pointer"
                >
                  Torna alla Home
                </button>
              </div>

              {downloadState === "completed" && (
                <p className="text-[10px] text-emerald-800 font-bold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 text-center animate-pulse">
                  Salva il file sul tuo dispositivo per ascoltare l'audio della lezione personalizzato in qualsiasi momento!
                </p>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/20 bg-white/5 backdrop-blur-md py-6 text-center text-xs text-[#2d3e35]/65">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 Hata Yoga by Luemy. Tutti i diritti riservati.</p>
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
