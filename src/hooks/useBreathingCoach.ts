import { useEffect, useRef, useState } from "react";

export function useBreathingCoach(isPlaying: boolean, isPranayama: boolean, currentStepIndex: number): {
  phase: "inspira" | "espira" | "trattieni_pieno" | "trattieni_vuoto";
  count: number;
} {
  // Breathing Coach state
  const [breath, setBreath] = useState<{
    phase: "inspira" | "espira" | "trattieni_pieno" | "trattieni_vuoto";
    count: number;
  }>({ phase: "inspira", count: 4 });
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing Coach logic: 4-second cycles (inspira / espira) or 4x4 Square for Pranayama
  useEffect(() => {
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }

    if (!isPlaying) return;

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

  return breath;
}
