import { useRef, useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FormattedText from "@/components/FormattedText";

interface SubLocation {
  number: number;
  name: string;
  description: string;
}

interface SubLocationBalloonProps {
  subLocation: SubLocation;
  regionName: string;
  regionDirection: string;
  hotspot: { x: number; y: number };
  containerRect: DOMRect | null;
  totalCount: number;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

const SubLocationBalloon = ({
  subLocation,
  regionName,
  regionDirection,
  hotspot,
  containerRect,
  totalCount,
  currentIndex,
  onPrev,
  onNext,
  onClose,
}: SubLocationBalloonProps) => {
  const isMobile = useIsMobile();
  const balloonRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (balloonRef.current && !balloonRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (isMobile) {
    // Bottom sheet on mobile
    return (
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          ref={balloonRef}
          className="absolute bottom-0 left-0 right-0 max-h-[50vh] overflow-y-auto rounded-t-xl p-5"
          style={{
            background: 'hsla(262, 35%, 15%, 0.97)',
            border: '1px solid hsla(42, 52%, 51%, 0.4)',
            borderBottom: 'none',
            animation: 'slideUp 200ms ease forwards',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="font-display text-3xl font-bold text-primary">{subLocation.number}</span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X size={18} />
            </button>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">{subLocation.name}</h3>
          <p className="font-label text-xs text-primary/60 mb-4">{regionName} · {regionDirection}</p>
          <FormattedText text={subLocation.description} className="font-body text-foreground/90 leading-relaxed text-sm mb-4" />
          <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid hsla(42, 52%, 51%, 0.15)' }}>
            {currentIndex > 0 ? (
              <button onClick={onPrev} className="font-label text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ChevronLeft size={12} /> Precedente
              </button>
            ) : <div />}
            {currentIndex < totalCount - 1 ? (
              <button onClick={onNext} className="font-label text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                Successivo <ChevronRight size={12} />
              </button>
            ) : <div />}
          </div>
        </div>
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Desktop: positioned balloon
  if (!containerRect) return null;

  const hx = containerRect.left + (hotspot.x / 100) * containerRect.width;
  const hy = containerRect.top + (hotspot.y / 100) * containerRect.height;
  const balloonW = 320;
  const balloonH = 280;
  const gap = 16;

  // Decide position
  let left = hx + gap;
  let top = hy - balloonH / 2;
  let arrowSide: "left" | "right" | "top" | "bottom" = "left";

  // If goes off right, put left
  if (left + balloonW > window.innerWidth - 16) {
    left = hx - balloonW - gap;
    arrowSide = "right";
  }
  // If goes off left, put below
  if (left < 16) {
    left = hx - balloonW / 2;
    top = hy + gap;
    arrowSide = "top";
  }
  // Clamp top
  if (top < 16) top = 16;
  if (top + balloonH > window.innerHeight - 16) top = window.innerHeight - balloonH - 16;
  // Clamp left
  if (left < 16) left = 16;

  return (
    <div
      ref={balloonRef}
      className="fixed z-50 overflow-y-auto"
      style={{
        left,
        top,
        width: balloonW,
        maxHeight: balloonH,
        background: 'hsla(262, 35%, 15%, 0.97)',
        border: '1px solid hsla(42, 52%, 51%, 0.4)',
        borderRadius: 8,
        boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.5)',
        padding: 16,
        animation: 'fadeIn 200ms ease forwards',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-display text-3xl font-bold text-primary">{subLocation.number}</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X size={16} />
        </button>
      </div>
      <h3 className="font-display text-lg font-bold text-foreground mb-1">{subLocation.name}</h3>
      <p className="font-label text-xs text-primary/60 mb-3">{regionName} · {regionDirection}</p>
      <FormattedText text={subLocation.description} className="font-body text-foreground/90 leading-relaxed text-sm mb-3" />
      <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid hsla(42, 52%, 51%, 0.15)' }}>
        {currentIndex > 0 ? (
          <button onClick={onPrev} className="font-label text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronLeft size={12} /> Precedente
          </button>
        ) : <div />}
        {currentIndex < totalCount - 1 ? (
          <button onClick={onNext} className="font-label text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            Successivo <ChevronRight size={12} />
          </button>
        ) : <div />}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SubLocationBalloon;
