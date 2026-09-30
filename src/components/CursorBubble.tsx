"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";

// Season-02 port of the main branch reticle cursor: a 64px bubble trailing
// the pointer at a slight offset, red diamond reticle, dot, and a label tag
// on interactive elements. Native cursor stays visible; this rides along.
const CURSOR_CSS = `
.cursor-bubble { height: 64px; left: 0; pointer-events: none; position: fixed; top: 0; width: 64px; z-index: 1000; opacity: 0; visibility: hidden; }
.cursor-reticle { animation: cursor-reticle-spin 7s linear infinite; border: 2px solid var(--red); inset: 12px; position: absolute; transform: rotate(45deg); transition: border-color 180ms ease, inset 180ms ease; }
.cursor-dot { background: var(--paper); border-radius: 50%; height: 5px; left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 5px; }
.cursor-tag { background: var(--night); border: 1px solid var(--red); color: var(--paper); font-family: var(--font-dm-mono); font-size: 0.5rem; left: 50%; letter-spacing: 0.08em; opacity: 0; padding: 3px 7px; position: absolute; text-transform: uppercase; top: calc(100% + 4px); transform: translateX(-50%); transition: opacity 180ms ease; white-space: nowrap; }
.cursor-bubble.is-hot .cursor-reticle { border-color: var(--acid); inset: 4px; }
.cursor-bubble.is-hot .cursor-tag { opacity: 1; }
@keyframes cursor-reticle-spin { to { transform: rotate(405deg); } }
@media (pointer: coarse) { .cursor-bubble { display: none; } }
@media (prefers-reduced-motion: reduce) { .cursor-bubble { display: none; } }
`;

export default function CursorBubble() {
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = bubble.current;
    if (!element) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tag = element.querySelector<HTMLElement>(".cursor-tag");
    let idleFloat: gsap.core.Tween | null = null;
    let idleTimer: ReturnType<typeof gsap.delayedCall> | null = null;
    let hovering = false;
    let resting = false;
    let shown = false;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    gsap.set(element, { autoAlpha: 0, scale: 0.55, xPercent: -50, yPercent: -50 });
    const moveX = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3" });
    const moveY = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3" });

    const setState = (active: boolean): void => {
      gsap.killTweensOf(element, "autoAlpha,scale");
      gsap.to(element, {
        autoAlpha: 1,
        duration: active ? 0.55 : 0.25,
        ease: active ? "elastic.out(1, 0.45)" : "power2.out",
        scale: active ? 1 : 0.55,
      });
      element.classList.toggle("is-hot", active);
    };
    const stopIdleFloat = (): void => {
      idleTimer?.kill();
      idleTimer = null;
      idleFloat?.kill();
      idleFloat = null;
    };
    const scheduleIdle = (): void => {
      idleTimer?.kill();
      idleTimer = gsap.delayedCall(1.2, () => {
        if (idleFloat) return;
        idleFloat = gsap.to(element, {
          duration: 2.2,
          ease: "sine.inOut",
          repeat: -1,
          y: "+=10",
          yoyo: true,
        });
      });
    };
    const show = (): void => {
      moveX(lastX + 12);
      moveY(lastY - 12);
      if (!shown) {
        shown = true;
        setState(hovering);
      }
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;
      stopIdleFloat();
      lastX = event.clientX;
      lastY = event.clientY;
      moveX(lastX + 12);
      moveY(lastY - 12);
      if (!hovering) {
        if (!resting) {
          setState(false);
          resting = true;
        }
        scheduleIdle();
      } else {
        resting = false;
      }
      shown = true;
    };
    const onPointerOver = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const label = target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel;
      if (tag) tag.textContent = label ?? "open";
      hovering = Boolean(label);
      resting = false;
      if (hovering) {
        stopIdleFloat();
        setState(true);
      }
    };
    const onPointerOut = (event: PointerEvent): void => {
      const next = event.relatedTarget;
      if (next instanceof Element && next.closest("[data-cursor-label]")) return;
      hovering = false;
      resting = true;
      setState(false);
      scheduleIdle();
    };
    const hideBubble = (): void => {
      hovering = false;
      resting = false;
      shown = false;
      stopIdleFloat();
      gsap.killTweensOf(element, "autoAlpha,scale");
      gsap.to(element, { autoAlpha: 0, duration: 0.25, ease: "power2.out" });
    };
    const onLeave = (): void => hideBubble();
    // Wheel scroll fires no pointermove: re-prime the follow tweens and
    // re-show at the last known point so the bubble never stays dead.
    const onScroll = (): void => show();
    const onDown = (): void => show();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    scheduleIdle();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onDown);
      stopIdleFloat();
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-bubble" ref={bubble}>
      <style>{CURSOR_CSS}</style>
      <span className="cursor-reticle" />
      <span className="cursor-dot" />
      <span className="cursor-tag">open</span>
    </div>
  );
}
