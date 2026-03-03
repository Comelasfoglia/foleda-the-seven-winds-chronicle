import { useState, useCallback } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

interface DiceRollerProps {
  onResult: (d8: number, d6: number) => void;
}

const DiceRoller = ({ onResult }: DiceRollerProps) => {
  const [rolling, setRolling] = useState(false);
  const [d8, setD8] = useState<number | null>(null);
  const [d6, setD6] = useState<number | null>(null);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);

    // Animate through random numbers
    let count = 0;
    const interval = setInterval(() => {
      setD8(Math.floor(Math.random() * 8) + 1);
      setD6(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const finalD8 = Math.floor(Math.random() * 8) + 1;
        const finalD6 = Math.floor(Math.random() * 6) + 1;
        setD8(finalD8);
        setD6(finalD6);
        setRolling(false);
        setTimeout(() => onResult(finalD8, finalD6), 400);
      }
    }, 80);
  }, [rolling, onResult]);

  return (
    <button
      onClick={roll}
      disabled={rolling}
      className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 flex items-center gap-3 px-5 py-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 disabled:cursor-wait"
      style={{
        background: 'hsla(252, 40%, 16%, 0.95)',
        border: '1px solid hsla(42, 52%, 51%, 0.4)',
        boxShadow: '0 0 20px hsla(42, 52%, 51%, 0.2)',
      }}
      aria-label="Tira i dadi"
    >
      <div className={`flex items-center gap-2 ${rolling ? 'dice-rolling' : ''}`}>
        <span className="font-label text-sm font-medium text-primary">
          {d8 !== null ? `d8: ${d8}` : 'd8'}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="font-label text-sm font-medium text-primary">
          {d6 !== null ? `d6: ${d6}` : 'd6'}
        </span>
      </div>
      <span className="font-label text-xs text-muted-foreground">
        🎲 Tira
      </span>
    </button>
  );
};

export default DiceRoller;