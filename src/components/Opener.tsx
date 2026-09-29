"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

type BootPhase = "loading" | "leaving" | "done";

export default function Opener({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<BootPhase>(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "loading");
  const doneRef = useRef(onDone);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (phase !== "loading") {
      if (phase === "done") doneRef.current();
      return;
    }
    const later = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };
    later(1750, () => setPhase("leaving"));
    later(2550, () => {
      setPhase("done");
      doneRef.current();
    });
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const counter = root.current?.querySelector<HTMLElement>("[data-boot-counter]");
    const bar = root.current?.querySelector<HTMLElement>("[data-boot-bar]");
    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const value = Math.round(proxy.value);
        if (counter) counter.textContent = `LOADING SPECIMEN ${String(value).padStart(2, "0")}_`;
        if (bar) bar.style.transform = `scaleX(${value / 100})`;
      },
      value: 100,
    });
    return () => {
      tween.kill();
    };
  }, [phase]);

  useGSAP(
    () => {
      if (phase !== "leaving" || !root.current) return;
      gsap.to(root.current, { duration: 0.7, ease: "power4.inOut", yPercent: -100 });
    },
    { dependencies: [phase], scope: root },
  );

  const skip = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setPhase("done");
    doneRef.current();
  };

  if (phase === "done") return null;

  return (
    <div className="boot-overlay" ref={root}>
      <div className="boot-inner">
        <span className="boot-mark">YS / ARCHIVE.SYS</span>
        <span className="boot-counter" data-boot-counter>LOADING SPECIMEN 00_</span>
        <div className="boot-track" aria-hidden="true"><span data-boot-bar /></div>
        <div className="boot-row">
          <span className="boot-hint">do not turn off your curiosity</span>
          <button className="boot-skip" data-cursor-label="skip intro" onClick={skip} type="button">SKIP ▸▸</button>
        </div>
      </div>
    </div>
  );
}
