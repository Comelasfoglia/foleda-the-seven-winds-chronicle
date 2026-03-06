import { Home } from "lucide-react";
import WhatIsFoleda from "@/components/WhatIsFoleda";

type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

interface NavBarProps {
  current: AppScreen;
  onNavigate: (target: AppScreen) => void;
}

const navItems: { id: AppScreen; label: string }[] = [
  { id: "esplora", label: "Esplora" },
  { id: "gioca", label: "Gioca" },
  { id: "scopri", label: "Scopri chi sei" },
];

const NavBar = ({ current, onNavigate }: NavBarProps) => {
  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center px-6 py-3 gap-6"
        style={{ background: 'hsla(252, 40%, 12%, 0.95)', borderBottom: '1px solid hsla(42, 52%, 51%, 0.15)' }}>
        <button
          onClick={() => onNavigate("soglia" as AppScreen)}
          className="text-muted-foreground hover:text-foreground transition-colors mr-2"
          aria-label="Home"
        >
          <Home size={18} />
        </button>
        <button
          onClick={() => onNavigate("porte")}
          className="font-label text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Le Tre Porte
        </button>
        <div className="flex-1" />
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`font-label text-sm transition-colors px-3 py-1.5 rounded ${
              current === item.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
        <WhatIsFoleda />
      </nav>

      {/* Mobile tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-2"
        style={{ background: 'hsla(252, 40%, 12%, 0.98)', borderTop: '1px solid hsla(42, 52%, 51%, 0.15)' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`font-label text-xs transition-colors px-3 py-2 rounded flex-1 text-center ${
              current === item.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
        <WhatIsFoleda />
      </nav>
    </>
  );
};

export default NavBar;