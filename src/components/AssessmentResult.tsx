import { useEffect, useRef, useState } from "react";
import adventuresData from "@/data/adventures.json";

type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

interface CharacterData {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  role?: string;
  resultQuote: string;
  adventureId: string | null;
  bio?: string[];
  stats?: { fisico: number; testa: number; vento: number; agilita: number; ferite: number };
  abilities?: { name: string; type: string; desc: string }[];
}

interface AssessmentResultProps {
  result: {
    first: CharacterData | undefined;
  };
  onNavigate: (target: AppScreen, regionId?: string) => void;
  onRestart: () => void;
  onShare: () => void;
}

const STAT_LABELS: Record<string, string> = {
  fisico: "Fisico",
  testa: "Testa",
  vento: "Vento",
  agilita: "Agilità",
};

const StatBar = ({ label, value, maxVal, delay }: { label: string; value: number; maxVal: number; delay: number }) => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-3 mb-2">
      <span className="font-label text-sm text-foreground/70 w-16 text-right">{label}</span>
      <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: 'hsl(260, 40%, 12%)' }}>
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: animated ? `${(value / maxVal) * 100}%` : '0%',
            backgroundColor: 'hsl(var(--primary))',
            transitionDuration: '600ms',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span className="font-label text-sm text-primary/80 w-6 text-left">{value}</span>
    </div>
  );
};

const CharacterCard = ({
  char,
  onNavigate,
}: {
  char: CharacterData;
  onNavigate: (target: AppScreen, regionId?: string) => void;
}) => {
  const adventure = char.adventureId
    ? adventuresData.find(a => a.id === char.adventureId)
    : null;

  return (
    <div className="text-left">
      {/* Bio */}
      {char.bio && char.bio.length > 0 && (
        <div className="mb-10">
          {char.bio.map((paragraph, i) => (
            <p key={i} className="font-body text-base text-foreground/85 leading-[1.75] mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Stats */}
      {char.stats && (
        <div className="foleda-card p-6 mb-6">
          <h4 className="font-display text-lg text-primary/80 mb-4">Scheda Personaggio</h4>
          {Object.entries(STAT_LABELS).map(([key, label], i) => (
            <StatBar
              key={key}
              label={label}
              value={(char.stats as any)[key]}
              maxVal={7}
              delay={i * 100}
            />
          ))}
          <p className="font-label text-xs text-muted-foreground mt-3">
            Ferite: {char.stats.ferite}
          </p>
        </div>
      )}

      {/* Abilities */}
      {char.abilities && char.abilities.length > 0 && (
        <div className="foleda-card p-6 mb-8">
          <h4 className="font-display text-lg text-primary/80 mb-4">Abilità</h4>
          {char.abilities.map((ability, i) => (
            <div key={ability.name}>
              {i > 0 && <div className="border-t border-primary/20 my-3" />}
              <p className="font-display text-base font-bold text-foreground">{ability.name}</p>
              <p className="font-label text-xs text-primary/60 mb-1">{ability.type}</p>
              <p className="font-body text-sm text-foreground/70">{ability.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AssessmentResult = ({ result, onNavigate, onRestart, onShare }: AssessmentResultProps) => {
  if (!result.first) return null;

  const firstAdventure = result.first.adventureId
    ? adventuresData.find(a => a.id === result.first!.adventureId)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="font-display text-5xl md:text-6xl font-bold mb-2 animate-scale-in text-accent">
          {result.first.name}
        </h2>
        <p className="font-label text-sm text-primary/60 mb-6">
          {result.first.regionName} · {result.first.role || ''}
        </p>
        <p className="font-body text-xl italic text-foreground/80 leading-relaxed mb-10">
          "{result.first.resultQuote}"
        </p>
      </div>
      <CharacterCard char={result.first} onNavigate={onNavigate} />

      {/* Actions */}
      <div className="space-y-3 mt-8 text-center pb-12">
        {firstAdventure ? (
          <a href={firstAdventure.url} target="_blank" rel="noopener noreferrer"
            className="inline-block foleda-card foleda-glow-hover px-6 py-3 font-label text-sm text-accent border border-accent/30 hover:border-accent/60 transition-colors">
            🎲 Gioca la sua avventura →
          </a>
        ) : (
          <p className="font-body italic text-foreground/50 text-sm">
            La sua storia arriverà. Il vento la sta ancora portando.
          </p>
        )}
        <button
          onClick={() => onNavigate("esplora", result.first!.regionId)}
          className="block w-full font-label text-sm text-accent hover:text-accent/80 transition-colors"
        >
          🗺️ Esplora la sua regione →
        </button>
        <button onClick={onRestart}
          className="block w-full font-label text-sm text-muted-foreground hover:text-foreground transition-colors">
          🔄 Rifai il test
        </button>
        <button onClick={onShare}
          className="block w-full font-label text-sm text-muted-foreground hover:text-foreground transition-colors">
          📋 Condividi (copia testo)
        </button>
      </div>
    </div>
  );
};

export default AssessmentResult;
