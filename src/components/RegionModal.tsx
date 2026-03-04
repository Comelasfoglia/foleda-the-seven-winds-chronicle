import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import adventuresData from "@/data/adventures.json";
import FormattedText from "./FormattedText";

interface SubLocation {
  number: number;
  name: string;
  description: string;
}

interface Quarter {
  name: string;
  subLocations: SubLocation[];
}

interface Region {
  id: string;
  name: string;
  direction: string;
  color: string;
  spirit: string;
  spiritQuote: string;
  description: string;
  subLocations?: SubLocation[];
  isCity?: boolean;
  quarters?: Quarter[];
  adventures: string[];
}

interface RegionModalProps {
  region: Region;
  initialSubLocation: number | null;
  diceBadge: { d8: number; d6: number } | null;
  onClose: () => void;
}

const RegionModal = ({ region, initialSubLocation, diceBadge, onClose }: RegionModalProps) => {
  const [level, setLevel] = useState<1 | 2>(initialSubLocation ? 2 : 1);
  const [currentSubIdx, setCurrentSubIdx] = useState<number>(
    initialSubLocation ? initialSubLocation - 1 : 0
  );

  const allSubLocations = region.isCity
    ? region.quarters?.flatMap(q => q.subLocations) || []
    : region.subLocations || [];

  const currentSub = allSubLocations[currentSubIdx];
  const regionAdventures = adventuresData.filter(a => region.adventures.includes(a.id));

  const goToSub = useCallback((idx: number) => {
    setCurrentSubIdx(idx);
    setLevel(2);
  }, []);

  const goBack = useCallback(() => {
    setLevel(1);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'hsla(0, 0%, 0%, 0.7)' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg p-6 md:p-8"
        style={{
          background: 'hsla(262, 35%, 20%, 0.95)',
          border: '1px solid hsla(42, 52%, 51%, 0.3)',
          animation: 'scaleIn 250ms ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Dice badge */}
        {diceBadge && (
          <div className="font-label text-xs text-accent mb-4">
            🎲 d8: {diceBadge.d8} · d6: {diceBadge.d6}
          </div>
        )}

        {level === 1 ? (
          /* Level 1: Region overview */
          <>
            <h2 className="font-display text-3xl font-bold text-foreground mb-1"
              style={{ color: region.color }}>
              {region.name}
            </h2>
            <p className="font-label text-sm text-muted-foreground mb-6">
              Spirito: {region.spirit} · Direzione: {region.direction}
            </p>

            <FormattedText text={region.description} className="font-body text-foreground/90 leading-relaxed mb-8" />

            {/* Sub-locations grid */}
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              {region.isCity ? "Quartieri" : "Luoghi"}
            </h3>

            {region.isCity && region.quarters ? (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {region.quarters.map((quarter, qi) => (
                  <button
                    key={qi}
                    onClick={() => goToSub(region.quarters!.slice(0, qi).reduce((sum, q) => sum + q.subLocations.length, 0))}
                    className="foleda-card p-4 text-left cursor-pointer"
                  >
                    <span className="font-display text-lg font-semibold text-foreground">{quarter.name}</span>
                    <span className="block font-label text-xs text-muted-foreground mt-1">
                      {quarter.subLocations.length} luoghi
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {allSubLocations.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSub(idx)}
                    className="foleda-card p-4 text-left cursor-pointer"
                  >
                    <span className="font-display text-2xl font-bold text-primary block">{sub.number}</span>
                    <span className="font-body text-sm text-foreground/80">{sub.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Adventures */}
            {regionAdventures.length > 0 ? (
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">Avventure</h3>
                {regionAdventures.map(adv => (
                  <div key={adv.id} className="foleda-card p-4 mb-3">
                    <h4 className="font-display text-lg font-semibold text-foreground">{adv.title}</h4>
                    <p className="font-body text-sm italic text-foreground/70 mt-1">{adv.quote}</p>
                    <a href={adv.url} target="_blank" rel="noopener noreferrer"
                      className="inline-block mt-2 font-label text-sm text-accent hover:text-accent/80 transition-colors">
                      Gioca →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body italic text-muted-foreground mb-8">
                Nessuna avventura è stata scritta qui — ancora.
              </p>
            )}

            {/* Spirit quote */}
            <blockquote className="font-body italic text-foreground/60 border-l-2 pl-4 mt-4"
              style={{ borderColor: region.color }}>
              {region.spiritQuote}
              <span className="block mt-1 font-label text-xs not-italic text-muted-foreground">
                — {region.spirit}
              </span>
            </blockquote>
          </>
        ) : (
          /* Level 2: Sub-location detail */
          currentSub && (
            <>
              <button
                onClick={goBack}
                className="font-label text-sm text-accent hover:text-accent/80 transition-colors mb-4 flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Torna a {region.name}
              </button>

              <div className="font-display text-5xl font-bold text-primary mb-2">
                {currentSub.number}
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                {currentSub.name}
              </h2>
              <p className="font-label text-sm text-muted-foreground mb-6">
                {region.name} · {region.direction}
              </p>
              <FormattedText text={currentSub.description} className="font-body text-foreground/90 leading-relaxed mb-8" />

              {/* Prev/Next navigation */}
              <div className="flex justify-between items-center pt-4 border-t"
                style={{ borderColor: 'hsla(42, 52%, 51%, 0.2)' }}>
                {currentSubIdx > 0 ? (
                  <button
                    onClick={() => setCurrentSubIdx(currentSubIdx - 1)}
                    className="font-label text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={14} />
                    {allSubLocations[currentSubIdx - 1].number}. {allSubLocations[currentSubIdx - 1].name}
                  </button>
                ) : <div />}
                {currentSubIdx < allSubLocations.length - 1 ? (
                  <button
                    onClick={() => setCurrentSubIdx(currentSubIdx + 1)}
                    className="font-label text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    {allSubLocations[currentSubIdx + 1].number}. {allSubLocations[currentSubIdx + 1].name}
                    <ChevronRight size={14} />
                  </button>
                ) : <div />}
              </div>
            </>
          )
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RegionModal;