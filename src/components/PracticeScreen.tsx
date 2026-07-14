import { motion } from "motion/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Clock,
  Info,
  Volume2,
  VolumeX,
  Wind,
  Flower2,
  Laptop,
  Bell,
  BellOff,
  Activity,
} from "lucide-react";
import { YogaStep } from "../data/yogaSequence";
import { CategoryIllustration, CategoryTheme } from "../theme";
import { formatTime } from "../utils";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface PracticeScreenProps {
  key?: string;
  currentStep: YogaStep;
  currentStepIndex: number;
  setCurrentStepIndex: SetState<number>;
  activeSequence: YogaStep[];
  practicePhase: "narration" | "hold" | "uscita";
  currentHoldRemaining: number;
  totalSecondsRemaining: number;
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  isChimeEnabled: boolean;
  setIsChimeEnabled: SetState<boolean>;
  autoPlayNext: boolean;
  setAutoPlayNext: SetState<boolean>;
  voiceEngine: "ai" | "system";
  setVoiceEngine: SetState<"ai" | "system">;
  hasQuotaError: boolean;
  setHasQuotaError: SetState<boolean>;
  breath: {
    phase: "inspira" | "espira" | "trattieni_pieno" | "trattieni_vuoto";
    count: number;
  };
  theme: CategoryTheme;
}

export function PracticeScreen({
  currentStep,
  currentStepIndex,
  setCurrentStepIndex,
  activeSequence,
  practicePhase,
  currentHoldRemaining,
  totalSecondsRemaining,
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  isChimeEnabled,
  setIsChimeEnabled,
  autoPlayNext,
  setAutoPlayNext,
  voiceEngine,
  setVoiceEngine,
  hasQuotaError,
  setHasQuotaError,
  breath,
  theme,
}: PracticeScreenProps) {
  return (
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
            <CategoryIllustration type={theme.illustration} />
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
  );
}
