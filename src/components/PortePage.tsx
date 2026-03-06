import { Home } from "lucide-react";
import ComelasfogliaFooter from "@/components/ComelasfogliaFooter";
import WhatIsFoleda from "@/components/WhatIsFoleda";
type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

interface PortePageProps {
  onNavigate: (target: AppScreen) => void;
}

const doors = [
  {
    id: "esplora" as AppScreen,
    glyph: "✦",
    title: "Esplora la Piana",
    subtitle: "Otto regioni, sette venti, e qualcosa al centro che nessuno ha mai visto.",
  },
  {
    id: "gioca" as AppScreen,
    glyph: "⚄",
    title: "Gioca un'avventura",
    subtitle: "Due storie ti aspettano. Il personaggio è già lì — devi solo decidere quale porta aprire.",
  },
  {
    id: "scopri" as AppScreen,
    glyph: "❋",
    title: "Scopri chi sei",
    subtitle: "Rispondi alle domande. La Piana deciderà dove appartieni.",
  },
];

const PortePage = ({ onNavigate }: PortePageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 relative">
      {/* Home button */}
      <button
        onClick={() => onNavigate("soglia" as AppScreen)}
        className="absolute top-6 left-6 text-muted-foreground/60 hover:text-foreground transition-colors"
        aria-label="Torna alla home"
      >
        <Home size={22} />
      </button>
      <div className="absolute top-6 right-6">
        <WhatIsFoleda />
      </div>

      <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 text-center">
        Le Tre Porte
      </h2>
      <p className="font-body text-lg text-muted-foreground italic mb-12 text-center max-w-lg">
        Scegli dove vuoi andare.
      </p>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-4xl">
        {doors.map((door) => (
          <button
            key={door.id}
            onClick={() => onNavigate(door.id)}
            className="foleda-card foleda-glow-hover flex-1 p-8 md:p-10 cursor-pointer text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {/* Glyph */}
            <div className="text-4xl mb-6 transition-transform duration-300 group-hover:scale-110"
              style={{ color: 'hsl(42, 52%, 51%)' }}>
              {door.glyph}
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
              {door.title}
            </h3>

            {/* Subtitle */}
            <p className="font-body text-base italic text-foreground/70 leading-relaxed">
              {door.subtitle}
            </p>
          </button>
        ))}
      </div>

      <ComelasfogliaFooter />
    </div>
  );
};

export default PortePage;