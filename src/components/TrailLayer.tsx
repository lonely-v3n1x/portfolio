"use client";

import { useEffect, useRef, useState } from "react";
import { isReducedMotion } from "@/lib/animations";

const DPR_CAP = 2;
const TRAIL_LIFE = 650;
const TRAIL_MAX = 16;
const HEADER_CLEAR = 76;

type TrailPoint = { x: number; y: number; t: number };

export default function TrailLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isReducedMotion()) return;
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

    // Touch coords are visual-viewport relative; the canvas spans the
    // layout viewport. Map live or trails drift when chrome shows/hides.
    const toCanvas = (clientX: number, clientY: number): { x: number; y: number } => {
      const vv = window.visualViewport;
      if (!vv) return { x: clientX, y: clientY };
      return {
        x: vv.offsetLeft + clientX * vv.scale,
        y: vv.offsetTop + clientY * vv.scale,
      };
    };

    const resize = (): void => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      if (nextW === w && nextH === h && nextDpr === dpr && canvas.width > 0) return;
      dpr = nextDpr;
      w = nextW;
      h = nextH;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
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
          if (prev.y < HEADER_CLEAR && curr.y < HEADER_CLEAR) continue;
          const age = (time - curr.t) / TRAIL_LIFE;
          if (age >= 1) continue;
          ctx.globalAlpha = (1 - age) * 0.6;
          ctx.lineWidth = 1.2 + (1 - age) * 2.8;
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
        const at = toCanvas(touch.clientX, touch.clientY);
        push(touch.identifier, at.x, at.y);
      }
    };
    const onTouchMove = (event: TouchEvent): void => {
      for (const touch of event.changedTouches) {
        const at = toCanvas(touch.clientX, touch.clientY);
        push(touch.identifier, at.x, at.y);
      }
    };
    const onTouchEnd = (event: TouchEvent): void => {
      for (const touch of event.changedTouches) {
        const trail = trails.get(touch.identifier);
        if (trail) push(touch.identifier, trail[trail.length - 1].x, trail[trail.length - 1].y);
      }
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      const at = toCanvas(event.clientX, event.clientY);
      push(event.pointerId, at.x, at.y);
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      const at = toCanvas(event.clientX, event.clientY);
      push(event.pointerId, at.x, at.y);
    };

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      trails.clear();
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
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
        zIndex: 200,
        pointerEvents: "none",
      }}
    />
  );
}
