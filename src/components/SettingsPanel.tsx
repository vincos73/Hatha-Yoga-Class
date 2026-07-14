import { motion, AnimatePresence } from "motion/react";
import { Key, CheckCircle2 } from "lucide-react";

interface SettingsPanelProps {
  showSettings: boolean;
  customApiKey: string;
  keySaveSuccess: boolean;
  onClose: () => void;
  onChangeKey: (v: string) => void;
  onSaveKey: (key: string) => void;
}

export function SettingsPanel({ showSettings, customApiKey, keySaveSuccess, onClose, onChangeKey, onSaveKey }: SettingsPanelProps) {
  return (
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
                onClick={onClose}
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
                <li>Nota: anche le chiavi personali gratuite hanno limiti specifici per i modelli TTS (poche generazioni al minuto e un tetto giornaliero). Gli audio già generati restano in cache, quindi la libreria si completa in più riprese.</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="password"
                  placeholder="Incolla la tua chiave API Gemini (AIzaSy...)"
                  value={customApiKey}
                  onChange={(e) => onChangeKey(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 focus:border-[#7ba691] outline-none rounded-xl py-2.5 px-3.5 text-xs text-[#2d3e35] font-mono transition-all pr-12 placeholder:text-[#2d3e35]/40"
                />
                {customApiKey && (
                  <button
                    onClick={() => onSaveKey("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Cancella
                  </button>
                )}
              </div>
              <button
                onClick={() => onSaveKey(customApiKey)}
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
  );
}
