import { motion } from "motion/react";
import {
  ArrowLeft,
  Layers,
  Flower2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Sparkle,
  Play,
  Download,
  Loader2,
} from "lucide-react";
import { YOGA_SEQUENCE, YogaStep } from "../data/yogaSequence";
import { getCategoryTheme } from "../theme";

type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface BuilderScreenProps {
  key?: string;
  customSequence: YogaStep[];
  setCustomSequence: SetState<YogaStep[]>;
  builderFilter: "all" | "harvard";
  setBuilderFilter: SetState<"all" | "harvard">;
  savedSequences: { name: string; steps: YogaStep[] }[];
  newSequenceName: string;
  setNewSequenceName: SetState<string>;
  saveCurrentSequence: (name: string) => void;
  deleteSavedSequence: (index: number) => void;
  addStepToCustom: (step: YogaStep) => void;
  removeStepFromCustom: (index: number) => void;
  moveStepUp: (index: number) => void;
  moveStepDown: (index: number) => void;
  toggleStepSide: (index: number) => void;
  getCounterpartStepId: (stepId: string) => string | null;
  downloadState: "idle" | "preparing" | "downloading" | "completed" | "error";
  downloadProgress: number;
  downloadCustomAudio: () => Promise<void>;
  onBack: () => void;
  onStartCustomPractice: () => void;
  setIsPlayingCustom: SetState<boolean>;
  customBalanceAlert: boolean;
  customBackbendAlert: boolean;
  customAsymmetricWarnings: string[];
  customLongSequenceTip: boolean;
}

export function BuilderScreen({
  customSequence,
  setCustomSequence,
  builderFilter,
  setBuilderFilter,
  savedSequences,
  newSequenceName,
  setNewSequenceName,
  saveCurrentSequence,
  deleteSavedSequence,
  addStepToCustom,
  removeStepFromCustom,
  moveStepUp,
  moveStepDown,
  toggleStepSide,
  getCounterpartStepId,
  downloadState,
  downloadProgress,
  downloadCustomAudio,
  onBack,
  onStartCustomPractice,
  setIsPlayingCustom,
  customBalanceAlert,
  customBackbendAlert,
  customAsymmetricWarnings,
  customLongSequenceTip,
}: BuilderScreenProps) {
  return (
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
            onClick={onBack}
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
                onClick={onStartCustomPractice}
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
  );
}
