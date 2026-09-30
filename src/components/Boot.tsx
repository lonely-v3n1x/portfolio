"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createAnimeTimeline, isReducedMotion, type Timeline } from "@/lib/animations";

type BootPhase = "loading" | "leaving" | "done";

interface BootProps {
  onDone: () => void;
}

const LOAD_MS = 1200;
const EXIT_MS = 500;
const BOOT_KEY = "s02-booted";
const PAD = "clamp(20px, 4vw, 48px)";
const LINE = "color-mix(in srgb, var(--paper) 18%, transparent)";

const BOOT_CSS = `
.boot-cursor { animation: boot-blink 1.05s steps(1, end) infinite; }
.boot-skip:hover, .boot-skip:focus-visible { background: var(--paper); color: var(--night); border-color: var(--paper); }
@keyframes boot-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.12; } }
`;

const row: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 };
const meta: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-dm-mono)",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};
const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};

export default function Boot({ onDone }: BootProps) {
  const [phase, setPhase] = useState<BootPhase>("loading");
  const overlayRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const footRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const loadTl = useRef<Timeline | null>(null);
  const exitTl = useRef<Timeline | null>(null);
  const onDoneRef = useRef(onDone);
  const settled = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    document.getElementById("splash")?.remove();
  }, []);

  const settle = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    setPhase("done");
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      // private mode: storage unavailable, intro just replays next visit
    }
    onDoneRef.current();
  }, []);

  const skip = useCallback(() => {
    if (counterRef.current) counterRef.current.textContent = "100";
    setPhase((p) => (p === "loading" ? "leaving" : p));
  }, []);

  // loading -> leaving: counter 0-100, progress bar fill, chrome reveal
  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    if (isReducedMotion()) {
      root.style.overflow = previousOverflow;
      settle();
      return;
    }

    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem(BOOT_KEY) === "1";
    } catch {
      // private mode: storage unavailable, intro plays as usual
    }
    if (alreadyBooted) {
      root.style.overflow = previousOverflow;
      settle();
      return;
    }

    const counter = { value: 0 };
    const chrome = [headRef.current, footRef.current].filter((el): el is HTMLElement => el !== null);
    const tl = createAnimeTimeline();
    loadTl.current = tl;

    tl.add(counter, {
      value: 100,
      duration: LOAD_MS,
      ease: "inOutQuart",
      onUpdate: () => {
        const value = counter.value;
        if (counterRef.current) counterRef.current.textContent = String(Math.round(value)).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
      },
      onComplete: () => setPhase((p) => (p === "loading" ? "leaving" : p)),
    });

    tl.add(chrome, { opacity: [0, 1], y: [14, 0], duration: 520, ease: "outExpo" }, 0);
    const bodyEl = bodyRef.current;
    if (bodyEl) tl.add(bodyEl, { opacity: [0, 1], y: [22, 0], duration: 620, ease: "outExpo" }, 90);

    return () => {
      root.style.overflow = previousOverflow;
      tl.cancel();
      loadTl.current = null;
    };
  }, [settle]);

  // leaving -> done: slide the whole overlay up, then hand off
  useEffect(() => {
    if (phase !== "leaving") return;

    loadTl.current?.cancel();
    loadTl.current = null;

    if (isReducedMotion() || !overlayRef.current) {
      settle();
      return;
    }

    const inner = [headRef.current, bodyRef.current, footRef.current].filter((el): el is HTMLElement => el !== null);
    const tl = createAnimeTimeline();
    exitTl.current = tl;

    tl.add(inner, { y: [0, -40], opacity: [1, 0], duration: 320, ease: "inQuad" }, 0);
    tl.add(overlayRef.current, { y: ["0%", "-100%"], duration: EXIT_MS, ease: "inOutQuart" }, 0);
    tl.call(settle, EXIT_MS);

    return () => {
      tl.cancel();
      exitTl.current = null;
    };
  }, [phase, settle]);

  if (phase === "done") return null;

  return (
    <>
      <style>{BOOT_CSS}</style>
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 24,
          padding: PAD,
          background: "var(--night)",
          color: "var(--paper)",
          fontFamily: "var(--font-sans)",
          overflow: "hidden",
          willChange: "transform",
          pointerEvents: phase === "loading" ? "auto" : "none",
        }}
      >
        <p role="status" style={srOnly}>
          Compiling portfolio
        </p>

        <header ref={headRef} style={row}>
          <span style={{ fontFamily: "var(--font-archivo-black)", fontSize: 13, letterSpacing: "0.04em" }}>
            Yussif Sare
          </span>
          <span style={meta}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--red)" }} />
            Compiling
          </span>
        </header>

        <div ref={bodyRef} aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <span
              ref={counterRef}
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "clamp(92px, 23vw, 264px)",
                lineHeight: 0.8,
                letterSpacing: "-0.06em",
              }}
            >
              000
            </span>
            <span
              className="boot-cursor"
              style={{ width: 12, height: "0.34em", marginBottom: "0.1em", background: "var(--acid)" }}
            />
          </span>
          <span style={{ display: "block", height: 2, background: LINE }}>
            <span
              ref={barRef}
              style={{
                display: "block",
                height: "100%",
                background: "var(--acid)",
                transform: "scaleX(0)",
                transformOrigin: "left center",
                willChange: "transform",
              }}
            />
          </span>
        </div>

        <footer ref={footRef} style={row}>
          <span style={meta}>Accra, GH</span>
          <button
            type="button"
            className="boot-skip"
            onClick={skip}
            style={{
              padding: "11px 20px",
              borderRadius: 999,
              border: `1px solid ${LINE}`,
              background: "transparent",
              fontFamily: "var(--font-dm-mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Skip intro
          </button>
        </footer>
      </div>
    </>
  );
}
