import { useState, useCallback, useMemo } from "react";
import assessmentData from "@/data/assessment.json";
import charactersData from "@/data/characters.json";
import adventuresData from "@/data/adventures.json";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";

type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

interface AssessmentSectionProps {
  onNavigate: (target: AppScreen, regionId?: string) => void;
}

type Phase = "intro" | "questions" | "reveal" | "result";

const AssessmentSection = ({ onNavigate }: AssessmentSectionProps) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const totalQuestions = assessmentData.length;
  const question = assessmentData[currentQ];

  const handleStart = useCallback(() => {
    setPhase("questions");
    setCurrentQ(0);
    setAnswers([]);
    setScores({});
  }, []);

  const handleAnswer = useCallback((optionIdx: number) => {
    const option = question.options[optionIdx];
    const newScores = { ...scores };
    Object.entries(option.weights).forEach(([charId, weight]) => {
      newScores[charId] = (newScores[charId] || 0) + weight;
    });
    setScores(newScores);

    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIdx;
    setAnswers(newAnswers);

    if (currentQ < totalQuestions - 1) {
      setSlideDirection("left");
      setCurrentQ(currentQ + 1);
    } else {
      // Show reveal
      setPhase("reveal");
      setTimeout(() => setPhase("result"), 3000);
    }
  }, [question, scores, answers, currentQ, totalQuestions]);

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      setSlideDirection("right");
      // Undo scores from previous answer
      const prevAnswer = answers[currentQ - 1];
      if (prevAnswer !== undefined) {
        const prevOption = assessmentData[currentQ - 1].options[prevAnswer];
        const newScores = { ...scores };
        Object.entries(prevOption.weights).forEach(([charId, weight]) => {
          newScores[charId] = (newScores[charId] || 0) - weight;
        });
        setScores(newScores);
      }
      setCurrentQ(currentQ - 1);
    }
  }, [currentQ, answers, scores]);

  // Calculate result
  const result = useMemo(() => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length === 0) return null;
    const [firstId, firstScore] = sorted[0];
    const [secondId, secondScore] = sorted.length > 1 ? sorted[1] : [null, 0];
    const isTie = secondId && firstScore - secondScore < 3;

    const first = charactersData.find(c => c.id === firstId);
    const second = isTie ? charactersData.find(c => c.id === secondId) : null;

    return { first, second, isTie };
  }, [scores]);

  const handleShare = useCallback(() => {
    if (!result?.first) return;
    const text = `Nella Piana dei Sette Venti, io sono ${result.first.name}. "${result.first.resultQuote}" Scopri chi sei tu → ${window.location.origin}`;
    navigator.clipboard.writeText(text);
  }, [result]);

  // INTRO
  if (phase === "intro") {
    return (
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-8">
          Scopri Chi Sei
        </h2>
        <blockquote className="font-body text-lg italic text-foreground/80 leading-relaxed mb-10">
          "La Piana dei Sette Venti ha otto storie da raccontare, e una di queste è la tua.
          Non ti chiederemo chi vuoi essere — ti chiederemo chi sei sempre stato.
          Rispondi col primo istinto. Il vento farà il resto."
        </blockquote>
        <button
          onClick={handleStart}
          className="foleda-card foleda-glow-hover px-8 py-3 font-display text-xl text-foreground cursor-pointer"
        >
          Comincia
        </button>
      </div>
    );
  }

  // REVEAL
  if (phase === "reveal") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="font-display text-2xl text-primary mb-4 animate-fade-in">
          La Piana ha deciso.
        </p>
        <p className="font-display text-xl text-foreground/70 italic animate-fade-in"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}>
          Tu sei…
        </p>
      </div>
    );
  }

  // RESULT
  if (phase === "result" && result?.first) {
    const firstAdventure = result.first.adventureId
      ? adventuresData.find(a => a.id === result.first!.adventureId)
      : null;

    return (
      <div className="max-w-xl mx-auto px-4 text-center">
        {result.isTie && result.second ? (
          <>
            <p className="font-body italic text-foreground/70 mb-6">
              La Piana esita. Sei a metà strada tra{" "}
              <span style={{ color: 'hsl(175, 55%, 60%)' }}>{result.first.name}</span> e{" "}
              <span style={{ color: 'hsl(175, 55%, 60%)' }}>{result.second.name}</span>{" "}
              — il vento che ti porterà non ha ancora deciso da che parte soffiare.
            </p>
            {[result.first, result.second].map(char => (
              <div key={char.id} className="foleda-card p-6 mb-4 text-left">
                <h3 className="font-display text-2xl font-bold mb-1"
                  style={{ color: 'hsl(175, 55%, 60%)' }}>
                  {char.name}
                </h3>
                <p className="font-label text-sm text-muted-foreground mb-3">{char.regionName}</p>
                <p className="font-body italic text-foreground/80">"{char.resultQuote}"</p>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-2 animate-scale-in"
              style={{ color: 'hsl(175, 55%, 60%)' }}>
              {result.first.name}
            </h2>
            <p className="font-label text-sm text-muted-foreground mb-6">{result.first.regionName}</p>
            <p className="font-body text-xl italic text-foreground/80 leading-relaxed mb-10">
              "{result.first.resultQuote}"
            </p>
          </>
        )}

        {/* Actions */}
        <div className="space-y-3 mt-8">
          {firstAdventure && (
            <a href={firstAdventure.url} target="_blank" rel="noopener noreferrer"
              className="block font-label text-sm text-accent hover:text-accent/80 transition-colors">
              🎲 Gioca la sua avventura →
            </a>
          )}
          <button
            onClick={() => onNavigate("esplora", result.first!.regionId)}
            className="block w-full font-label text-sm text-accent hover:text-accent/80 transition-colors"
          >
            🗺️ Esplora la sua regione →
          </button>
          <button onClick={handleStart}
            className="block w-full font-label text-sm text-muted-foreground hover:text-foreground transition-colors">
            🔄 Rifai il test
          </button>
          <button onClick={handleShare}
            className="block w-full font-label text-sm text-muted-foreground hover:text-foreground transition-colors">
            📋 Condividi (copia testo)
          </button>
        </div>
      </div>
    );
  }

  // QUESTIONS
  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Progress */}
      <div className="mb-2">
        <Progress value={((currentQ + 1) / totalQuestions) * 100}
          className="h-1 bg-secondary [&>div]:bg-primary" />
      </div>
      <p className="font-label text-xs text-primary/60 mb-8 text-right">
        {currentQ + 1}/{totalQuestions}
      </p>

      {/* Back button */}
      {currentQ > 0 && (
        <button onClick={handleBack}
          className="font-label text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-1">
          <ChevronLeft size={14} /> Indietro
        </button>
      )}

      {/* Scenario */}
      <div key={currentQ} className={slideDirection === "left" ? "slide-left-enter" : "slide-right-enter"}>
        <p className="font-body text-lg md:text-xl italic text-foreground leading-relaxed mb-8">
          {question.scenario}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="foleda-card foleda-glow-hover w-full p-4 md:p-5 text-left cursor-pointer"
            >
              <p className="font-body text-sm md:text-base text-foreground/90 leading-relaxed">
                {option.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentSection;