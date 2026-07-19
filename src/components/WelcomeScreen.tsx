import { motion } from "motion/react";
import {
  Sparkle,
  Layers,
  Clock,
  Play,
  ChevronRight,
  CheckCircle2,
  Flower2,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { YOGA_SEQUENCE, YogaStep } from "../data/yogaSequence";
import { getCategoryTheme } from "../theme";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface WelcomeScreenProps {
  key?: string;
  activeTabMode: "quick" | "builder";
  setActiveTabMode: SetState<"quick" | "builder">;
  setIsPlayingCustom: SetState<boolean>;
  customSequence: YogaStep[];
  setCustomSequence: SetState<YogaStep[]>;
  duration: number;
  setDuration: SetState<number>;
  activeSequence: YogaStep[];
  cacheStatus: {
    cachedCount: number;
    totalCount: number;
    isWarming: boolean;
  };
  onStartQuickPractice: () => void;
  onOpenBuilder: () => void;
  downloadState: "idle" | "preparing" | "downloading" | "completed" | "error";
  downloadProgress: number;
  downloadError: string | null;
  onDownloadAudio: () => void;
}

export function WelcomeScreen({
  activeTabMode,
  setActiveTabMode,
  setIsPlayingCustom,
  customSequence,
  setCustomSequence,
  duration,
  setDuration,
  activeSequence,
  cacheStatus,
  onStartQuickPractice,
  onOpenBuilder,
  downloadState,
  downloadProgress,
  downloadError,
  onDownloadAudio,
}: WelcomeScreenProps) {
  return (
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
                * La durata della sessione seleziona in automatico un set bilanciato di asana (9 passi per 15 min, 17 passi per 30 min, 24 passi per 45 min, dal catalogo completo di 31 asana disponibili nello Yoga Builder) e ne adatta il ritmo di tenuta complessivo.
              </p>
            </div>
            {/* Primary CTA Block */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onStartQuickPractice}
                className="flex-1 bg-[#2d3e35] hover:bg-[#1a2b23] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-md shadow-[#2d3e35]/15 hover:shadow-lg flex items-center justify-center gap-2 text-base"
                id="start_practice_btn"
              >
                <Play className="w-5 h-5 fill-white" />
                Inizia la Pratica Online
              </button>

              <button
                onClick={onDownloadAudio}
                disabled={downloadState !== "idle" && downloadState !== "completed" && downloadState !== "error"}
                className="flex-1 bg-white/40 border border-[#7ba691] hover:bg-white/60 text-[#2d3e35] font-bold py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider"
              >
                {downloadState === "downloading" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#7ba691]" />
                ) : (
                  <Download className="w-4 h-4 text-[#7ba691]" />
                )}
                {downloadState === "downloading" ? `Esportazione: ${downloadProgress}%` : "Scarica Audio Sequenza"}
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

            {downloadState === "error" && (
              <div className="flex items-start gap-2 p-2 bg-rose-50/50 border border-rose-200/50 rounded-xl text-[10px] text-rose-900/90 leading-relaxed font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{downloadError || "Errore durante il download. Riprova."}</span>
              </div>
            )}
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
              onClick={onOpenBuilder}
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

        <p className="text-[10px] text-[#2d3e35]/55 leading-relaxed px-1">⚠️ Questa applicazione ha scopo puramente informativo e non sostituisce il parere di un medico o di un insegnante qualificato. Consulta un medico prima di iniziare qualsiasi programma di esercizio fisico, soprattutto in caso di infortuni, gravidanza o condizioni preesistenti. Interrompi immediatamente la pratica se avverti dolore.</p>
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
              Lo Yoga Builder include e valorizza la rinomata <strong>guida medica di Harvard</strong> per principianti. Costruisci una routine focalizzata su stabilità, flessibilità e scarico in totale sicurezza.
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
  );
}
