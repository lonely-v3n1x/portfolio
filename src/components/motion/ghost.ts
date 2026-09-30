"use client";

import type { RefObject } from "react";
import { gsap, isReducedMotion, useGSAP } from "@/lib/animations";

/** Peak drift, in percent of the ghost's own height, at the section edges. */
const DRIFT = 5;

/**
 * Slow vertical parallax on `[data-ghost]` section numerals. Transform only,
 * scrubbed against the whole section so the numeral drifts at a fraction of the
 * scroll rate and stays behind the content.
 */
export function useGhostDrift(
  scope: RefObject<HTMLElement | null>,
  selector = "[data-ghost]",
): void {
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const root = scope.current;
      if (!root) return;

      const ghosts = gsap.utils.toArray<HTMLElement>(selector, root);
      if (ghosts.length === 0) return;

      for (const ghost of ghosts) {
        gsap.fromTo(
          ghost,
          { yPercent: -DRIFT },
          {
            yPercent: DRIFT,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope },
  );
}