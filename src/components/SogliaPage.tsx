import { useState } from "react";
import ComelasfogliaFooter from "@/components/ComelasfogliaFooter";
import logoFoleda from "@/assets/logo-foleda.png";

interface SogliaPageProps {
  onEnter: () => void;
}

const SogliaPage = ({ onEnter }: SogliaPageProps) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative">
      <button
        onClick={onEnter}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative cursor-pointer transition-all duration-[400ms] ease-out focus:outline-none"
        style={{
          transform: hovering ? 'scale(1.03)' : 'scale(1)',
          filter: hovering
            ? 'drop-shadow(0 0 40px hsla(42, 52%, 51%, 0.5))'
            : 'drop-shadow(0 0 20px hsla(42, 52%, 51%, 0.2))',
        }}
        aria-label="Entra nella Piana dei Sette Venti"
      >
        <img
          src={logoFoleda}
          alt="Foleda - La Piana dei Sette Venti"
          className="w-72 md:w-96 h-auto"
          draggable={false}
        />
      </button>

      <p className="mt-4 text-lg md:text-xl italic font-body text-foreground/70 text-center">
        La Piana dei Sette Venti ti aspetta.
      </p>

      <div className="absolute bottom-8">
        <ComelasfogliaFooter />
      </div>
    </div>
  );
};

export default SogliaPage;
