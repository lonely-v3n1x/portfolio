"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Native scroll only: Lenis smoothing was removed per owner request.
// Scroll-driven animations (scrub reveals, progress bar) run off the
// browser's own scroll position via ScrollTrigger + a passive listener.

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      gsap.set(".smooth-scroll-progress", { scaleX: scrollPercent });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    // Recompute trigger positions once content + fonts settle
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      window.clearTimeout(refresh);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="smooth-scroll-wrapper">
      <div className="smooth-scroll-progress" />
      <main>{children}</main>
    </div>
  );
}
