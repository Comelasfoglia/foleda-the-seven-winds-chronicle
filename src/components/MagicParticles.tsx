import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseSize: number;
  baseSpeedX: number;
  baseSpeedY: number;
  opacity: number;
  fadeDir: number;
  hue: number;
}

interface MagicParticlesProps {
  intensity?: number;
}

const BASE_COUNT = 60;
const MAX_COUNT = 120;

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    baseSize: Math.random() * 2.5 + 0.8,
    baseSpeedX: (Math.random() - 0.5) * 0.3,
    baseSpeedY: (Math.random() - 0.5) * 0.25 - 0.1,
    opacity: Math.random() * 0.5,
    fadeDir: Math.random() > 0.5 ? 1 : -1,
    hue: Math.random() > 0.6 ? 42 : 175,
  };
}

const MagicParticles = ({ intensity = 0 }: MagicParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const intensityRef = useRef(0); // smooth current intensity
  const targetIntensityRef = useRef(0);

  // Update target intensity
  useEffect(() => {
    targetIntensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < BASE_COUNT; i++) {
      particles.push(createParticle(canvas.width, canvas.height));
    }
    particlesRef.current = particles;

    const draw = () => {
      // Smooth interpolation toward target
      const target = targetIntensityRef.current;
      const current = intensityRef.current;
      intensityRef.current += (target - current) * 0.02;
      const t = intensityRef.current;

      // Adjust particle count
      const desiredCount = Math.round(BASE_COUNT + (MAX_COUNT - BASE_COUNT) * t);
      while (particles.length < desiredCount) {
        particles.push(createParticle(canvas.width, canvas.height));
      }
      while (particles.length > desiredCount) {
        particles.pop();
      }

      const maxOpacity = 0.6 + t * 0.25;
      const sizeMultiplier = 1 + t * 0.5;
      const windBias = t * 1.5;
      const turbulence = t * 0.8;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const speedX = p.baseSpeedX + windBias + (Math.random() - 0.5) * turbulence;
        const speedY = p.baseSpeedY + (Math.random() - 0.5) * turbulence * 0.4;
        p.x += speedX;
        p.y += speedY;
        p.opacity += p.fadeDir * 0.003;

        if (p.opacity >= maxOpacity) p.fadeDir = -1;
        if (p.opacity <= 0.05) p.fadeDir = 1;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const size = p.baseSize * sizeMultiplier;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        const sat = p.hue === 42 ? "52%" : "45%";
        const light = p.hue === 42 ? "60%" : "60%";
        ctx.fillStyle = `hsla(${p.hue}, ${sat}, ${light}, ${p.opacity})`;
        ctx.shadowBlur = 8 + t * 6;
        ctx.shadowColor = `hsla(${p.hue}, ${sat}, ${light}, ${p.opacity * 0.5})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default MagicParticles;
