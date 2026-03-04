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
    { number: 1, x: 51.53, y: 70.83 }, { number: 2, x: 41.48, y: 56.81 },
    { number: 3, x: 60.04, y: 55.79 }, { number: 4, x: 32.53, y: 39.74 },
    { number: 5, x: 50.87, y: 36.48 }, { number: 6, x: 66.59, y: 38.11 },
  ],
  nordest: [
    { number: 1, x: 27.39, y: 70.52 }, { number: 2, x: 32.26, y: 53.72 },
    { number: 3, x: 45.71, y: 68.42 }, { number: 4, x: 39.28, y: 32.54 },
    { number: 5, x: 51.95, y: 44.18 }, { number: 6, x: 64.04, y: 56.58 },
  ],
  est: [
    { number: 1, x: 27.36, y: 52.51 }, { number: 2, x: 43.63, y: 43.85 },
    { number: 3, x: 43.63, y: 60.25 }, { number: 4, x: 65.60, y: 35.19 },
    { number: 5, x: 66.48, y: 48.86 }, { number: 6, x: 68.46, y: 65.72 },
  ],
  sudest: [
    { number: 1, x: 28.88, y: 27.13 }, { number: 2, x: 34.70, y: 44.18 },
    { number: 3, x: 48.92, y: 35.45 }, { number: 4, x: 70.26, y: 41.06 },
    { number: 5, x: 58.62, y: 55.20 }, { number: 6, x: 42.46, y: 65.59 },
  ],
  sud: [
    { number: 1, x: 53.06, y: 21.66 }, { number: 2, x: 46.06, y: 34.67 },
    { number: 3, x: 60.72, y: 35.03 }, { number: 4, x: 71.23, y: 58.02 },
    { number: 5, x: 54.16, y: 60.52 }, { number: 6, x: 34.46, y: 57.31 },
  ],
  sudovest: [
    { number: 1, x: 71.21, y: 24.70 }, { number: 2, x: 53.46, y: 28.84 },
    { number: 3, x: 65.80, y: 40.26 }, { number: 4, x: 55.84, y: 61.32 },
    { number: 5, x: 42.42, y: 49.90 }, { number: 6, x: 32.90, y: 35.73 },
  ],
  ovest: [
    { number: 1, x: 74.90, y: 53.68 }, { number: 2, x: 57.91, y: 43.42 },
    { number: 3, x: 56.72, y: 63.28 }, { number: 4, x: 39.92, y: 70.65 },
    { number: 5, x: 39.72, y: 50.78 }, { number: 6, x: 39.53, y: 32.03 },
  ],
  nordovest: [
    { number: 1, x: 71.29, y: 71.44 }, { number: 2, x: 52.80, y: 65.43 },
    { number: 3, x: 63.76, y: 54.01 }, { number: 4, x: 32.58, y: 55.81 },
    { number: 5, x: 43.55, y: 44.59 }, { number: 6, x: 55.81, y: 32.57 },
  ],
  centro: [
    { number: 1, x: 48.68, y: 58.96 }, { number: 2, x: 48.01, y: 40.48 },
    { number: 3, x: 30.46, y: 48.60 }, { number: 4, x: 36.75, y: 68.21 },
    { number: 5, x: 60.60, y: 71.29 }, { number: 6, x: 68.87, y: 55.04 },
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
          {regionHotspots.map((hs, idx) => {
            const isHovered = hoveredHotspot === idx;
            const isSelected = selectedSubIdx === idx;
            return (
              <g key={hs.number}>
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r={3}
                  fill={isHovered || isSelected ? "hsla(42, 52%, 51%, 0.15)" : "transparent"}
                  stroke="hsla(42, 52%, 51%, 0.5)"
                  strokeWidth={isHovered || isSelected ? 0.8 : 0.5}
                  className="cursor-pointer"
                  style={{
                    transition: "all 200ms",
                    transform: isHovered ? `scale(1.2)` : "scale(1)",
                    transformOrigin: `${hs.x}px ${hs.y}px`,
                    strokeOpacity: isHovered || isSelected ? 1 : 0.5,
                  }}
                  onMouseEnter={() => setHoveredHotspot(idx)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  onClick={() => handleHotspotClick(idx)}
                />
                <text
                  x={hs.x}
                  y={hs.y + 1}
                  textAnchor="middle"
                  fill="hsla(42, 52%, 78%, 0.9)"
                  fontSize="2.5"
                  fontFamily="inherit"
                  className="pointer-events-none select-none"
                  style={{ fontWeight: 600 }}
                >
                  {hs.number}
                </text>
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
