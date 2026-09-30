"use client";

import type { RefObject } from "react";
import { gsap, isReducedMotion, splitTextToChars, useGSAP } from "@/lib/animations";

/** Same glyph pool the Hero title scrambles through. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@/\\";
const DURATION = 0.55;
/** Share of the run spent staggering the per-character reveal. */
const SPREAD = 0.35;

function attachScramble(root: HTMLElement, selector: string): () => void {
  const targets = gsap.utils.toArray<HTMLElement>(selector, root);
  const sources = new Map<HTMLElement, string>();
  const running = new Map<HTMLElement, gsap.core.Tween>();
  const teardown: Array<() => void> = [];

  for (const target of targets) {
    const source = target.textContent ?? "";
    sources.set(target, source);

    // Split once; repeat hovers reuse the same spans.
    const chars = splitTextToChars(target);
    for (const char of chars) char.style.display = "inline-block";
    if (chars.length === 0) continue;

    const play = () => {
      running.get(target)?.kill();
      const state = { t: 0 };
      const tween = gsap.to(state, {
        t: 1,
        duration: DURATION,
        ease: "none",
        onUpdate: () => {
          for (let i = 0; i < chars.length; i += 1) {
            const local = gsap.utils.clamp(
              0,
              1,
              (state.t - (i / chars.length) * SPREAD) / (1 - SPREAD),
            );
            chars[i].textContent =
              local >= 1 ? source[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
        },
        onComplete: () => {
          for (let i = 0; i < chars.length; i += 1) chars[i].textContent = source[i];
          running.delete(target);
        },
      });
      running.set(target, tween);
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      play();
    };

    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("focus", play);

    teardown.push(() => {
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("focus", play);
      running.get(target)?.kill();
      running.delete(target);
      const original = sources.get(target);
      if (original !== undefined) target.textContent = original;
    });
  }

  return () => {
    for (const dispose of teardown) dispose();
    sources.clear();
    running.clear();
  };
}

/**
 * Scramble-on-hover for short nav labels: glyphs cycle, then settle back to the
 * real string. Uses the Hero GLYPHS pool and its per-character stagger window.
 */
export function useScrambleHover(
  scope: RefObject<HTMLElement | null>,
  selector = "[data-scramble]",
): void {
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(pointer: fine)", () => attachScramble(root, selector));

      return () => mm.revert();
    },
    { scope },
  );
}