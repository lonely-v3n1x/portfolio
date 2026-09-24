"use client";

import { useEffect, useRef } from "react";

type Streak = { x: number; y: number; length: number; speed: number; width: number };
type Flash = { x: number; y: number; age: number };

export default function SpeedLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hero = canvas.closest<HTMLElement>("[data-speedhero]");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let streaks: Streak[] = [];
    let flashes: Flash[] = [];
    let pointerX = 0.5;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(width / 46);
      streaks = Array.from({ length: count }, () => ({
        length: 60 + Math.random() * 200,
        speed: 9 + Math.random() * 16,
        width: Math.random() < 0.12 ? 2.5 : 1,
        x: Math.random() * (width + 300),
        y: Math.random() * height,
      }));
    };
    resize();

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / Math.max(1, rect.width);
      const now = performance.now();
      if (lastPX) {
        const traveled = Math.hypot(event.clientX - lastPX, event.clientY - lastPY);
        const elapsed = Math.max(1, now - lastPT);
        velocity += ((traveled / elapsed) * 2.2 - velocity) * 0.12;
      }
      lastPX = event.clientX;
      lastPY = event.clientY;
      lastPT = now;
    };
    const onDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      flashes.push({ age: 0, x: event.clientX - rect.left, y: event.clientY - rect.top });
      const flash = hero?.querySelector<HTMLElement>("[data-impact-flash]");
      if (flash) {
        flash.animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 480, easing: "ease-out" });
      }
      if (hero && !reducedMotion) {
        hero.animate(
          [{ transform: "translate(0,0)" }, { transform: "translate(-7px,2px)" }, { transform: "translate(5px,-3px)" }, { transform: "translate(0,0)" }],
          { duration: 220 },
        );
      }
    };

    let last = performance.now();
    let lastPX = 0;
    let lastPY = 0;
    let lastPT = 0;
    let velocity = 0;
    const loop = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      velocity *= 0.94;
      const boost = (0.6 + pointerX * 1.1) * (1 + Math.min(velocity, 3));
      streaks.forEach((streak) => {
        streak.x -= streak.speed * boost * delta * 60 * 0.28;
        if (streak.x + streak.length < -20) {
          streak.x = width + 40 + Math.random() * 200;
          streak.y = Math.random() * height;
        }
        const gradient = ctx.createLinearGradient(streak.x, 0, streak.x + streak.length, 0);
        gradient.addColorStop(0, "rgba(255,49,49,0)");
        gradient.addColorStop(1, "rgba(255,255,255,0.34)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = streak.width;
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(streak.x + streak.length, streak.y - streak.length * 0.12);
        ctx.stroke();
      });
      flashes = flashes.filter((flash) => {
        flash.age += delta;
        if (flash.age > 0.45) return false;
        const progress = flash.age / 0.45;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, 14 + progress * 130, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,49,49,${0.85 * (1 - progress)})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        return true;
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    (hero ?? canvas).addEventListener("pointerdown", onDown);
    if (!reducedMotion) {
      raf = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      (hero ?? canvas).removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas aria-hidden="true" className="speedlines" ref={canvasRef} />;
}
