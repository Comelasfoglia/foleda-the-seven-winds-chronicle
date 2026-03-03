import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import assessmentData from "@/data/assessment.json";
import charactersData from "@/data/characters.json";
import adventuresData from "@/data/adventures.json";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import AssessmentResult from "@/components/AssessmentResult";

type AppScreen = "soglia" | "porte" | "esplora" | "gioca" | "scopri";

interface AssessmentSectionProps {
  onNavigate: (target: AppScreen, regionId?: string) => void;
}

type Phase = "intro" | "questions" | "reveal" | "result";

interface ShuffledQuestion {
  originalIndex: number;
  scenario: string;
  area: string;
  // options in shuffled order, each carrying its original weights
  options: { text: string; weights: Record<string, number> }[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShuffledQuestions(): ShuffledQuestion[] {
  const shuffledIndices = shuffleArray(assessmentData.map((_, i) => i));
  return shuffledIndices.map(idx => {
    const q = assessmentData[idx];
    const opts = q.options as { text: string; weights: Record<string, number> }[];
    return {
      originalIndex: idx,
      scenario: q.scenario,
      area: q.area,
      options: shuffleArray(opts),
    };
  });
}

const AssessmentSection = ({ onNavigate }: AssessmentSectionProps) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>(() => buildShuffledQuestions());

  const totalQuestions = shuffledQuestions.length;
  const question = shuffledQuestions[currentQ];

  const handleStart = useCallback(() => {
    setShuffledQuestions(buildShuffledQuestions());
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
      setPhase("reveal");
      setTimeout(() => setPhase("result"), 3000);
    }
  }, [question, scores, answers, currentQ, totalQuestions]);

  const handleBack = useCallback(() => {
    if (currentQ > 0) {
      setSlideDirection("right");
      const prevAnswer = answers[currentQ - 1];
      if (prevAnswer !== undefined) {
        const prevOption = shuffledQuestions[currentQ - 1].options[prevAnswer];
        const newScores = { ...scores };
        Object.entries(prevOption.weights).forEach(([charId, weight]) => {
          newScores[charId] = (newScores[charId] || 0) - weight;
        });
        setScores(newScores);
      }
      setCurrentQ(currentQ - 1);
    }
  }, [currentQ, answers, scores, shuffledQuestions]);

  const result = useMemo(() => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    if (sorted.length === 0) return null;
    const maxScore = sorted[0][1];
    let candidates = sorted.filter(([, s]) => s === maxScore).map(([id]) => id);

    if (candidates.length > 1) {
      // Livello 1: conta i +3 (deep hits)
      const deepHits: Record<string, number> = {};
      candidates.forEach(id => { deepHits[id] = 0; });
      answers.forEach((optIdx, qIdx) => {
        if (optIdx === undefined) return;
        const option = shuffledQuestions[qIdx].options[optIdx];
        candidates.forEach(id => {
          if (option.weights[id] === 3) deepHits[id]++;
        });
      });
      const maxHits = Math.max(...candidates.map(id => deepHits[id]));
      candidates = candidates.filter(id => deepHits[id] === maxHits);
    }

    if (candidates.length > 1) {
      // Livello 2: domanda 16 (originalIndex === 15)
      const q16Idx = shuffledQuestions.findIndex(q => q.originalIndex === 15);
      if (q16Idx !== -1 && answers[q16Idx] !== undefined) {
        const q16Option = shuffledQuestions[q16Idx].options[answers[q16Idx]];
        const q16Scores: Record<string, number> = {};
        candidates.forEach(id => { q16Scores[id] = q16Option.weights[id] || 0; });
        const maxQ16 = Math.max(...candidates.map(id => q16Scores[id]));
        candidates = candidates.filter(id => q16Scores[id] === maxQ16);
      }
    }

    if (candidates.length > 1) {
      // Livello 3: il vento sceglie
      candidates = [candidates[Math.floor(Math.random() * candidates.length)]];
    }

    const first = charactersData.find(c => c.id === candidates[0]);
    return { first };
  }, [scores, answers, shuffledQuestions]);

  const handleShare = useCallback(() => {
    if (!result?.first) return;
    const text = `Nella Piana dei Sette Venti, io sono ${result.first!.name}. "${result.first!.resultQuote}" Scopri chi sei tu → ${window.location.origin}`;
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
    return (
      <AssessmentResult
        result={result}
        onNavigate={onNavigate}
        onRestart={handleStart}
        onShare={handleShare}
      />
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

      {/* Scenario — use currentQ as key to force full remount, clearing any selection state */}
      <div key={`q-${currentQ}`} className={slideDirection === "left" ? "slide-left-enter" : "slide-right-enter"}>
        <p className="font-body text-lg md:text-xl italic text-foreground leading-relaxed mb-8">
          {question.scenario}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={`${currentQ}-${idx}`}
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
