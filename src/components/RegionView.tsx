import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import SubLocationBalloon from "@/components/SubLocationBalloon";
import adventuresData from "@/data/adventures.json";

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

// Hotspot coordinates per region (percentage x,y)
const hotspots: Record<string, { number: number; x: number; y: number }[]> = {
  nord: [
    { number: 1, x: 50.31, y: 73.34 }, { number: 2, x: 38.09, y: 60.79 },
    { number: 3, x: 61.91, y: 60.21 }, { number: 4, x: 30.09, y: 45.76 },
    { number: 5, x: 50.47, y: 44.01 }, { number: 6, x: 69.59, y: 43.57 },
  ],
  nordest: [
    { number: 1, x: 20.06, y: 72.23 }, { number: 2, x: 25.55, y: 54.15 },
    { number: 3, x: 43.26, y: 71.62 }, { number: 4, x: 37.15, y: 42.51 },
    { number: 5, x: 48.12, y: 50.78 }, { number: 6, x: 59.72, y: 65.95 },
  ],
  est: [
    { number: 1, x: 22.26, y: 55.43 }, { number: 2, x: 39.66, y: 39.15 },
    { number: 3, x: 38.24, y: 60.80 }, { number: 4, x: 59.25, y: 36.22 },
    { number: 5, x: 62.85, y: 48.76 }, { number: 6, x: 58.31, y: 69.43 },
  ],
  sudest: [
    { number: 1, x: 22.10, y: 28.68 }, { number: 2, x: 27.12, y: 39.27 },
    { number: 3, x: 42.79, y: 28.22 }, { number: 4, x: 59.56, y: 33.97 },
    { number: 5, x: 50.16, y: 45.48 }, { number: 6, x: 34.48, y: 58.04 },
  ],
  sud: [
    { number: 1, x: 50.00, y: 17.93 }, { number: 2, x: 44.51, y: 28.52 },
    { number: 3, x: 61.60, y: 27.63 }, { number: 4, x: 69.91, y: 48.56 },
    { number: 5, x: 54.55, y: 49.07 }, { number: 6, x: 36.05, y: 46.13 },
  ],
  sudovest: [
    { number: 1, x: 70.22, y: 19.77 }, { number: 2, x: 54.23, y: 24.34 },
    { number: 3, x: 71.32, y: 37.33 }, { number: 4, x: 60.82, y: 55.02 },
    { number: 5, x: 46.55, y: 46.17 }, { number: 6, x: 34.17, y: 32.19 },
  ],
  ovest: [
    { number: 1, x: 79.94, y: 50.72 }, { number: 2, x: 61.91, y: 40.45 },
    { number: 3, x: 59.25, y: 66.66 }, { number: 4, x: 46.39, y: 70.91 },
    { number: 5, x: 41.54, y: 46.47 }, { number: 6, x: 46.71, y: 32.49 },
  ],
  nordovest: [
    { number: 1, x: 76.18, y: 72.53 }, { number: 2, x: 63.48, y: 58.68 },
    { number: 3, x: 54.55, y: 69.61 }, { number: 4, x: 38.40, y: 62.47 },
    { number: 5, x: 48.12, y: 48.62 }, { number: 6, x: 62.54, y: 38.85 },
  ],
  centro: [
    { number: 1, x: 50.00, y: 54.88 },
  ],
};

const regionImageMap: Record<string, string> = {
  nord: "/assets/regions/1_nord.png",
  nordest: "/assets/regions/2_nordest.png",
  est: "/assets/regions/3_est.png",
  sudest: "/assets/regions/4_sudest.png",
  sud: "/assets/regions/5_sud.png",
  sudovest: "/assets/regions/6_sudovest.png",
  ovest: "/assets/regions/7_ovest.png",
  nordovest: "/assets/regions/8_nordovest.png",
  centro: "/assets/regions/centro.png",
};

interface RegionViewProps {
  region: Region;
  initialSubLocation: number | null;
  diceBadge: { d8: number; d6: number } | null;
  onBack: () => void;
}

const RegionView = ({ region, initialSubLocation, diceBadge, onBack }: RegionViewProps) => {
  const [selectedSubIdx, setSelectedSubIdx] = useState<number | null>(
    initialSubLocation !== null ? initialSubLocation - 1 : null
  );
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const allSubLocations = region.isCity
    ? region.quarters?.flatMap(q => q.subLocations) || []
    : region.subLocations || [];

  const regionHotspots = hotspots[region.id] || [];
  const imageSrc = regionImageMap[region.id];
  const regionAdventures = adventuresData.filter(a => region.adventures.includes(a.id));

  // Update container rect on resize/scroll
  useEffect(() => {
    const update = () => {
      if (imgContainerRef.current) {
        setContainerRect(imgContainerRef.current.getBoundingClientRect());
      }
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const handleHotspotClick = useCallback((idx: number) => {
    setSelectedSubIdx(prev => prev === idx ? null : idx);
    // Update rect when clicking
    if (imgContainerRef.current) {
      setContainerRect(imgContainerRef.current.getBoundingClientRect());
    }
  }, []);

  const closeBalloon = useCallback(() => setSelectedSubIdx(null), []);

  const currentSub = selectedSubIdx !== null ? allSubLocations[selectedSubIdx] : null;
  const currentHotspot = selectedSubIdx !== null ? regionHotspots[selectedSubIdx] : null;

  return (
    <div className="flex flex-col items-center px-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={onBack}
          className="font-label text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mb-3"
        >
          <ChevronLeft size={16} /> Torna alla Piana
        </button>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1" style={{ color: region.color }}>
          {region.name}
        </h2>
        <p className="font-label text-sm text-muted-foreground">
          Spirito: {region.spirit} · Direzione: {region.direction}
        </p>

        {diceBadge && (
          <div className="font-label text-xs text-primary mt-2">
            🎲 d8: {diceBadge.d8} · d6: {diceBadge.d6}
          </div>
        )}
      </div>

      {/* Region image with hotspots */}
      <div ref={imgContainerRef} className="relative w-full max-w-2xl mx-auto mb-6">
        <img
          src={imageSrc}
          alt={region.name}
          className="w-full h-auto block rounded-lg"
          draggable={false}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ boxShadow: "inset 0 0 60px 20px rgba(0,0,0,0.5)" }}
        />

        {/* SVG hotspot overlay */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="hotspot-glow">
              <stop offset="0%" stopColor="hsla(42, 52%, 70%, 0.4)" />
              <stop offset="60%" stopColor="hsla(175, 45%, 60%, 0.15)" />
              <stop offset="100%" stopColor="hsla(175, 45%, 60%, 0)" />
            </radialGradient>
            <style>{`
              @keyframes hotspot-pulse {
                0%, 100% { opacity: 0.5; r: 4.5; }
                50% { opacity: 1; r: 6; }
              }
              @keyframes hotspot-core-pulse {
                0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 1px hsla(42, 52%, 70%, 0.4)); }
                50% { opacity: 1; filter: drop-shadow(0 0 3px hsla(42, 52%, 70%, 0.7)); }
              }
            `}</style>
          </defs>
          {regionHotspots.map((hs, idx) => {
            const isHovered = hoveredHotspot === idx;
            const isSelected = selectedSubIdx === idx;
            const subName = allSubLocations[idx]?.name || "";
            const delay = `${idx * 0.4}s`;
            return (
              <g key={hs.number}
                onMouseEnter={() => setHoveredHotspot(idx)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={() => handleHotspotClick(idx)}
                className="cursor-pointer"
              >
                {/* Pulsing outer glow */}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r={5}
                  fill="url(#hotspot-glow)"
                  stroke="none"
                  style={{
                    animation: `hotspot-pulse 3s ease-in-out ${delay} infinite`,
                    transformOrigin: `${hs.x}px ${hs.y}px`,
                    ...(isHovered || isSelected ? { opacity: 1, r: 7 } : {}),
                  }}
                />
                {/* Outer ring */}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r={4.5}
                  fill="none"
                  stroke="hsla(42, 52%, 70%, 0.25)"
                  strokeWidth={0.25}
                  style={{
                    animation: `hotspot-pulse 3s ease-in-out ${delay} infinite`,
                    transformOrigin: `${hs.x}px ${hs.y}px`,
                    transition: "all 300ms",
                    ...(isHovered || isSelected ? { stroke: "hsla(42, 52%, 70%, 0.6)", strokeWidth: 0.4 } : {}),
                  }}
                />
                {/* Main circle */}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r={2.8}
                  fill={isHovered || isSelected ? "hsla(42, 52%, 70%, 0.35)" : "hsla(42, 52%, 70%, 0.12)"}
                  stroke={isHovered || isSelected ? "hsla(42, 52%, 80%, 1)" : "hsla(42, 52%, 70%, 0.7)"}
                  strokeWidth={isHovered || isSelected ? 0.6 : 0.4}
                  style={{
                    animation: `hotspot-core-pulse 3s ease-in-out ${delay} infinite`,
                    transition: "all 200ms",
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                    transformOrigin: `${hs.x}px ${hs.y}px`,
                  }}
                />
                {/* Hover label */}
                {isHovered && !isSelected && (
                  <>
                    <rect
                      x={hs.x - (subName.length * 0.95 + 1) / 2}
                      y={hs.y - 8}
                      width={subName.length * 0.95 + 1}
                      height={3.5}
                      rx={0.8}
                      fill="hsla(0, 0%, 5%, 0.92)"
                      stroke="hsla(42, 52%, 70%, 0.3)"
                      strokeWidth={0.2}
                      className="pointer-events-none"
                    />
                    <text
                      x={hs.x}
                      y={hs.y - 5.5}
                      textAnchor="middle"
                      fill="hsla(42, 52%, 80%, 1)"
                      fontSize="1.8"
                      fontFamily="inherit"
                      className="pointer-events-none select-none"
                      style={{ fontWeight: 500 }}
                    >
                      {subName}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Region description */}
      <div className="w-full max-w-2xl mb-6">
        <div className="font-body text-foreground/80 leading-relaxed text-sm">
          {region.description}
        </div>
        <blockquote
          className="font-body italic text-foreground/50 border-l-2 pl-4 mt-4 text-sm"
          style={{ borderColor: region.color }}
        >
          {region.spiritQuote}
          <span className="block mt-1 font-label text-xs not-italic text-muted-foreground">
            — {region.spirit}
          </span>
        </blockquote>
      </div>

      {/* Adventures footer */}
      {regionAdventures.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          {regionAdventures.map(adv => (
            <a
              key={adv.id}
              href={adv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="foleda-card p-4 flex items-center justify-between cursor-pointer mb-3 block"
            >
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{adv.title}</h4>
                <p className="font-body text-sm italic text-foreground/60 mt-1">{adv.quote}</p>
              </div>
              <span className="font-label text-sm text-primary ml-4 shrink-0">Gioca →</span>
            </a>
          ))}
        </div>
      )}

      {/* Balloon */}
      {currentSub && currentHotspot && (
        <SubLocationBalloon
          subLocation={currentSub}
          regionName={region.name}
          regionDirection={region.direction}
          hotspot={currentHotspot}
          containerRect={containerRect}
          totalCount={allSubLocations.length}
          currentIndex={selectedSubIdx!}
          onPrev={() => setSelectedSubIdx(selectedSubIdx! - 1)}
          onNext={() => setSelectedSubIdx(selectedSubIdx! + 1)}
          onClose={closeBalloon}
        />
      )}
    </div>
  );
};

export default RegionView;
