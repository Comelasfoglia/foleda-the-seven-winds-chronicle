import { useState, useCallback, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import FormattedText from "./FormattedText";
import { useIsMobile } from "@/hooks/use-mobile";

interface SubLocation {
  number: number;
  name: string;
  description: string;
  fullDescription?: string;
}

interface Quarter {
  name: string;
  d4: number;
  direction: string;
  governor: string;
  description: string;
  subLocations: SubLocation[];
}

interface CityRegion {
  id: string;
  name: string;
  direction: string;
  color: string;
  spirit: string;
  spiritQuote: string;
  description: string;
  isCity: boolean;
  quarters: Quarter[];
  adventures: string[];
}

interface CityModalProps {
  region: CityRegion;
  onBack: () => void;
}

/* ── Location Balloon (overlay within quarter view) ── */
interface LocationBalloonProps {
  location: SubLocation;
  quarterName: string;
  quarterDirection: string;
  totalCount: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

const LocationBalloon = ({
  location,
  quarterName,
  quarterDirection,
  totalCount,
  currentIndex,
  onPrev,
  onNext,
  onClose,
}: LocationBalloonProps) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const balloonRef = useRef<HTMLDivElement>(null);

  // Reset expanded when location changes
  useEffect(() => {
    setExpanded(false);
  }, [currentIndex]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (balloonRef.current && !balloonRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      className={`${
        isMobile
          ? "fixed inset-x-0 bottom-0 z-50 max-h-[70vh]"
          : "absolute inset-x-0 top-0 z-30 mx-auto max-w-lg"
      }`}
      style={{
        animation: isMobile
          ? "slideUpBalloon 250ms ease forwards"
          : "fadeInBalloon 200ms ease forwards",
      }}
    >
      <div
        ref={balloonRef}
        className={`rounded-lg p-5 md:p-6 overflow-y-auto ${
          isMobile ? "rounded-b-none max-h-[70vh]" : "max-h-[60vh]"
        }`}
        style={{
          background: "hsla(262, 35%, 14%, 0.98)",
          border: "1px solid hsla(42, 52%, 51%, 0.3)",
          boxShadow: "0 -4px 30px hsla(0, 0%, 0%, 0.5)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {/* Number + name */}
        <div className="font-display text-4xl font-bold text-primary mb-1">
          {location.number}
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">
          {location.name}
        </h3>
        <p className="font-label text-xs text-muted-foreground mb-4">
          {quarterName} · {quarterDirection}
        </p>

        <FormattedText
          text={
            expanded && location.fullDescription
              ? location.fullDescription
              : location.description
          }
          className="font-body text-foreground/90 leading-relaxed text-sm mb-4"
        />

        {location.fullDescription && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="font-label text-sm text-primary hover:text-primary/80 transition-colors mb-4 block"
          >
            Leggi di più →
          </button>
        )}
        {expanded && location.fullDescription && (
          <button
            onClick={() => setExpanded(false)}
            className="font-label text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 block"
          >
            ← Riduci
          </button>
        )}

        {/* Prev/Next */}
        <div
          className="flex justify-between items-center pt-3 border-t"
          style={{ borderColor: "hsla(42, 52%, 51%, 0.2)" }}
        >
          {currentIndex > 0 ? (
            <button
              onClick={onPrev}
              className="font-label text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={12} />
              {currentIndex}. prev
            </button>
          ) : (
            <div />
          )}
          {currentIndex < totalCount - 1 ? (
            <button
              onClick={onNext}
              className="font-label text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              next
              <ChevronRight size={12} />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUpBalloon {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInBalloon {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ── Main CityModal ── */
const CityModal = ({ region, onBack }: CityModalProps) => {
  const [level, setLevel] = useState<1 | 2>(1);
  const [selectedQuarterIdx, setSelectedQuarterIdx] = useState<number | null>(null);
  const [selectedLocIdx, setSelectedLocIdx] = useState<number | null>(null);
  const [diceBadge, setDiceBadge] = useState<{ d4: number; d12: number; name: string } | null>(null);

  // Dice rolling state
  const [rolling, setRolling] = useState(false);
  const [animD4, setAnimD4] = useState<number | null>(null);
  const [animD12, setAnimD12] = useState<number | null>(null);
  const [highlightQuarter, setHighlightQuarter] = useState<number | null>(null);

  const quarter = selectedQuarterIdx !== null ? region.quarters[selectedQuarterIdx] : null;
  const location = quarter && selectedLocIdx !== null ? quarter.subLocations[selectedLocIdx] : null;

  const goToQuarter = useCallback((idx: number) => {
    setSelectedQuarterIdx(idx);
    setSelectedLocIdx(null);
    setLevel(2);
  }, []);

  const backToCity = useCallback(() => {
    setLevel(1);
    setSelectedQuarterIdx(null);
    setSelectedLocIdx(null);
    setDiceBadge(null);
    setHighlightQuarter(null);
  }, []);

  const rollCityDice = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setDiceBadge(null);
    setHighlightQuarter(null);
    setSelectedLocIdx(null);

    let count = 0;
    const interval = setInterval(() => {
      setAnimD4(Math.floor(Math.random() * 4) + 1);
      setAnimD12(Math.floor(Math.random() * 12) + 1);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const finalD4 = Math.floor(Math.random() * 4) + 1;
        const finalD12 = Math.floor(Math.random() * 12) + 1;
        setAnimD4(finalD4);
        setAnimD12(finalD12);
        setRolling(false);

        const qIdx = finalD4 - 1;
        setHighlightQuarter(qIdx);

        setTimeout(() => {
          const q = region.quarters[qIdx];
          const loc = q.subLocations[finalD12 - 1];
          setDiceBadge({ d4: finalD4, d12: finalD12, name: loc.name });
          setSelectedQuarterIdx(qIdx);
          setSelectedLocIdx(finalD12 - 1);
          setLevel(2);
          setHighlightQuarter(null);
        }, 800);
      }
    }, 80);
  }, [rolling, region.quarters]);

  return (
    <div className="flex flex-col items-center px-4 animate-in fade-in duration-300">
      {/* Back to map */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={onBack}
          className="font-label text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={16} /> Torna alla Piana
        </button>
        <h2
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1"
          style={{ color: region.color }}
        >
          {region.name}
        </h2>

        {/* Dice badge */}
        {diceBadge && (
          <div className="font-label text-xs text-primary mt-2 mb-2">
            🎲 d4: {diceBadge.d4} · d12: {diceBadge.d12} — {diceBadge.name}
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl">
        {level === 1 && (
          <>
            {/* Region image */}
            <div className="w-full mb-6 rounded-lg overflow-hidden">
              <img
                src="/assets/regions/centro.png"
                alt="La Città"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>

            {/* City description */}
            <FormattedText
              text={region.description}
              className="font-body text-foreground/80 leading-relaxed text-sm mb-6"
            />

            {/* Spirit quote */}
            <blockquote
              className="font-body italic text-foreground/50 border-l-2 pl-4 mb-8 text-sm"
              style={{ borderColor: region.color }}
            >
              {region.spiritQuote}
            </blockquote>

            {/* Quarters grid 2x2 */}
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Quartieri
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {region.quarters.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => goToQuarter(idx)}
                  className="foleda-card p-4 text-left cursor-pointer transition-all duration-300"
                  style={{
                    ...(highlightQuarter === idx
                      ? {
                          borderColor: "hsla(42, 52%, 51%, 0.8)",
                          boxShadow: "0 0 20px hsla(42, 52%, 51%, 0.3)",
                        }
                      : {}),
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-2xl font-bold text-primary">
                      {q.d4}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      🚪 {q.direction}
                    </span>
                  </div>
                  <span className="font-display text-base font-semibold text-foreground block">
                    {q.name}
                  </span>
                  <span className="font-label text-xs text-muted-foreground mt-1 block">
                    {q.governor}
                  </span>
                </button>
              ))}
            </div>

            {/* City dice roller */}
            <button
              onClick={rollCityDice}
              disabled={rolling}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] disabled:cursor-wait mb-6"
              style={{
                background: "hsla(252, 40%, 16%, 0.95)",
                border: "1px solid hsla(42, 52%, 51%, 0.4)",
                boxShadow: "0 0 20px hsla(42, 52%, 51%, 0.15)",
              }}
            >
              <div className={`flex items-center gap-2 ${rolling ? "dice-rolling" : ""}`}>
                <span className="font-label text-sm font-medium text-primary">
                  {animD4 !== null ? `d4: ${animD4}` : "d4"}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-label text-sm font-medium text-primary">
                  {animD12 !== null ? `d12: ${animD12}` : "d12"}
                </span>
              </div>
              <span className="font-label text-xs text-muted-foreground">
                🎲 Esplora La Città
              </span>
            </button>
          </>
        )}

        {level === 2 && quarter && (
          <div className="relative">
            <button
              onClick={backToCity}
              className="font-label text-sm text-primary hover:text-primary/80 transition-colors mb-4 flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Torna ai quartieri
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-display text-4xl font-bold text-primary">
                {quarter.d4}
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-1">
              {quarter.name}
            </h3>
            <p className="font-label text-sm text-muted-foreground mb-4">
              {quarter.direction} · {quarter.governor}
            </p>
            <FormattedText
              text={quarter.description}
              className="font-body text-foreground/80 leading-relaxed text-sm mb-6"
            />

            {/* Locations grid 3x4, responsive 2x6 on mobile */}
            <h4 className="font-display text-lg font-semibold text-foreground mb-3">
              Luoghi
            </h4>
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 transition-all duration-200 ${selectedLocIdx !== null ? "opacity-40 pointer-events-none" : ""}`}>
              {quarter.subLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLocIdx(idx)}
                  className={`foleda-card p-3 text-left cursor-pointer transition-all duration-200 ${
                    selectedLocIdx === idx ? "ring-1 ring-primary" : ""
                  }`}
                >
                  <span className="font-display text-xl font-bold text-primary block">
                    {loc.number}
                  </span>
                  <span className="font-body text-xs text-foreground/80 leading-tight">
                    {loc.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Location balloon overlay */}
            {selectedLocIdx !== null && location && (
              <LocationBalloon
                location={location}
                quarterName={quarter.name}
                quarterDirection={quarter.direction}
                totalCount={quarter.subLocations.length}
                currentIndex={selectedLocIdx}
                onPrev={() => setSelectedLocIdx(selectedLocIdx - 1)}
                onNext={() => setSelectedLocIdx(selectedLocIdx + 1)}
                onClose={() => setSelectedLocIdx(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CityModal;
