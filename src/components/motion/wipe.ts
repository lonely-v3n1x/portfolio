"use client";

import type { RefObject } from "react";
import { gsap, isReducedMotion, ScrollTrigger, useGSAP } from "@/lib/animations";

const START = "top 86%";
const DURATION = 0.9;
/** Applied only when the trigger fires, so a missed trigger can never hide copy. */
const CLOSED = "inset(0% 0% 100% 0%)";
const OPEN = "inset(0% 0% 0% 0%)";

/**
 * Clip-path wipe for `[data-wipe]` headings. The closed state is applied inside
 * `onEnter` rather than at setup, so the heading is never left clipped if the
 * trigger fails to fire; `onInterrupt` snaps it back open if another tween on
 * the same target (the `[data-reveal]` batches) kills this one mid-flight.
 */
export function useWipeReveals(
  scope: RefObject<HTMLElement | null>,
  selector = "[data-wipe]",
): void {
  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const root = scope.current;
      if (!root) return;

      const headings = gsap.utils.toArray<HTMLElement>(selector, root);

      for (const heading of headings) {
        ScrollTrigger.create({
          trigger: heading,
          start: START,
          once: true,
          // After the [data-reveal] batches, whose `overwrite: true` kills this tween.
          refreshPriority: -1,
          onEnter: () => {
            gsap.fromTo(
              heading,
              { clipPath: CLOSED },
              {
                clipPath: OPEN,
                duration: DURATION,
                ease: "expo.out",
                onInterrupt: () => gsap.set(heading, { clipPath: OPEN }),
              },
            );
          },
        });
      }
    },
    { scope },
  );
}