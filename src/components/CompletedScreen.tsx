import { motion } from "motion/react";
import { Flower2, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { YogaStep } from "../data/yogaSequence";

interface CompletedScreenProps {
  key?: string;
  duration: number;
  activeSequence: YogaStep[];
  downloadState: "idle" | "preparing" | "downloading" | "completed" | "error";
  downloadProgress: number;
  downloadError: string | null;
  downloadCombinedAudio: () => Promise<void>;
  onBackHome: () => void;
}

export function CompletedScreen({
  duration,
  activeSequence,
  downloadState,
  downloadProgress,
  downloadError,
  downloadCombinedAudio,
  onBackHome,
}: CompletedScreenProps) {
  return (
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
          onClick={onBackHome}
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
  );
}
