"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/animations/gsap";
import { isReducedMotion } from "@/lib/animations/reduced-motion";
import { useGhostDrift, useWipeReveals } from "./motion";

type Skill = {
  code: string;
  name: string;
  tools: string;
  value: number;
};

const SKILLS: readonly Skill[] = [
  { code: "01", name: "FRONTEND", tools: "React / Next / TS", value: 100 },
  { code: "02", name: "MOTION", tools: "GSAP / Anime / Three", value: 100 },
  { code: "03", name: "SYSTEMS", tools: "C / Python", value: 100 },
  { code: "04", name: "BACKEND", tools: "Python / Node", value: 100 },
  { code: "05", name: "LINUX", tools: "—", value: 100 },
  { code: "06", name: "DEVOPS", tools: "Git / CI", value: 100 },
];

const DIM = "color-mix(in srgb, var(--paper) 46%, transparent)";

const styles = {
  section: {
    position: "relative",
    overflow: "hidden",
    padding: "clamp(4.5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 5rem)",
    borderTop: "1px solid var(--line)",
  } as const,
  ghost: {
    position: "absolute",
    top: "clamp(1rem, 4vh, 3rem)",
    right: "clamp(-0.5rem, 1vw, 1rem)",
    fontFamily: "var(--font-archivo-black)",
    fontSize: "clamp(7rem, 20vw, 15rem)",
    lineHeight: 0.78,
    letterSpacing: "-0.04em",
    color: "transparent",
    WebkitTextStroke: "1px var(--line)",
    pointerEvents: "none",
    userSelect: "none",
  } as const,
  header: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1.25rem 2rem",
    marginBottom: "clamp(2.25rem, 6vw, 4.5rem)",
  } as const,
  kicker: {
    margin: 0,
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "var(--red)",
  } as const,
  heading: {
    margin: "0.5rem 0 0",
    fontFamily: "var(--font-archivo-black)",
    fontSize: "clamp(2.5rem, 8vw, 5.25rem)",
    lineHeight: 0.88,
    letterSpacing: "-0.025em",
    textTransform: "uppercase",
  } as const,
  note: {
    margin: 0,
    maxWidth: "26ch",
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.7rem",
    lineHeight: 1.6,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: DIM,
  } as const,
  row: {
    display: "grid",
    gridTemplateColumns: "2.5rem minmax(0, 1fr) auto",
    alignItems: "center",
    columnGap: "clamp(0.75rem, 2vw, 1.5rem)",
    padding: "clamp(1rem, 2.4vw, 1.5rem) 0",
    borderTop: "1px solid var(--line)",
  } as const,
  code: {
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.16em",
    color: DIM,
  } as const,
  name: {
    margin: 0,
    fontFamily: "var(--font-archivo-black)",
    fontSize: "clamp(1.15rem, 3.1vw, 1.85rem)",
    lineHeight: 1,
    letterSpacing: "-0.01em",
    textTransform: "uppercase",
  } as const,
  tools: {
    margin: "0.4rem 0 0",
    fontFamily: "var(--font-dm-mono)",
    fontSize: "0.68rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: DIM,
  } as const,
  value: {
    fontFamily: "var(--font-dm-mono)",
    fontSize: "clamp(1rem, 2.4vw, 1.5rem)",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.02em",
  } as const,
  unit: { fontSize: "0.6em", letterSpacing: "0.08em", color: DIM } as const,
  track: {
    gridColumn: "2 / -1",
    height: "0.5rem",
    background: "var(--line)",
  } as const,
  fill: {
    height: "100%",
    width: "100%",
    transformOrigin: "left center",
    willChange: "transform",
    background: "linear-gradient(90deg, var(--acid) 0%, var(--cobalt) 100%)",
  } as const,
};

export default function Arsenal() {
  const root = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const fills = gsap.utils.toArray<HTMLElement>("[data-arsenal-fill]", scope);

      if (isReducedMotion()) {
        gsap.set(fills, { scaleX: 1 });
        return;
      }

      const rows = gsap.utils.toArray<HTMLElement>("[data-arsenal-row]", scope);
      gsap.set(rows, { autoAlpha: 0, y: 24 });
      gsap.set(fills, { scaleX: 0 });

      ScrollTrigger.batch(rows, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
          });
        },
      });

      const list = listRef.current;
      if (!list || fills.length === 0) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 84%",
            end: "bottom 62%",
            scrub: true,
          },
        })
        .to(fills, {
          scaleX: (_i, target) => Number((target as HTMLElement).dataset.value ?? 0) / 100,
          duration: 0.7,
          ease: "none",
          stagger: 0.12,
        });
    },
    { scope: root },
  );

  useWipeReveals(root);
  useGhostDrift(root);

  return (
    <section id="arsenal" ref={root} style={styles.section}>
      <span aria-hidden="true" data-ghost style={styles.ghost}>
        02
      </span>

      <header style={styles.header}>
        <div>
          <p style={styles.kicker}>Arsenal / 06 systems</p>
          <h2 data-wipe style={styles.heading}>
            Loadout
          </h2>
        </div>
        <p style={styles.note}>Scroll to arm. Self-assessed proficiency, 0&ndash;100.</p>
      </header>

      <ul ref={listRef} style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {SKILLS.map((skill) => (
          <li key={skill.code} data-arsenal-row style={styles.row}>
            <span style={styles.code}>{skill.code}</span>
            <div>
              <h3 style={styles.name}>{skill.name}</h3>
              <p style={styles.tools}>{skill.tools}</p>
            </div>
            <span style={styles.value}>
              {skill.value}
              <span style={styles.unit}>%</span>
            </span>
            <div style={styles.track}>
              <div data-arsenal-fill data-value={skill.value} style={styles.fill} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
