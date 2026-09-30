"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { getGitHubData, selectedWorkRepos } from "@/data/github";
import type { SelectedWorkRepo } from "@/data/github";
import { gsap, shouldAnimate, useGSAP } from "@/lib/animations";
import { useWipeReveals } from "./motion";

const MUTED = "color-mix(in srgb, var(--paper) 54%, transparent)";
const FAINT = "color-mix(in srgb, var(--paper) 32%, transparent)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const LANGUAGE_TONE: Record<string, string> = {
  Python: "var(--cobalt)",
  Java: "var(--red)",
  C: "var(--acid)",
  PHP: "var(--paper)",
};

function toneFor(language: string): string {
  return LANGUAGE_TONE[language] ?? "var(--line)";
}

const sectionStyle: CSSProperties = {
  position: "relative",
  padding: "clamp(4.5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)",
  background: "var(--night)",
  color: "var(--paper)",
  borderTop: "1px solid var(--line)",
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-dm-mono)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: MUTED,
};

const listStyle: CSSProperties = { listStyle: "none", margin: 0, padding: 0 };

interface WorkRowProps {
  repo: SelectedWorkRepo;
  stars: number;
  isActive: boolean;
  onActivate: (rank: number | null) => void;
  onExpand: (repo: SelectedWorkRepo) => void;
}

function WorkRow({ repo, stars, isActive, onActivate, onExpand }: WorkRowProps) {
  return (
    <li
      className="work-row"
      onMouseEnter={() => onActivate(repo.rank)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(repo.rank)}
      onBlur={() => onActivate(null)}
      style={{
        position: "relative",
        borderBottom: "1px solid var(--line)",
        background: isActive
          ? "linear-gradient(90deg, color-mix(in srgb, var(--red) 16%, transparent), transparent 62%)"
          : "transparent",
        transition: `background 320ms ${EASE}`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: isActive ? "var(--red)" : "transparent",
          transition: `background 320ms ${EASE}`,
        }}
      />
      <a
        href={repo.url}
        target="_blank"
        rel="noreferrer"
        data-cursor-label="view"
        onClick={(event) => {
          if (window.matchMedia("(pointer: coarse)").matches) {
            event.preventDefault();
            onExpand(repo);
          }
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "3rem minmax(0, 1fr) 2.75rem",
          gap: "clamp(0.75rem, 2vw, 2rem)",
          alignItems: "start",
          padding: "clamp(1.25rem, 2.6vw, 2rem) 0 clamp(1.25rem, 2.6vw, 2rem) clamp(0.75rem, 1.6vw, 1.25rem)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            color: isActive ? "var(--red)" : FAINT,
            transition: `color 260ms ${EASE}`,
          }}
        >
          {String(repo.rank).padStart(2, "0")}
        </span>

        <span style={{ display: "grid", gap: "0.6rem" }}>
          <span style={{ ...labelStyle, color: isActive ? "var(--acid)" : "var(--cobalt)" }}>
            {repo.genre}
          </span>

          <span
            style={{
              fontFamily: "var(--font-archivo-black)",
              fontSize: "clamp(1.4rem, 3.4vw, 2.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "var(--paper)",
              transition: `color 260ms ${EASE}`,
            }}
          >
            {repo.name}
          </span>

          <span
            style={{
              maxWidth: "48ch",
              fontSize: "0.95rem",
              lineHeight: 1.55,
              color: MUTED,
            }}
          >
            {repo.description}
          </span>

          <span
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.9rem",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: FAINT,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  background: toneFor(repo.language),
                }}
              />
              {repo.language || "Unknown"}
            </span>
            <span aria-hidden="true">|</span>
            <span style={{ color: stars > 0 ? "var(--acid)" : FAINT }}>
              ★ {stars}
            </span>
          </span>
        </span>

        <span
          aria-hidden="true"
          style={{
            justifySelf: "end",
            fontSize: "1.6rem",
            lineHeight: 1,
            color: isActive ? "var(--acid)" : "var(--paper)",
            transform: isActive ? "translateX(8px)" : "translateX(0)",
            transition: `transform 380ms ${EASE}, color 260ms ${EASE}`,
          }}
        >
          →
        </span>
      </a>
    </li>
  );
}

function PreviewCard({ repo, visible }: { repo: SelectedWorkRepo | null; visible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    if (!shouldAnimate() || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(card, { xPercent: -50, yPercent: -112, scale: 0.92, autoAlpha: 0 });
    const xTo = gsap.quickTo(card, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" });
    const move = (event: PointerEvent): void => {
      xTo(event.clientX);
      yTo(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      autoAlpha: visible ? 1 : 0,
      scale: visible ? 1 : 0.92,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [visible]);

  return (
    <div
      ref={cardRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "min(420px, 38vw)",
        aspectRatio: "16 / 10",
        zIndex: 60,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "var(--night)",
        boxShadow: "0 24px 80px rgba(0, 0, 0, 0.55)",
      }}
    >
      {repo?.previewImage ? (
        <Image
          src={repo.previewImage}
          alt={`${repo.name} preview`}
          fill
          sizes="420px"
          style={{ objectFit: "cover" }}
        />
      ) : repo?.previewUrl ? (
        <iframe
          src={repo.previewUrl}
          title="Live preview"
          tabIndex={-1}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      ) : null}
    </div>
  );
}

function WorkSheet({ repo, open, onClose }: { repo: SelectedWorkRepo | null; open: boolean; onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    gsap.to(sheet, {
      autoAlpha: open ? 1 : 0,
      y: open ? "0%" : "100%",
      duration: 0.45,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label={repo ? `${repo.name} details` : "Work details"}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 500,
        visibility: "hidden",
        opacity: 0,
        maxHeight: "82dvh",
        overflowY: "auto",
        background: "var(--night)",
        borderTop: "1px solid var(--line)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: "1rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom))",
        boxShadow: "0 -24px 80px rgba(0, 0, 0, 0.6)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 44,
          height: 4,
          borderRadius: 999,
          background: "var(--line)",
          margin: "0 auto 1rem",
        }}
      />
      {repo ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <p style={{ margin: 0, fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}>
                {repo.genre} — {repo.language}
              </p>
              <h3 style={{ margin: "0.4rem 0 0", fontFamily: "var(--font-archivo-black)", fontSize: "1.6rem", color: "var(--paper)" }}>
                {repo.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              style={{
                flexShrink: 0,
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--paper)",
                fontSize: "1.1rem",
              }}
            >
              ×
            </button>
          </div>
          {repo.previewImage ? (
            <Image
              src={repo.previewImage}
              alt={`${repo.name} preview`}
              width={800}
              height={500}
              sizes="100vw"
              style={{ width: "100%", height: "auto", borderRadius: 12, border: "1px solid var(--line)" }}
            />
          ) : null}
          {repo.previewUrl && !repo.previewImage ? (
            <a
              href={repo.previewUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                borderRadius: 12,
                border: "1px solid var(--acid)",
                padding: "1rem",
                textAlign: "center",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--acid)",
                textDecoration: "none",
              }}
            >
              Open live site →
            </a>
          ) : null}
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "color-mix(in srgb, var(--paper) 75%, transparent)" }}>
            {repo.description}
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                textAlign: "center",
                borderRadius: 999,
                border: "1px solid var(--paper)",
                padding: "0.85rem",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
                textDecoration: "none",
              }}
            >
              {repo.url.includes("vercel.app") ? "Open site" : "Open repo"} ★ {repo.stars}
            </a>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "transparent",
                padding: "0.85rem",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--paper)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [preview, setPreview] = useState<SelectedWorkRepo | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [sheet, setSheet] = useState<SelectedWorkRepo | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleActivate = (rank: number | null): void => {
    setActive(rank);
    const found = rank === null ? undefined : selectedWorkRepos.find((item) => item.rank === rank);
    if (found && (found.previewUrl ?? found.previewImage)) {
      setPreview(found);
      setPreviewVisible(true);
    } else if (rank === null) {
      setPreviewVisible(false);
    }
  };

  const expandSheet = (repo: SelectedWorkRepo): void => {
    setSheet(repo);
    setSheetOpen(true);
  };
  const [liveStars, setLiveStars] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const { repos } = await getGitHubData();
      if (!mounted) return;
      const next: Record<string, number> = {};
      for (const repo of repos) next[repo.name] = repo.stars;
      setLiveStars(next);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!shouldAnimate()) return;

      const list = listRef.current;
      if (!list) return;

      const rows = gsap.utils.toArray<HTMLElement>(".work-row", list);
      if (rows.length === 0) return;

      gsap.set(rows, {
        opacity: 0,
        x: (index: number) => -(64 + index * 18),
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 84%",
            end: "bottom 58%",
            scrub: true,
          },
        })
        .to(rows, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: "none",
          stagger: 0.14,
        });
    },
    { scope: listRef }
  );

  useWipeReveals(sectionRef);

  return (
    <section
      id="quests"
      ref={sectionRef}
      aria-labelledby="quests-heading"
      style={sectionStyle}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <span style={labelStyle}>Quest Log — {selectedWorkRepos.length} Entries</span>
          <h2
            id="quests-heading"
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
            Selected
            <br />
            <span style={{ color: "var(--red)" }}>Work</span>
          </h2>
        </div>
        <p
          style={{
            maxWidth: "34ch",
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
          Star counts live from the GitHub API, static snapshot on failure.
        </p>
      </header>

      <ul ref={listRef} style={listStyle}>
        {selectedWorkRepos.map((repo) => (
          <WorkRow
            key={repo.id}
            repo={repo}
            stars={liveStars[repo.name] ?? repo.stars}
            isActive={active === repo.rank}
            onActivate={handleActivate}
            onExpand={expandSheet}
          />
        ))}
      </ul>
      <PreviewCard repo={preview} visible={previewVisible} />
      <WorkSheet repo={sheet} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </section>
  );
}
