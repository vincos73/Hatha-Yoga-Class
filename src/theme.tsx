import { Flower2 } from "lucide-react";

export interface CategoryTheme {
  bg: string;
  badge: string;
  orbColor: string;
  illustration: string;
}

// Category Theme Mapper
export const getCategoryTheme = (category: string): CategoryTheme => {
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

// Render elegant custom SVGs based on yoga category to act as visual representation
export function CategoryIllustration({ type }: { type: string }) {
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
}
