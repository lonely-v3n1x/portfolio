"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

type BootPhase = "loading" | "ready" | "leaving" | "done";

export default function TransitionOverlay() {
  const overlay = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<BootPhase>(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "loading");

  useEffect(() => {
    if (phase !== "loading") return;
    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      duration: 1.7,
      ease: "power2.inOut",
      onUpdate: () => {
        const value = Math.round(proxy.value);
        if (counter.current) counter.current.textContent = `LOADING SPECIMEN ${String(value).padStart(2, "0")}_`;
        if (bar.current) bar.current.style.transform = `scaleX(${value / 100})`;
      },
      onComplete: () => setPhase("ready"),
      value: 100,
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (phase !== "leaving" || !overlay.current) return;
      gsap.to(overlay.current, {
        duration: 0.7,
        ease: "power4.inOut",
        onComplete: () => setPhase("done"),
        yPercent: -100,
      });
    },
    { dependencies: [phase], scope: overlay },
  );

  if (phase === "done") return null;

  return (
    <div aria-hidden={phase !== "ready"} className="boot-overlay" ref={overlay}>
      <div className="boot-inner">
        <span className="boot-mark">YS / ARCHIVE.SYS</span>
        <span className="boot-counter" ref={counter}>LOADING SPECIMEN 00_</span>
        <div className="boot-track" aria-hidden="true"><span ref={bar} /></div>
        {phase === "ready" ? (
          <button className="boot-start" data-cursor-label="press start" onClick={() => setPhase("leaving")} type="button">▸ PRESS START</button>
        ) : (
          <span className="boot-hint">do not turn off your curiosity</span>
        )}
      </div>
    </div>
  );
}
