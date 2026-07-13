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
  Key
} from "lucide-react";
import { YOGA_SEQUENCE, YogaStep } from "./data/yogaSequence";

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "practice">("welcome");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [duration, setDuration] = useState(15); // Session duration in minutes
  const [isMuted, setIsMuted] = useState(false);
  
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

  // Breathing Coach states
  const [breathPhase, setBreathPhase] = useState<"inspira" | "espira" | "trattieni_pieno" | "trattieni_vuoto">("inspira");
  const [breathCount, setBreathCount] = useState(4);
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
      localStorage.setItem("custom_gemini_api_key", trimmed);
      setCustomApiKey(trimmed);
      setHasQuotaError(false);
      setVoiceEngine("ai");
      setKeySaveSuccess(true);
      setTimeout(() => setKeySaveSuccess(false), 3000);
      
      // Warm up cache immediately with the new key!
      const url = `/api/cache-warmup?apiKey=${encodeURIComponent(trimmed)}`;
      fetch(url, { 
        method: "POST", 
        headers: { "x-gemini-api-key": trimmed } 
      })
        .then(() => console.log("Cache warmup started with custom key..."))
        .catch(err => console.log("Warmup error with custom key:", err));
        
      fetchCacheStatus();
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

  const currentStep = YOGA_SEQUENCE[currentStepIndex];

  // Check cache status on mount
  useEffect(() => {
    fetchCacheStatus();
    
    // Warmup cache silently in the background
    const headers: Record<string, string> = {};
    const storedKey = localStorage.getItem("custom_gemini_api_key");
    if (storedKey) {
      headers["x-gemini-api-key"] = storedKey;
    }
    const url = storedKey 
      ? `/api/cache-warmup?apiKey=${encodeURIComponent(storedKey)}` 
      : "/api/cache-warmup";
    fetch(url, { method: "POST", headers })
      .then(() => console.log("Cache warmup started..."))
      .catch(err => console.log("Silent warmup error:", err));
  }, []);

  const fetchCacheStatus = async () => {
    try {
      const res = await fetch("/api/cache-status");
      if (res.ok) {
        const data = await res.json();
        setCacheStatus(prev => ({
          ...prev,
          cachedCount: data.cachedCount,
          totalCount: data.totalCount
        }));
        
        const hasCustomKey = !!localStorage.getItem("custom_gemini_api_key");
        if (data.quotaExceeded && !hasCustomKey) {
          setHasQuotaError(true);
          setVoiceEngine("system");
        } else {
          setHasQuotaError(false);
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
      const url = storedKey 
        ? `/api/cache-warmup?apiKey=${encodeURIComponent(storedKey)}` 
        : "/api/cache-warmup";
      
      await fetch(url, { method: "POST", headers });
      
      // Poll cache status every 2 seconds to show real progress
      const interval = setInterval(async () => {
        const res = await fetch("/api/cache-status");
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

  const downloadCombinedAudio = async () => {
    if (downloadState !== "idle" && downloadState !== "completed" && downloadState !== "error") return;
    
    setDownloadState("preparing");
    setDownloadProgress(0);
    
    try {
      const headers: Record<string, string> = {};
      const storedKey = localStorage.getItem("custom_gemini_api_key");
      if (storedKey) {
        headers["x-gemini-api-key"] = storedKey;
      }
      const url = storedKey 
        ? `/api/audio-download?duration=${duration}&apiKey=${encodeURIComponent(storedKey)}` 
        : `/api/audio-download?duration=${duration}`;
      
      const response = await fetch(url, { headers });
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
      
      const contentLengthHeader = response.headers.get("content-length");
      const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
      
      setDownloadState("downloading");
      
      const reader = response.body?.getReader();
      if (!reader) {
        // Fallback if reader is not supported (unlikely in modern browsers)
        const blob = await response.blob();
        triggerBlobDownload(blob);
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
      triggerBlobDownload(blob);
      setDownloadState("completed");
      setTimeout(() => setDownloadState("idle"), 5000);
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

  const triggerBlobDownload = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sequenza_yoga_hatha_${duration}min.wav`;
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

  // Synchronize audio / speech synthesis element
  useEffect(() => {
    // 1. Clean up any ongoing playback first
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }

    if (voiceEngine === "system") {
      if (isPlaying) {
        const utterance = new SpeechSynthesisUtterance(currentStep.speechScript);
        utterance.lang = "it-IT";
        
        // Select an Italian voice if available
        const voices = window.speechSynthesis.getVoices();
        const itVoice = voices.find(v => v.lang.startsWith("it-") || v.lang === "it_IT");
        if (itVoice) {
          utterance.voice = itVoice;
        }
        utterance.rate = 0.85; // Relaxing, slightly slower pace for yoga
        utterance.volume = isMuted ? 0 : 1;

        utterance.onend = () => {
          if (autoPlayNext && currentStepIndex < YOGA_SEQUENCE.length - 1) {
            setTimeout(() => {
              setCurrentStepIndex(prev => prev + 1);
              setIsPlaying(true);
            }, 1500); // Gentle transition pause
          } else {
            setIsPlaying(false);
          }
        };

        utterance.onerror = (e) => {
          console.error("SpeechSynthesis error:", e);
          setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
      }

      // Reset tab to "entrata" whenever changing steps
      setActiveTab("entrata");

      return () => {
        window.speechSynthesis.cancel();
      };
    } else {
      // AI Mode
      const storedKey = localStorage.getItem("custom_gemini_api_key");
      const audioUrl = `/api/audio/${currentStep.id}${storedKey ? `?apiKey=${encodeURIComponent(storedKey)}` : ""}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.muted = isMuted;

      audio.onended = () => {
        if (autoPlayNext && currentStepIndex < YOGA_SEQUENCE.length - 1) {
          setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
            setIsPlaying(true);
          }, 1500); // Gentle transition pause
        } else {
          setIsPlaying(false);
        }
      };

      audio.onerror = (e) => {
        console.warn("AI Voice failed or quota exceeded. Automatically falling back to browser system voice.", e);
        setHasQuotaError(true);
        setVoiceEngine("system");
      };

      if (isPlaying) {
        audio.play().catch(err => {
          console.warn("Playback prevented or error:", err);
          // Auto-fallback if blocked or if source fails (e.g., quota 429)
          setHasQuotaError(true);
          setVoiceEngine("system");
        });
      }

      // Reset tab to "entrata" whenever changing steps
      setActiveTab("entrata");

      return () => {
        audio.pause();
        audio.onended = null;
        audio.onerror = null;
      };
    }
  }, [currentStepIndex, voiceEngine, isPlaying, isMuted]);

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

    const isPranayama = currentStep.category === "respirazione";

    breathingTimerRef.current = setInterval(() => {
      setBreathCount(prev => {
        if (prev === 1) {
          // Switch phase
          setBreathPhase(currentPhase => {
            if (isPranayama) {
              // 4-phase Sama Vritti (Square breath): Inspira -> Trattieni Pieno -> Espira -> Trattieni Vuoto
              switch (currentPhase) {
                case "inspira": return "trattieni_pieno";
                case "trattieni_pieno": return "espira";
                case "espira": return "trattieni_vuoto";
                case "trattieni_vuoto": return "inspira";
                default: return "inspira";
              }
            } else {
              // Standard 2-phase: Inspira -> Espira
              return currentPhase === "inspira" ? "espira" : "inspira";
            }
          });
          return 4; // Reset to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current);
      }
    };
  }, [currentStepIndex]);

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
              <h1 className="text-lg font-bold tracking-tight text-[#2d3e35] font-serif">Hatha Yoga <span className="font-light opacity-60 italic">Essenza</span></h1>
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
                    Hatha Yoga Tradizionale per Tutti
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-[#1a2b23] tracking-tight leading-tight italic font-medium">
                    Ritrova l'equilibrio con la tua prima sequenza.
                  </h2>
                  <p className="text-[#2d3e35]/80 leading-relaxed text-sm md:text-base">
                    Una pratica guidata di Hatha Yoga strutturata scientificamente per principianti. 
                    Migliora la flessibilità, calma la mente e impara a fluire con il tuo respiro, 
                    accompagnato dalla voce calda e rassicurante della nostra guida.
                  </p>
                </div>

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

                  <div className="grid grid-cols-5 gap-2" id="duration_selector">
                    {[10, 15, 20, 30, 45].map((mins) => (
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
                  <p className="text-[11px] text-[#2d3e35]/60 leading-relaxed">
                    * La durata regola la lunghezza delle pause silenziose tra ogni asana, adattando il ritmo della tenuta al tempo selezionato.
                  </p>
                </div>

                {/* Primary CTA Block */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setCurrentStepIndex(0);
                      setScreen("practice");
                      setIsPlaying(true);
                    }}
                    className="flex-1 bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md shadow-[#2d3e35]/15 hover:shadow-lg flex items-center justify-center gap-2 text-base"
                    id="start_practice_btn"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Inizia la Pratica Online
                  </button>

                  <button
                    onClick={downloadCombinedAudio}
                    disabled={downloadState !== "idle" && downloadState !== "completed" && downloadState !== "error"}
                    className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/50 hover:bg-white/60 text-[#2d3e35] font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-base shadow-sm disabled:opacity-80 disabled:cursor-not-allowed"
                    id="download_mp3_btn"
                  >
                    {/* Progress indicator background overlay */}
                    {downloadState === "downloading" && (
                      <div 
                        className="absolute inset-y-0 left-0 bg-[#7ba691]/20 transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-2">
                      {downloadState === "idle" && (
                        <>
                          <Download className="w-5 h-5 text-[#7ba691]" />
                          <span>Scarica l'Intero Audio (WAV)</span>
                        </>
                      )}
                      
                      {downloadState === "preparing" && (
                        <>
                          <Loader2 className="w-5 h-5 text-[#7ba691] animate-spin" />
                          <span>Generazione in corso...</span>
                        </>
                      )}
                      
                      {downloadState === "downloading" && (
                        <>
                          <Loader2 className="w-5 h-5 text-[#7ba691] animate-spin" />
                          <span>Download: {downloadProgress}%</span>
                        </>
                      )}
                      
                      {downloadState === "completed" && (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
                          <span className="text-emerald-800">Pronto! Salvato</span>
                        </>
                      )}
                      
                      {downloadState === "error" && (
                        <>
                          <AlertCircle className="w-5 h-5 text-rose-600" />
                          <span className="text-rose-700">{downloadError || "Riprova più tardi"}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {downloadState === "error" && (
                  <div className="bg-rose-50/60 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 leading-relaxed space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Come risolvere l'errore sui 30 minuti?
                    </p>
                    <p>
                      La generazione in formato WAV di una sessione intera (come quella da 30, 45 o 90 minuti) richiede la sintesi vocale premium di tutte le asana. 
                      Se la chiave API condivisa ha esaurito la quota giornaliera, l'operazione fallisce.
                    </p>
                    <p className="font-semibold">
                      👉 Clicca sul pulsante <strong className="underline cursor-pointer" onClick={() => setShowSettings(true)}>"Sblocca Limite (API)"</strong> in alto a destra e inserisci la tua chiave gratuita personale per risolvere istantaneamente!
                    </p>
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
                      La sintesi vocale avanzata (AI) ha un limite giornaliero di generazione gratuito. Di conseguenza, alcune posizioni useranno dei silenzi meditativi nel file audio scaricabile.
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
                      Tutte le {cacheStatus.totalCount} asana sono state sintetizzate con voce AI ultra-realistica. Puoi scaricare l'audio completo (WAV) o praticare online con la massima qualità!
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Sequence Outline */}
              <div className="lg:col-span-5 bg-white/30 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                  <h3 className="font-bold text-[#1a2b23] font-serif flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#7ba691]" />
                    Struttura della Sequenza
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold bg-white/30 text-[#2d3e35] px-2 py-0.5 rounded border border-white/40">
                    {YOGA_SEQUENCE.length} Passi
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2" id="sequence_list_outline">
                  {YOGA_SEQUENCE.map((step, idx) => {
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
                      breathPhase === "inspira" ? "scale-110" : "scale-90"
                    }`}>
                      <span className="text-[11px] font-bold tracking-widest uppercase font-mono">
                        {breathPhase === "inspira" && "Inspira"}
                        {breathPhase === "espira" && "Espira"}
                        {breathPhase === "trattieni_pieno" && "Trattieni"}
                        {breathPhase === "trattieni_vuoto" && "Trattieni"}
                      </span>
                      <span className="text-3xl font-extrabold font-mono mt-0.5">
                        {breathCount}
                      </span>
                      <span className="text-[9px] opacity-85 mt-0.5"> secondi </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-[#2d3e35]/80 italic px-4">
                      {breathPhase === "inspira" && "Lascia che l'addome si espanda spontaneamente."}
                      {breathPhase === "espira" && "Rilascia le spalle e sgonfia delicatamente la pancia."}
                      {breathPhase === "trattieni_pieno" && "Mantieni la calma a polmoni pieni."}
                      {breathPhase === "trattieni_vuoto" && "Assapora la quiete del vuoto interiore."}
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
                          Passo {currentStepIndex + 1} di {YOGA_SEQUENCE.length}
                        </span>
                        <h3 className="text-xl font-bold text-[#1a2b23] font-serif">
                          Guida all'Esecuzione
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/40 border border-white/50 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#2d3e35]/80 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-[#2d3e35]/50" />
                        Hold: 40s
                      </div>
                    </div>

                    {/* Step Timeline Progress Indicator */}
                    <div className="grid grid-cols-23 gap-1 py-2" id="interactive_timeline">
                      {YOGA_SEQUENCE.map((step, idx) => {
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

                    {/* Description Tabs */}
                    <div className="flex border-b border-white/20 gap-4" id="instruction_tabs">
                      {[
                        { id: "entrata", label: "1. Entrata" },
                        { id: "mantenimento", label: "2. Mantenimento" },
                        { id: "uscita", label: "3. Uscita" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
                            activeTab === tab.id
                              ? "border-[#7ba691] text-[#2d3e35]"
                              : "border-transparent text-[#2d3e35]/40 hover:text-[#2d3e35]/65"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="py-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.15 }}
                          className="text-[#2d3e35]/85 leading-relaxed text-sm min-h-[140px]"
                        >
                          {activeTab === "entrata" && (
                            <p>{currentStep.description.entrata}</p>
                          )}
                          {activeTab === "mantenimento" && (
                            <div className="space-y-3">
                              <p className="font-semibold text-[#1a2b23] bg-white/40 p-4 rounded-xl border border-white/50 shadow-sm italic pl-4 border-l-2 border-l-[#7ba691]">
                                {currentStep.description.mantenimento}
                              </p>
                              <div className="flex gap-2 items-start text-xs text-[#2d3e35]/60 bg-white/20 p-2.5 rounded-lg border border-white/30">
                                <Info className="w-3.5 h-3.5 text-[#2d3e35]/40 shrink-0 mt-0.5" />
                                <span>Concentrati sull'allungamento e mantieni fermo lo sguardo. Respira ad ogni allungamento.</span>
                              </div>
                            </div>
                          )}
                          {activeTab === "uscita" && (
                            <p>{currentStep.description.uscita}</p>
                          )}
                        </motion.div>
                      </AnimatePresence>
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
                        if (currentStepIndex < YOGA_SEQUENCE.length - 1) {
                          setCurrentStepIndex(prev => prev + 1);
                        }
                      }}
                      disabled={currentStepIndex === YOGA_SEQUENCE.length - 1}
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

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/20 bg-white/5 backdrop-blur-md py-6 text-center text-xs text-[#2d3e35]/65">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 Hatha Yoga per Principianti. Tutti i diritti riservati.</p>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-[#2d3e35] transition-colors cursor-pointer">Respirazione Consapevole</span>
            <span>•</span>
            <span className="hover:text-[#2d3e35] transition-colors cursor-pointer">Hatha Yoga</span>
            <span>•</span>
            <span className="hover:text-[#2d3e35] transition-colors cursor-pointer">Meditazione</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
