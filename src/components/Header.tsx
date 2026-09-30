"use client";

import { useRef } from "react";
import { useMagnetic, useScrambleHover } from "./motion";

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--paper)",
  textDecoration: "none",
};

const brandStyle: React.CSSProperties = {
  ...linkStyle,
  fontFamily: "var(--font-archivo-black)",
  fontSize: "0.85rem",
  letterSpacing: "0.06em",
  color: "var(--acid)",
};

export default function Header() {
  const rootRef = useRef<HTMLElement>(null);

  useMagnetic(rootRef, { pull: 0.22, reach: 90 });
  useScrambleHover(rootRef);

  return (
    <header
      ref={rootRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--night) 82%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          maxWidth: "76rem",
          margin: "0 auto",
          padding: "0.9rem clamp(1.25rem, 5vw, 2.5rem)",
        }}
      >
        <a href="#top" data-magnetic data-scramble data-cursor-label="back to top" style={brandStyle}>
          YS
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 4vw, 2rem)" }}>
          <a href="#quests" data-magnetic data-scramble data-cursor-label="open quests" style={linkStyle}>
            Quests
          </a>
          <a href="#arsenal" data-magnetic data-scramble data-cursor-label="open arsenal" style={linkStyle}>
            Arsenal
          </a>
          <a href="#contact" data-magnetic data-scramble data-cursor-label="open contact" style={linkStyle}>
            Contact
          </a>
          <a
            href="/pro"
            data-magnetic
            data-scramble
            data-cursor-label="open pro"
            style={{
              ...linkStyle,
              border: "1px solid var(--acid)",
              borderRadius: 999,
              padding: "0.45rem 0.9rem",
              color: "var(--acid)",
            }}
          >
            View Pro
          </a>
        </div>
      </nav>
    </header>
  );
}
