"use client";

import { useRef } from "react";
import { useGSAP, isReducedMotion } from "@/lib/animations";

/** Mirrors the WebGL fallback rule in ThreeField: 2D owns everything under this width. */
const COARSE_MAX_WIDTH = 820;
const DPR_CAP = 2;
const AREA_PER_PARTICLE = 3400;
const MIN_PARTICLES = 48;
const MAX_PARTICLES = 210;
const STIR_RADIUS = 132;
const STIR_PUSH = 2.4;
const STIR_SPIN = 0.55;
const VELOCITY_CAP = 14;
const DRAG = 0.94;
const DRIFT = 0.05;
const RIPPLE_LIFE = 900;
const RIPPLE_REACH = 190;
const MAX_RIPPLES = 5;
const EDGE = 8;

type Tint = { r: number; g: number; b: number };
type Point = { x: number; y: number };

type Particle = Point & {
  vx: number;
  vy: number;
  r: number;
  tint: Tint;
  alpha: number;
};

type Ripple = Point & { born: number };

type Blob = {
  px: number;
  py: number;
  rx: number;
  ry: number;
  stop: number;
  tint: Tint;
  alpha: number;
};

function parseHex(raw: string, fallback: Tint): Tint {
  const hex = raw.trim().replace("#", "");
  const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return fallback;
  const int = Number.parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function token(style: CSSStyleDeclaration, name: string, fallback: Tint): Tint {
  return parseHex(style.getPropertyValue(name), fallback);
}

function mix(a: Tint, b: Tint, t: number): Tint {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function rgba(tint: Tint, alpha: number): string {
  return `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${alpha})`;
}

/** Mirrors the three CSS radial gradients the desktop field paints, so the brand survives. */
function paintBlob(ctx: CanvasRenderingContext2D, w: number, h: number, blob: Blob): void {
  const cx = blob.px * w;
  const cy = blob.py * h;
  const rx = (blob.rx / 2) * w;
  const ry = (blob.ry / 2) * h;
  if (rx < 1 || ry < 1) return;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  grad.addColorStop(0, rgba(blob.tint, blob.alpha));
  grad.addColorStop(blob.stop, rgba(blob.tint, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function density(w: number, h: number): number {
  const scaled = Math.round((w * h) / AREA_PER_PARTICLE);
  return Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, scaled));
}

export default function TouchField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = isReducedMotion();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const base = document.createElement("canvas");
    const baseCtx = base.getContext("2d", { alpha: false });
    mount.appendChild(canvas);

    if (!ctx || !baseCtx) {
      canvas.remove();
      return;
    }

    const root = getComputedStyle(document.documentElement);
    const night = token(root, "--night", { r: 12, g: 12, b: 17 });
    const paper = token(root, "--paper", { r: 243, g: 240, b: 232 });
    const acid = token(root, "--acid", { r: 216, g: 255, b: 79 });
    const cobalt = token(root, "--cobalt", { r: 67, g: 87, b: 255 });
    const red = token(root, "--red", { r: 255, g: 49, b: 49 });

    const blobs: Blob[] = [
      { px: 0.2, py: 0.14, rx: 1.2, ry: 0.92, stop: 0.62, tint: cobalt, alpha: 0.32 },
      { px: 0.82, py: 0.78, rx: 0.88, ry: 0.7, stop: 0.64, tint: acid, alpha: 0.16 },
      { px: 0.52, py: 0.46, rx: 0.7, ry: 0.6, stop: 0.72, tint: red, alpha: 0.12 },
    ];

    let dpr = 1;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let frame = 0;
    let last = 0;
    let onScreen = false;
    let visible = false;
    const pointers = new Map<number, Point>();

    const eligible = () => window.innerWidth < COARSE_MAX_WIDTH;
    const live = () => !reduced && onScreen && !document.hidden && frame !== 0;

    const paintBase = () => {
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.globalCompositeOperation = "source-over";
      baseCtx.globalAlpha = 1;
      baseCtx.fillStyle = rgba(night, 1);
      baseCtx.fillRect(0, 0, w, h);
      for (const blob of blobs) paintBlob(baseCtx, w, h, blob);
    };

    const seed = (count: number) => {
      particles = [];
      for (let i = 0; i < count; i += 1) {
        const tint = mix(paper, acid, Math.pow(Math.random(), 2.2) * 0.85);
        const tinted = Math.random() > 0.9 ? mix(tint, cobalt, 0.6) : tint;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          r: 0.7 + Math.random() * 1.7,
          tint: tinted,
          alpha: 0.25 + Math.random() * 0.5,
        });
      }
    };

    const resize = () => {
      if (!eligible()) {
        particles = [];
        ripples = [];
        return;
      }
      const box = mount.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) return;
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      w = box.width;
      h = box.height;

      for (const target of [canvas, base]) {
        target.width = Math.round(w * dpr);
        target.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      paintBase();
      seed(density(w, h));
      ripples = [];
      if (reduced) draw(0);
    };

    const step = (dt: number) => {
      const decay = Math.pow(DRAG, dt * 60);
      for (const p of particles) {
        p.vx *= decay;
        p.vy *= decay;
        p.vy -= DRIFT * dt;
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;

        if (p.y < -EDGE) {
          p.y = h + EDGE;
          p.x = Math.random() * w;
        } else if (p.y > h + EDGE) {
          p.y = -EDGE;
          p.x = Math.random() * w;
        }
        if (p.x < -EDGE) p.x = w + EDGE;
        else if (p.x > w + EDGE) p.x = -EDGE;

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > VELOCITY_CAP) {
          p.vx = (p.vx / speed) * VELOCITY_CAP;
          p.vy = (p.vy / speed) * VELOCITY_CAP;
        }
      }
    };

    const draw = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(base, 0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = rgba(p.tint, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba(acid, 1);
      ctx.lineWidth = 1.5;
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        const t = (time - ripple.born) / RIPPLE_LIFE;
        if (t >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = (1 - t) * 0.85;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, (1 - (1 - t) ** 3) * RIPPLE_REACH, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last === 0 ? 1 / 60 : Math.min((time - last) / 1000, 1 / 20);
      last = time;
      step(dt);
      draw(time);
    };

    const sync = () => {
      const next = eligible();
      if (next !== visible) {
        visible = next;
        canvas.style.visibility = next ? "visible" : "hidden";
      }
      if (!next) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        return;
      }
      const running = !reduced && onScreen && !document.hidden;
      if (running === (frame !== 0)) return;
      if (running) {
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    };

    const localPoint = (clientX: number, clientY: number): Point | null => {
      const box = mount.getBoundingClientRect();
      if (clientX < box.left || clientX > box.right) return null;
      if (clientY < box.top || clientY > box.bottom) return null;
      return { x: clientX - box.left, y: clientY - box.top };
    };

    const spawn = (point: Point) => {
      ripples.push({ x: point.x, y: point.y, born: performance.now() });
      while (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    const stir = (point: Point, vx: number, vy: number) => {
      for (const p of particles) {
        const dx = p.x - point.x;
        const dy = p.y - point.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > STIR_RADIUS) continue;
        const falloff = 1 - dist / STIR_RADIUS;
        const nx = dx / dist;
        const ny = dy / dist;
        p.vx += (nx * STIR_PUSH - ny * vy * STIR_SPIN) * falloff;
        p.vy += (ny * STIR_PUSH + nx * vx * STIR_SPIN) * falloff;
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!live()) return;
      for (const touch of event.changedTouches) {
        const point = localPoint(touch.clientX, touch.clientY);
        if (!point) continue;
        pointers.set(touch.identifier, point);
        spawn(point);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!live()) return;
      for (const touch of event.changedTouches) {
        const point = localPoint(touch.clientX, touch.clientY);
        const previous = pointers.get(touch.identifier);
        if (!point || !previous) continue;
        stir(point, (point.x - previous.x) * 0.35, (point.y - previous.y) * 0.35);
        pointers.set(touch.identifier, point);
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      for (const touch of event.changedTouches) pointers.delete(touch.identifier);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !live()) return;
      const point = localPoint(event.clientX, event.clientY);
      if (point) spawn(point);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !live()) return;
      const point = localPoint(event.clientX, event.clientY);
      if (point) stir(point, 0, 0);
    };

    if (!reduced) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const gate = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    gate.observe(mount);

    const boxWatcher = new ResizeObserver(() => {
      resize();
      sync();
    });
    boxWatcher.observe(mount);

    resize();
    sync();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      gate.disconnect();
      boxWatcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      pointers.clear();
      particles = [];
      ripples = [];
      canvas.remove();
    };
  });

  return (
    <div className="fieldTouch" ref={mountRef} aria-hidden="true">
      <style jsx>{`
        .fieldTouch {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .fieldTouch :global(canvas) {
          display: block;
          width: 100%;
          height: 100%;
          visibility: hidden;
        }
      `}</style>
    </div>
  );
}
