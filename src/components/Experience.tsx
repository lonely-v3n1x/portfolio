"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { gsap, ScrollTrigger, shouldAnimate, useGSAP } from "@/lib/animations";
import { useGhostDrift, useWipeReveals } from "./motion";

const MUTED = "color-mix(in srgb, var(--paper) 54%, transparent)";
const FAINT = "color-mix(in srgb, var(--paper) 32%, transparent)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Rail sits exactly on the boundary between the meta column and the body column. */
const RAIL = "clamp(5.5rem, 14vw, 10rem)";

const ENTRIES = [
  {
    id: "atu",
    year: "2019",
    label: "ATU · Level 200",
    title: "Web Development",
    note: "Accra Technical University. Semesters of broken layouts, semantically nested everything, and the lesson that structure has to come before style ever touches it.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: "cli",
    year: "2020",
    label: "Terminal",
    title: "First CLI Contact",
    note: "The first time a terminal actually answered back. Git, npm, remote deploys by command line — and a 2am build failure I had absolutely not earned yet.",
    tags: ["Bash", "Git", "npm"],
  },
  {
    id: "season-01",
    year: "2024",
    label: "Season 01",
    title: "Frontend Motion",
    note: "Where static layouts stopped being enough. GSAP timelines, scroll-linked sequences, easing discipline — and the rule that every one of them dies for reduced motion.",
    tags: ["GSAP", "ScrollTrigger", "Motion"],
  },
  {
    id: "open",
    year: "2026",
    label: "Now",
    title: "Open For Work",
    note: "Looking for a frontend role where craft counts: motion, accessibility, and a team that reads the brief twice before shipping once.",
    tags: ["Available", "Remote", "Frontend"],
    active: true,
  },
] as const;

const sectionStyle: CSSProperties = {
  position: "relative",
  isolation: "isolate",
  overflow: "hidden",
  padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)",
  background: "var(--night)",
  color: "var(--paper)",
  borderTop: "1px solid var(--line)",
};

const ghostStyle: CSSProperties = {
  position: "absolute",
  top: "-0.04em",
  right: "0.1rem",
  zIndex: -1,
  fontFamily: "var(--font-archivo-black)",
  fontSize: "clamp(8rem, 30vw, 24rem)",
  lineHeight: 0.8,
  letterSpacing: "-0.055em",
  color: "color-mix(in srgb, var(--paper) 5%, transparent)",
  pointerEvents: "none",
  userSelect: "none",
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: MUTED,
};

const railStyle: CSSProperties = {
  position: "absolute",
  left: RAIL,
  top: "0.35rem",
  bottom: "0.35rem",
  width: "1px",
  background: "var(--line)",
};

const railFillStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, var(--acid), var(--red) 82%)",
  transformOrigin: "50% 0%",
  willChange: "transform",
};

const rowStyle: CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: `${RAIL} minmax(0, 1fr)`,
  columnGap: "clamp(1rem, 2.5vw, 2.25rem)",
  alignItems: "start",
};

const nodeStyle: CSSProperties = {
  position: "absolute",
  left: RAIL,
  top: "0.3rem",
  width: "9px",
  height: "9px",
  marginLeft: "-4.5px",
  background: "var(--night)",
  border: "1px solid var(--red)",
};

const activeNodeStyle: CSSProperties = {
  background: "var(--acid)",
  borderColor: "var(--acid)",
  boxShadow: "0 0 0 5px color-mix(in srgb, var(--acid) 16%, transparent)",
};

const metaStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  paddingRight: "0.75rem",
  textAlign: "right",
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.68rem",
  lineHeight: 1.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: FAINT,
};

const entryTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-archivo-black)",
  fontSize: "clamp(1.35rem, 3.2vw, 2.35rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.025em",
  textTransform: "uppercase",
  color: "var(--paper)",
};

function pick(rows: HTMLElement[], selector: string): HTMLElement[] {
  return rows
    .map((row) => row.querySelector<HTMLElement>(selector))
    .filter((el): el is HTMLElement => el !== null);
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      const line = lineRef.current;
      if (!list || !line || !shouldAnimate()) return;

      const rows = gsap.utils.toArray<HTMLElement>(".exp-row", list);
      if (rows.length === 0) return;

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top 78%",
            end: "bottom 62%",
            scrub: true,
          },
        }
      );

      const nodes = pick(rows, ".exp-node");
      const content = pick(rows, ".exp-meta, .exp-body");

      gsap.set(nodes, { autoAlpha: 0, scale: 0.35, rotation: -140 });
      gsap.set(content, { autoAlpha: 0, y: 30 });

      ScrollTrigger.batch(rows, {
        start: "top 88%",
        once: true,
        onEnter: (targets) => {
          const batch = targets as HTMLElement[];
          gsap.to(pick(batch, ".exp-node"), {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.65,
            ease: "back.out(2.2)",
            stagger: 0.06,
            overwrite: true,
          });
          gsap.to(pick(batch, ".exp-meta, .exp-body"), {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.09,
            overwrite: true,
          });
        },
      });
    },
    { scope: sectionRef }
  );

  useWipeReveals(sectionRef);
  useGhostDrift(sectionRef);

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-heading"
      style={sectionStyle}
    >
      <span aria-hidden="true" data-ghost style={ghostStyle}>
        03
      </span>

      <header
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "clamp(2.75rem, 6vw, 4.5rem)",
        }}
      >
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <span style={labelStyle}>03 / Experience — {ENTRIES.length} entries</span>
          <h2
            id="experience-heading"
            data-wipe
            style={{
              margin: 0,
              fontFamily: "var(--font-archivo-black)",
              fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
              lineHeight: 0.86,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
            }}
          >
            The <span style={{ color: "var(--red)" }}>Long</span>
            <br />
            Way Round
          </h2>
        </div>
        <p
          style={{
            maxWidth: "32ch",
            margin: 0,
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.7rem",
            lineHeight: 1.7,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: FAINT,
            textAlign: "right",
          }}
        >
          Not a résumé. Four rooms, one corridor — the moments that changed how I build.
        </p>
      </header>

      <div style={{ position: "relative" }}>
        <span aria-hidden="true" style={railStyle}>
          <span ref={lineRef} className="exp-rail-fill" style={railFillStyle} />
        </span>

        <ol
          ref={listRef}
          style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "clamp(2.25rem, 5vw, 3.5rem)" }}
        >
          {ENTRIES.map((entry) => (
            <li className="exp-row" key={entry.id} style={rowStyle}>
              <span
                className="exp-node"
                aria-hidden="true"
                style={{ ...nodeStyle, ...("active" in entry && entry.active ? activeNodeStyle : null) }}
              />

              <p
                className="exp-meta"
                style={{
                  ...metaStyle,
                  margin: 0,
                  color: "active" in entry && entry.active ? MUTED : FAINT,
                }}
              >
                <span style={{ color: "active" in entry && entry.active ? "var(--acid)" : "var(--paper)" }}>
                  {entry.year}
                </span>
                <span>{" "}— {entry.label}</span>
              </p>

              <div className="exp-body" style={{ display: "grid", gap: "0.85rem" }}>
                <h3 style={entryTitleStyle}>{entry.title}</h3>

                <p style={{ maxWidth: "52ch", margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: MUTED }}>
                  {entry.note}
                </p>

                <span style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "0.25rem 0.5rem",
                        border: "1px solid var(--line)",
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: MUTED,
                        transition: `color ${EASE}, border-color ${EASE}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
