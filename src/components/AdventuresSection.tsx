import adventuresData from "@/data/adventures.json";
import regionsData from "@/data/regions.json";
import ComelasfogliaFooter from "@/components/ComelasfogliaFooter";
import logoOmbre from "@/assets/logo-avventura-ombre.png";

type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

interface AdventuresSectionProps {
  onNavigate: (target: AppScreen, regionId?: string) => void;
}

const AdventuresSection = ({ onNavigate }: AdventuresSectionProps) => {
  const getRegionColor = (regionId: string) => {
    return regionsData.find(r => r.id === regionId)?.color || '#c9a84c';
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2 text-center">
        Gioca un'Avventura
      </h2>
      <p className="font-body text-base italic text-muted-foreground mb-10 text-center">
        Ogni avventura è un viaggio in solitaria. Scegli il tuo.
      </p>

      <div className="space-y-6">
        {adventuresData.map(adventure => {
          if (adventure.id === "ombra-nessuno") {
            return (
              <div key={adventure.id} className="flex flex-col items-center">
                <div className="relative w-full rounded-2xl overflow-hidden">
                  <img
                    src={logoOmbre}
                    alt={adventure.title}
                    className="w-full object-cover"
                  />
                  {/* Vignette overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      boxShadow: 'inset 0 0 60px 20px rgba(0,0,0,0.7)',
                    }}
                  />
                </div>
                <p className="font-label text-sm text-muted-foreground mt-3">
                  Un'avventura in solitaria a Porto Ardente
                </p>
                <p className="font-body italic text-foreground/70 leading-relaxed mt-2 text-center">
                  "{adventure.quote}"
                </p>
                <a
                  href={adventure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-sm text-accent hover:text-accent/80 transition-colors mt-3"
                >
                  Gioca →
                </a>
              </div>
            );
          }

          return (
            <div
              key={adventure.id}
              className="foleda-card p-6 relative overflow-hidden"
              style={{ borderLeft: `4px solid ${getRegionColor(adventure.regionId)}` }}
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                {adventure.title}
              </h3>
              <p className="font-label text-xs text-muted-foreground mb-1">
                {adventure.type}
              </p>
              <p className="font-label text-sm text-foreground/70 mb-3">
                Personaggio: {adventure.character} · Regione: {adventure.regionName}
              </p>
              <p className="font-body italic text-foreground/70 leading-relaxed mb-4">
                "{adventure.quote}"
              </p>
              <a
                href={adventure.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Gioca →
              </a>
            </div>
          );
        })}
      </div>

      {/* Cross-links */}
      <div className="mt-12 text-center space-y-3">
        <p className="font-body text-foreground/70">
          Non sai quale scegliere?{" "}
          <button onClick={() => onNavigate("scopri")}
            className="text-accent hover:text-accent/80 underline transition-colors">
            Scopri chi sei
          </button>
        </p>
        <p className="font-body text-foreground/70">
          Vuoi esplorare prima?{" "}
          <button onClick={() => onNavigate("esplora")}
            className="text-accent hover:text-accent/80 underline transition-colors">
            Esplora la mappa
          </button>
        </p>
      </div>

      <ComelasfogliaFooter />
    </div>
  );
};

export default AdventuresSection;