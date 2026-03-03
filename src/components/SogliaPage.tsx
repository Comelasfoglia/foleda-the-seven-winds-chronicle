import { useState } from "react";

interface SogliaPageProps {
  onEnter: () => void;
}

const SogliaPage = ({ onEnter }: SogliaPageProps) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative">
      {/* Logo placeholder */}
      <button
        onClick={onEnter}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative cursor-pointer transition-all duration-[400ms] ease-out focus:outline-none group"
        style={{
          transform: hovering ? 'scale(1.03)' : 'scale(1)',
        }}
        aria-label="Entra nella Piana dei Sette Venti"
      >
        {/* Logo container with glow */}
        <div
          className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center relative"
          style={{
            background: 'radial-gradient(circle, hsla(175, 45%, 55%, 0.15) 0%, transparent 70%)',
            boxShadow: hovering
              ? '0 0 60px hsla(42, 52%, 51%, 0.4), 0 0 120px hsla(42, 52%, 51%, 0.15)'
              : '0 0 40px hsla(42, 52%, 51%, 0.15), 0 0 80px hsla(42, 52%, 51%, 0.05)',
          }}
        >
          {/* Spiral decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
              <path
                d="M100 30 C140 30, 170 60, 170 100 C170 140, 140 170, 100 170 C60 170, 40 150, 40 120 C40 90, 60 70, 85 70 C110 70, 125 85, 125 105 C125 125, 110 135, 95 135"
                fill="none"
                stroke="hsl(42, 52%, 51%)"
                strokeWidth="2"
              />
            </svg>
          </div>
          {/* Logo text */}
          <div className="text-center relative z-10">
            <h1
              className="font-display text-6xl md:text-7xl font-bold tracking-wide"
              style={{ color: 'hsl(175, 55%, 60%)' }}
            >
              Foleda
            </h1>
          </div>
        </div>
      </button>

      {/* Evocative phrase */}
      <p className="mt-8 text-lg md:text-xl italic font-body text-foreground/70 text-center">
        La Piana dei Sette Venti ti aspetta.
      </p>

      {/* Footer */}
      <footer className="absolute bottom-8 font-label text-sm text-muted-foreground/50 tracking-wider">
        Comelasfoglia Studios
      </footer>
    </div>
  );
};

export default SogliaPage;