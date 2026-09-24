"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoResize: true,
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
    });
    const unsubscribe = lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      unsubscribe();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
