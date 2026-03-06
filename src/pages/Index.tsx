import { useState, useCallback } from "react";
import SogliaPage from "@/components/SogliaPage";
import PortePage from "@/components/PortePage";
import NavBar from "@/components/NavBar";
import MapSection from "@/components/MapSection";
import AdventuresSection from "@/components/AdventuresSection";
import AssessmentSection from "@/components/AssessmentSection";
import MagicParticles from "@/components/MagicParticles";

type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>("soglia");
  const [fadeOut, setFadeOut] = useState(false);
  const [targetRegionId, setTargetRegionId] = useState<string | null>(null);
  const [windIntensity, setWindIntensity] = useState(0);

  const transitionTo = useCallback((target: AppScreen) => {
    if (target !== "scopri") setWindIntensity(0);
    setFadeOut(true);
    setTimeout(() => {
      setScreen(target);
      setFadeOut(false);
    }, 500);
  }, []);

  const navigateTo = useCallback((target: AppScreen, regionId?: string) => {
    if (regionId) setTargetRegionId(regionId);
    else setTargetRegionId(null);
    transitionTo(target);
  }, [transitionTo]);

  return (
    <div className="min-h-screen bg-background texture-wood vignette relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, hsl(252, 40%, 14%) 0%, hsl(270, 30%, 18%) 100%)' }}>
      <MagicParticles intensity={windIntensity} />
      <div className={`relative z-10 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        {screen === "soglia" && (
          <SogliaPage onEnter={() => transitionTo("porte")} />
        )}

        {screen === "porte" && (
          <PortePage onNavigate={navigateTo} />
        )}

        {(screen === "esplora" || screen === "gioca" || screen === "scopri") && (
          <>
            <NavBar current={screen} onNavigate={navigateTo} />
            <main className="pt-16 md:pt-20 pb-20 md:pb-8">
              {screen === "esplora" && (
                <MapSection targetRegionId={targetRegionId} onClearTarget={() => setTargetRegionId(null)} />
              )}
              {screen === "gioca" && (
                <AdventuresSection onNavigate={navigateTo} />
              )}
              {screen === "scopri" && (
                <AssessmentSection onNavigate={navigateTo} onWindChange={setWindIntensity} />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;