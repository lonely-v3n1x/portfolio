"use client";

import type { RefObject } from "react";
import { gsap, isReducedMotion, useGSAP } from "@/lib/animations";

/** How far outside the element box the magnetic field still reaches (px). */
const REACH = 110;
/** Fraction of the pointer offset applied at full strength. */
const PULL = 0.3;
/** quickTo duration — doubles as the snap-back duration on leave. */
const FOLLOW = 0.55;

export interface MagneticOptions {
  selector?: string;
  reach?: number;
  pull?: number;
}

function attachMagnetic(
  root: HTMLElement,
  selector: string,
  reach: number,
  pull: number,
): () => void {
  const targets = gsap.utils.toArray<HTMLElement>(selector, root);
  const teardown: Array<() => void> = [];

  for (const target of targets) {
    const toX = gsap.quickTo(target, "x", { duration: FOLLOW, ease: "expo.out" });
    const toY = gsap.quickTo(target, "y", { duration: FOLLOW, ease: "expo.out" });

    let rect: DOMRect | null = null;
    let engaged = false;

    const measure = () => {
      rect = target.getBoundingClientRect();
    };

    const release = () => {
      if (!engaged) return;
      engaged = false;
      rect = null;
      toX(0);
      toY(0);
    };

    const onEnter = (event: PointerEvent) => {
      // Laptops with touchscreens report pointer:fine yet still emit touch pointers.
      if (event.pointerType === "touch") return;
      measure();
      engaged = true;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !engaged) return;
      if (!rect) measure();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const field = Math.max(rect.width, rect.height) / 2 + reach;
      // Strength dies at the box edge, so the pull never fights a resting cursor.
      const strength = distance === 0 ? 0 : Math.max(0, 1 - distance / field);

      toX(dx * pull * strength);
      toY(dy * pull * strength);
    };

    const onScroll = () => {
      if (engaged) measure();
    };

    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", release);
    target.addEventListener("pointercancel", release);
    window.addEventListener("scroll", onScroll, { passive: true });

    teardown.push(() => {
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", release);
      target.removeEventListener("pointercancel", release);
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(target);
      gsap.set(target, { clearProps: "transform,willChange" });
    });
  }

  return () => {
    for (const dispose of teardown) dispose();
  };
}

/**
 * Pulls CTA / nav targets toward the pointer and snaps them home on leave.
 * Transform-only, gated behind `(pointer: fine)` so touch stays inert.
 */
export function useMagnetic(
  scope: RefObject<HTMLElement | null>,
  options: MagneticOptions = {},
): void {
  const { selector = "[data-magnetic]", reach = REACH, pull = PULL } = options;

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(pointer: fine)", () => attachMagnetic(root, selector, reach, pull));

      return () => mm.revert();
    },
    { scope },
  );
}