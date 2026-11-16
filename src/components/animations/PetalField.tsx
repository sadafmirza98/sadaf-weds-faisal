"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  rot: number;
  spin: number;
  flip: number;
  tint: number;
}

const TINTS = [
  ["#8E5A66", "#E8C8CB"],
  ["#741D35", "#C98A97"],
  ["#A77B82", "#F1E1DE"],
];

/**
 * Falling sakura petals on a single <canvas>.
 *  - One element regardless of petal count (no DOM churn)
 *  - Fewer petals on small screens, DPR capped for battery
 *  - Pauses when the tab is hidden; disabled for reduced motion
 */
export function PetalField({ density = 1, className }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let petals: Petal[] = [];
    let raf = 0;
    let last = performance.now();
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const spawn = (initial: boolean): Petal => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -20 - Math.random() * 80,
      size: 6 + Math.random() * 8,
      speed: 18 + Math.random() * 28,
      sway: 18 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.6,
      flip: Math.random() * Math.PI * 2,
      tint: Math.floor(Math.random() * TINTS.length),
    });

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((width < 640 ? 12 : width < 1024 ? 18 : 26) * density);
      if (petals.length > target) petals = petals.slice(0, target);
      while (petals.length < target) petals.push(spawn(true));
    };

    const drawPetal = (p: Petal) => {
      const s = p.size;
      const squash = 0.35 + Math.abs(Math.cos(p.flip)) * 0.65; // 3D tumble
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, squash);
      const [a, b] = TINTS[p.tint];
      const g = ctx.createLinearGradient(0, s, 0, -s);
      g.addColorStop(0, a);
      g.addColorStop(1, b);
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.bezierCurveTo(s * 0.9, s * 0.4, s * 0.75, -s * 0.7, s * 0.18, -s);
      ctx.lineTo(0, -s * 0.78);
      ctx.lineTo(-s * 0.18, -s);
      ctx.bezierCurveTo(-s * 0.75, -s * 0.7, -s * 0.9, s * 0.4, 0, s);
      ctx.fill();
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      const wind = Math.sin(now / 4000) * 12;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.phase += dt;
        p.y += p.speed * dt;
        p.x += (Math.sin(p.phase) * p.sway + wind) * dt;
        p.rot += p.spin * dt;
        p.flip += dt * 1.4;
        if (p.y > height + 30 || p.x < -40 || p.x > width + 40) petals[i] = spawn(false);
        drawPetal(p);
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, density]);

  // Always rendered (server and client agree); hidden and idle under reduced motion.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${className ?? "pointer-events-none fixed inset-0 z-0 h-full w-full"} motion-reduce:hidden`}
    />
  );
}
