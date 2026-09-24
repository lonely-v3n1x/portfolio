"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

const CARDS = ["YUSSIF SARE", "SEASON 01"];

export default function Opener({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState<boolean>(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (gone) {
      doneRef.current();
      return;
    }
    const timer = window.setTimeout(() => {
      setGone(true);
      doneRef.current();
    }, 2700);
    return () => window.clearTimeout(timer);
  }, [gone]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const timeline = gsap.timeline();
      timeline
        .fromTo("[data-opencard]", { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, duration: 0.28, ease: "power4.in", scale: 1, stagger: 0.7 })
        .to("[data-opencard]", { autoAlpha: 0, duration: 0.18, ease: "power2.out", stagger: 0.7 }, 0.7)
        .fromTo("[data-openflash]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 1.95)
        .to("[data-openflash]", { autoAlpha: 0, duration: 0.25 }, 2.03);
    },
    { scope: root },
  );

  const skip = () => {
    setGone(true);
    doneRef.current();
  };

  if (gone) return null;

  return (
    <div aria-hidden="true" className="opener" ref={root}>
      <div className="opener-lines" />
      <div className="opener-cards">
        {CARDS.map((card) => (
          <strong data-opencard key={card}>{card}</strong>
        ))}
      </div>
      <span className="opener-flash" data-openflash />
      <button className="opener-skip" data-cursor-label="skip" onClick={skip} type="button">SKIP ▸</button>
    </div>
  );
}
