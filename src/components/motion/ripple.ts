"use client";

import type { RefObject } from "react";
import { gsap, isReducedMotion, useGSAP } from "@/lib/animations";

const DURATION = 0.65;
const MIN_DIAMETER = 32;

function attachRipple(root: HTMLElement, selector: string): () => void {
  const hosts = gsap.utils.toArray<HTMLElement>(selector, root);
  const teardown: Array<() => void> = [];

  for (const host of hosts) {
    const onDown = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Covers the box from the click point in every direction.
      const farX = Math.max(event.clientX - rect.left, rect.right - event.clientX);
      const farY = Math.max(event.clientY - rect.top, rect.bottom - event.clientY);
      const diameter = Math.max(farX, farY) * 2;
      if (diameter < MIN_DIAMETER) return;

      const span = document.createElement("span");
      span.setAttribute("data-ripple-ripple", "");
      span.style.cssText = [
        "position:absolute",
        `left:${event.clientX - rect.left - diameter / 2}px`,
        `top:${event.clientY - rect.top - diameter / 2}px`,
        `width:${diameter}px`,
        `height:${diameter}px`,
        "border-radius:50%",
        "background:currentColor",
        "pointer-events:none",
        "will-change:transform,opacity",
      ].join(";");

      host.appendChild(span);

      gsap.fromTo(
        span,
        { scale: 0, autoAlpha: 0.4 },
        {
          scale: 1,
          autoAlpha: 0,
          duration: DURATION,
          ease: "power2.out",
          onComplete: () => span.remove(),
        },
      );
    };

    host.addEventListener("pointerdown", onDown);

    teardown.push(() => {
      host.removeEventListener("pointerdown", onDown);
      for (const ripple of Array.from(
        host.querySelectorAll<HTMLElement>("[data-ripple-ripple]"),
      )) {
        gsap.killTweensOf(ripple);
        ripple.remove();
      }
    });
  }

  return () => {
    for (const dispose of teardown) dispose();
  };
}

/**
 * One-shot radial ripple from the press point on `[data-ripple]` hosts.
 * Opacity + transform only; hosts need `position: relative; overflow: hidden`
 * (see `[data-ripple]` in globals.css) so the circle clips to the shape.
 */
export function useRipple(
  scope: RefObject<HTMLElement | null>,
  selector = "[data-ripple]",
): void {
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(pointer: fine)", () => attachRipple(root, selector));

      return () => mm.revert();
    },
    { scope },
  );
}