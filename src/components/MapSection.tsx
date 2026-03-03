import { useState, useEffect, useCallback } from "react";
import regionsData from "@/data/regions.json";
import RegionModal from "@/components/RegionModal";
import DiceRoller from "@/components/DiceRoller";

interface MapSectionProps {
  targetRegionId: string | null;
  onClearTarget: () => void;
}

// Approximate pie-slice paths for 8 regions + center circle
const regionPaths: Record<string, string> = {
  nord: "M250,250 L250,30 A220,220 0 0,1 405,105 Z",
  nordest: "M250,250 L405,105 A220,220 0 0,1 470,250 Z",
  est: "M250,250 L470,250 A220,220 0 0,1 405,395 Z",
  sudest: "M250,250 L405,395 A220,220 0 0,1 250,470 Z",
  sud: "M250,250 L250,470 A220,220 0 0,1 95,395 Z",
  sudovest: "M250,250 L95,395 A220,220 0 0,1 30,250 Z",
  ovest: "M250,250 L30,250 A220,220 0 0,1 95,105 Z",
  nordovest: "M250,250 L95,105 A220,220 0 0,1 250,30 Z",
};

const MapSection = ({ targetRegionId, onClearTarget }: MapSectionProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSubLocation, setSelectedSubLocation] = useState<number | null>(null);
  const [diceBadge, setDiceBadge] = useState<{ d8: number; d6: number } | null>(null);

  useEffect(() => {
    if (targetRegionId) {
      setSelectedRegion(targetRegionId);
      onClearTarget();
    }
  }, [targetRegionId, onClearTarget]);

  const handleDiceResult = useCallback((d8: number, d6: number) => {
    const regionIds = ["nord", "nordest", "est", "sudest", "sud", "sudovest", "ovest", "nordovest"];
    const regionId = regionIds[d8 - 1];
    setDiceBadge({ d8, d6 });
    setSelectedRegion(regionId);
    setSelectedSubLocation(d6);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRegion(null);
    setSelectedSubLocation(null);
    setDiceBadge(null);
  }, []);

  const region = selectedRegion ? regionsData.find(r => r.id === selectedRegion) : null;

  return (
    <div className="relative flex flex-col items-center px-4">
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 text-center">
        La Piana dei Sette Venti
      </h2>
      <p className="font-body text-base italic text-muted-foreground mb-8 text-center">
        Tocca una regione per esplorarla.
      </p>

      {/* Map container */}
      <div className="relative w-full max-w-lg mx-auto aspect-square">
        {/* Placeholder map background */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(262, 35%, 25%, 0.8) 0%, hsla(252, 40%, 14%, 0.9) 70%)',
            border: '2px solid hsla(42, 52%, 51%, 0.2)',
          }}
        />

        {/* SVG overlay */}
        <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
          {/* Region slices */}
          {Object.entries(regionPaths).map(([id, path]) => {
            const regionInfo = regionsData.find(r => r.id === id);
            const isHovered = hoveredRegion === id;
            const otherHovered = hoveredRegion && hoveredRegion !== id;
            return (
              <path
                key={id}
                d={path}
                fill={isHovered ? `${regionInfo?.color}33` : 'transparent'}
                stroke={isHovered ? regionInfo?.color : 'hsla(42, 52%, 51%, 0.15)'}
                strokeWidth={isHovered ? 2 : 1}
                className="cursor-pointer transition-all duration-300"
                style={{ opacity: otherHovered ? 0.5 : 1 }}
                onMouseEnter={() => setHoveredRegion(id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => {
                  setSelectedRegion(id);
                  setSelectedSubLocation(null);
                  setDiceBadge(null);
                }}
              />
            );
          })}

          {/* Center circle (La Città) */}
          <circle
            cx="250" cy="250" r="60"
            fill={hoveredRegion === "centro" ? '#7A7A8233' : 'transparent'}
            stroke={hoveredRegion === "centro" ? '#7A7A82' : 'hsla(42, 52%, 51%, 0.2)'}
            strokeWidth={hoveredRegion === "centro" ? 2 : 1}
            className="cursor-pointer transition-all duration-300"
            style={{ opacity: hoveredRegion && hoveredRegion !== "centro" ? 0.5 : 1 }}
            onMouseEnter={() => setHoveredRegion("centro")}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => {
              setSelectedRegion("centro");
              setSelectedSubLocation(null);
              setDiceBadge(null);
            }}
          />

          {/* Region labels */}
          {regionsData.map((r) => {
            const labelPositions: Record<string, { x: number; y: number }> = {
              nord: { x: 250, y: 80 },
              nordest: { x: 390, y: 130 },
              est: { x: 420, y: 270 },
              sudest: { x: 380, y: 400 },
              sud: { x: 250, y: 440 },
              sudovest: { x: 110, y: 400 },
              ovest: { x: 70, y: 270 },
              nordovest: { x: 110, y: 130 },
              centro: { x: 250, y: 250 },
            };
            const pos = labelPositions[r.id];
            if (!pos) return null;
            return (
              <text
                key={r.id}
                x={pos.x} y={pos.y}
                textAnchor="middle"
                className="font-label text-[10px] pointer-events-none select-none"
                fill={hoveredRegion === r.id ? r.color : 'hsla(35, 45%, 90%, 0.5)'}
                style={{ transition: 'fill 300ms' }}
              >
                {r.name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Dice Roller */}
      <DiceRoller onResult={handleDiceResult} />

      {/* Region Modal */}
      {region && (
        <RegionModal
          region={region}
          initialSubLocation={selectedSubLocation}
          diceBadge={diceBadge}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MapSection;