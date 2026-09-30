"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/animations";

const DPR_CAP = 2;
const TRAIL_LIFE = 650;
const TRAIL_MAX = 16;

type TrailPoint = { x: number; y: number; t: number };

export default function TrailLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isReducedMotion()) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const acid = style.getPropertyValue("--acid").trim() || "#d8ff4f";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let frame = 0;
    const trails = new Map<number, TrailPoint[]>();

    const resize = (): void => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      trails.clear();
    };

    const push = (id: number, x: number, y: number): void => {
      let trail = trails.get(id);
      if (!trail) {
        trail = [];
        trails.set(id, trail);
      }
      trail.push({ x, y, t: performance.now() });
      while (trail.length > TRAIL_MAX) trail.shift();
    };

    const draw = (time: number): void => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = acid;
      ctx.lineCap = "round";
      for (const points of trails.values()) {
        for (let i = 1; i < points.length; i += 1) {
          const prev = points[i - 1];
          const curr = points[i];
          const age = (time - curr.t) / TRAIL_LIFE;
          if (age >= 1) continue;
          ctx.globalAlpha = (1 - age) * 0.5;
          ctx.lineWidth = 1 + (1 - age) * 2.5;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      for (const [id, points] of trails) {
        while (points.length > 0 && time - points[0].t > TRAIL_LIFE) points.shift();
        if (points.length === 0) trails.delete(id);
      }
    };

    const tick = (time: number): void => {
      frame = requestAnimationFrame(tick);
      if (!document.hidden) draw(time);
    };

    const onTouchStart = (event: TouchEvent): void => {
      for (const touch of event.changedTouches) {
        push(touch.identifier, touch.clientX, touch.clientY);
      }
    };
    const onTouchMove = (event: TouchEvent): void => {
      for (const touch of event.changedTouches) {
        push(touch.identifier, touch.clientX, touch.clientY);
      }
    };
    const onTouchEnd = (event: TouchEvent): void => {
      for (const touch of event.changedTouches) {
        const trail = trails.get(touch.identifier);
        if (trail) push(touch.identifier, trail[trail.length - 1].x, trail[trail.length - 1].y);
      }
    };

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      trails.clear();
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
      }}
    />
  );
}
