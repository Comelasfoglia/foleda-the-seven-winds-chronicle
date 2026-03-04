import { useState, useEffect, useCallback } from "react";
import regionsData from "@/data/regions.json";
import RegionModal from "@/components/RegionModal";
import DiceRoller from "@/components/DiceRoller";
import ComelasfogliaFooter from "@/components/ComelasfogliaFooter";
import mappaFoleda from "@/assets/mappa-foleda.png";

interface MapSectionProps {
  targetRegionId: string | null;
  onClearTarget: () => void;
}

const regionPolygons: Record<string, { points: string; color: string; label: string; labelPos: [number, number] }> = {
  nord: {
    points: "35.86,14.87 46.86,40.63 48.64,40.21 48.74,38.74 50.1,36.75 50.84,36.65 51.88,38.22 52.2,40.31 62.25,13.3 60.05,12.46 57.12,11.73 53.46,11.1 49.69,11.2 46.23,11.31 42.88,11.94 39.74,12.98",
    color: "#B8D8E8",
    label: "I Picchi di Gelobrina",
    labelPos: [49, 22],
  },
  nordest: {
    points: "62.46,13.3 52.72,40.52 53.35,40.94 54.19,41.57 55.03,40.94 56.28,42.2 56.28,43.46 56.39,44.29 56.91,45.34 56.91,45.86 80.47,35.6 80.47,33.4 82.67,31.31 83.51,29.32 82.46,29.74 83.93,24.5 84.14,21.99 84.14,20.73 83.72,20.31 81.83,20.94 80.37,21.47 78.48,22.09 76.91,22.2 75.45,21.88 73.35,20.21 71.88,18.53 69.69,16.34 67.7,14.87 65.29,13.72",
    color: "#4A9E6B",
    label: "L'Elfica Regione",
    labelPos: [70, 28],
  },
  est: {
    points: "57.12,45.86 80.37,36.02 80.89,36.75 80.58,38.43 80.16,40 79.53,41.99 79.11,43.56 79.11,44.92 79.01,46.81 79.01,48.38 79.74,49.95 80.89,50.89 82.25,52.15 83.19,53.3 82.77,55.71 80.58,60.63 57.02,50.89",
    color: "#D4854A",
    label: "Le Gole del Tramonto",
    labelPos: [70, 48],
  },
  sudest: {
    points: "57.02,51.31 80.37,60.94 79.84,62.51 79.42,64.19 79.32,65.65 78.9,67.23 78.06,69.01 77.23,70.05 76.39,71.2 75.34,72.36 73.46,73.3 71.05,73.82 69.48,73.82 67.8,74.14 66.02,74.76 65.08,75.6 63.93,76.65 63.4,77.59 63.09,79.79 53.46,54.76 54.19,54.66 54.82,54.66 55.55,53.82 56.28,52.67",
    color: "#A83240",
    label: "Porto Ardente",
    labelPos: [68, 65],
  },
  sud: {
    points: "52.93,54.76 62.15,79.58 62.36,81.88 61.62,83.14 61.2,84.4 60.58,85.97 59.84,87.33 59.21,88.48 58.48,89.74 57.43,90.68 55.45,90.79 52.83,90.58 51.05,90.26 49.27,89.74 47.38,88.9 45.71,88.9 44.35,88.17 43.09,87.54 41.1,86.81 39.84,85.65 37.75,84.71 36.39,83.46 35.97,83.04 48.95,54.97",
    color: "#1A1A1A",
    label: "Il Vuoto",
    labelPos: [50, 75],
  },
  sudovest: {
    points: "48.53,54.87 35.76,82.41 34.71,82.2 33.14,80.84 32.2,79.48 32.09,77.38 33.04,75.18 33.25,73.93 32.51,72.88 30.21,71.52 29.27,70.47 27.7,69.21 26.54,67.64 25.29,66.18 24.14,64.92 22.88,62.83 22.36,61.26 21.73,59.69 43.72,51.41 45.08,52.88 45.92,54.03 47.07,54.35",
    color: "#5BA8A0",
    label: "Deserto di Verderame",
    labelPos: [33, 65],
  },
  ovest: {
    points: "43.93,51.1 44.14,45.97 19.53,33.51 18.38,34.45 17.12,35.29 15.45,36.23 14.5,36.75 13.35,37.17 15.45,39.06 17.43,40 19.32,40.42 19.11,41.47 18.8,42.72 18.8,43.66 19.11,44.61 19.42,46.18 19.63,47.85 19.95,49.01 19.32,49.84 18.38,50.47 18.06,50.79 21.52,58.95",
    color: "#6B7A45",
    label: "Foresta di Ventascolta",
    labelPos: [28, 46],
  },
  nordovest: {
    points: "36.07,14.97 46.54,41.05 45.71,40.52 45.18,41.57 45.08,42.51 44.97,44.4 44.45,45.24 19.74,33.09 19.53,31.94 20.37,29.01 22.15,26.39 24.24,23.66 27.38,20.52 30.52,17.7 33.46,15.5",
    color: "#9E8A4F",
    label: "Palude di Torbaviva",
    labelPos: [32, 28],
  },
  centro: {
    points: "50.63,37.28 51.68,38.74 51.88,39.9 52.3,40.94 53.35,41.68 54.4,42.2 55.03,41.68 55.45,42.3 55.86,43.87 56.07,45.97 56.39,47.23 56.49,48.8 56.39,50.26 56.18,51.41 55.34,52.57 54.4,53.61 53.04,54.03 51.26,54.14 49.48,54.35 48.01,53.72 46.96,53.51 46.02,52.25 44.66,50.99 44.55,46.28 45.08,44.29 45.92,41.78 46.96,41.15 49.06,40.63",
    color: "#7A7A82",
    label: "La Città",
    labelPos: [50.5, 47],
  },
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
      <div className="relative w-full max-w-lg mx-auto">
        <img
          src={mappaFoleda}
          alt="Mappa della Piana dei Sette Venti"
          className="w-full h-auto block"
          draggable={false}
        />

        {/* SVG overlay */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {Object.entries(regionPolygons).map(([id, { points, color }]) => {
            const isHovered = hoveredRegion === id;
            return (
              <polygon
                key={id}
                points={points}
                fill={isHovered ? color : "transparent"}
                fillOpacity={isHovered ? 0.25 : 0}
                stroke="transparent"
                className="cursor-pointer"
                style={{ transition: "fill-opacity 300ms, fill 300ms" }}
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
          {/* Hover label */}
          {hoveredRegion && regionPolygons[hoveredRegion] && (
            <g style={{ pointerEvents: "none" }}>
              <rect
                x={regionPolygons[hoveredRegion].labelPos[0] - 0.5}
                y={regionPolygons[hoveredRegion].labelPos[1] - 3.2}
                width={regionPolygons[hoveredRegion].label.length * 1.05 + 1}
                height={4.5}
                rx={1}
                fill="hsl(0 0% 5% / 0.85)"
                transform={`translate(${-(regionPolygons[hoveredRegion].label.length * 1.05 + 1) / 2 + 0.5}, 0)`}
              />
              <text
                x={regionPolygons[hoveredRegion].labelPos[0]}
                y={regionPolygons[hoveredRegion].labelPos[1]}
                textAnchor="middle"
                fill="white"
                fontSize="2.4"
                fontFamily="inherit"
                style={{ transition: "opacity 200ms", opacity: 1 }}
              >
                {regionPolygons[hoveredRegion].label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Dice Roller */}
      <DiceRoller onResult={handleDiceResult} />

      <ComelasfogliaFooter />

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