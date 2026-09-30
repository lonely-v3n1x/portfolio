"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { getGitHubData, staticProfile } from "@/data/github";
import type { GitHubProfile } from "@/data/github";
import {
  createAnimeTimeline,
  gsap,
  ScrollTrigger,
  shouldAnimate,
  useGSAP,
  type Timeline,
} from "@/lib/animations";
import { useGhostDrift, useWipeReveals } from "./motion";

const MUTED = "color-mix(in srgb, var(--paper) 54%, transparent)";
const FAINT = "color-mix(in srgb, var(--paper) 32%, transparent)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const AVATAR = "https://avatars.githubusercontent.com/u/48265597?v=4";

const FACTS = [
  { key: "base", label: "Base", value: "Accra, Ghana", tone: "var(--acid)" },
  { key: "focus", label: "Focus", value: "Frontend / Motion", tone: "var(--cobalt)" },
  { key: "status", label: "Status", value: "Open to work", tone: "var(--red)" },
] as const;

const ABOUT_CSS = `
.about-grid { display: grid; gap: clamp(2rem, 5vw, 4rem); }
@media (min-width: 56rem) { .about-grid { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr); align-items: start; } }
.about-scan-grid {
  background-image: linear-gradient(color-mix(in srgb, var(--paper) 7%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--paper) 7%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
}
`;

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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
const frameRef = useRef<HTMLButtonElement>(null);
const imgRef = useRef<HTMLImageElement>(null);
const glareRef = useRef<HTMLSpanElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const [profile, setProfile] = useState<GitHubProfile>(staticProfile);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      const data = await getGitHubData();
      if (!mounted) return;
      setProfile({
        ...data.profile,
        bio: data.profile.bio.trim() || staticProfile.bio,
      });
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const playScan = useCallback(() => {
    const line = scanRef.current;
    if (!line || !shouldAnimate()) return;

    timelineRef.current?.cancel();
    const tl = createAnimeTimeline();
    timelineRef.current = tl;
    tl.add(line, { translateY: ["-118%", "118%"], duration: 1500, ease: "inOutQuart" }, 0);
    tl.add(line, { opacity: [0, 1], duration: 160, ease: "outQuad" }, 0);
    tl.add(line, { opacity: [1, 0], duration: 420, ease: "inQuad" }, 1080);
  }, []);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", sectionRef.current ?? undefined);
      if (items.length === 0) return;

      if (!shouldAnimate()) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch: Element[]) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          });
        },
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const portrait = portraitRef.current;
      if (!portrait || !shouldAnimate()) return;

      gsap.fromTo(
        portrait,
        { yPercent: 5, scale: 1.05, autoAlpha: 0.78 },
        {
          yPercent: -5,
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: portrait,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  // Registered after the reveal batches above so the wipe tween is created last
  // and survives their overwrite: true on the shared heading target.
  useWipeReveals(sectionRef);
  useGhostDrift(sectionRef);

  // Drift lives on the photo because the figure already owns the scroll parallax.
  useGSAP(
    () => {
      const frame = frameRef.current;
      const img = imgRef.current;
      const glare = glareRef.current;
      if (!frame || !img || !shouldAnimate()) return;
      const breathe = gsap.to(img, {
        scale: 1.07,
        duration: 5.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      if (!window.matchMedia("(pointer: fine)").matches) {
        return () => {
          breathe.kill();
          gsap.set(img, { clearProps: "transform" });
        };
      }
      gsap.set(frame, { transformPerspective: 900 });
      gsap.set(glare, { xPercent: -50, autoAlpha: 0 });
      const rX = gsap.quickTo(frame, "rotationX", { duration: 0.7, ease: "power3.out" });
      const rY = gsap.quickTo(frame, "rotationY", { duration: 0.7, ease: "power3.out" });
      const gX = gsap.quickTo(glare, "x", { duration: 0.7, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const rect = frame.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rY(px * 10);
        rX(-py * 10);
        if (glare) {
          gX(px * rect.width);
          gsap.to(glare, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
        }
      };
      const onLeave = () => {
        rX(0);
        rY(0);
        if (glare) gsap.to(glare, { autoAlpha: 0, duration: 0.5, overwrite: "auto" });
      };
      frame.addEventListener("pointermove", onMove, { passive: true });
      frame.addEventListener("pointerleave", onLeave);
      return () => {
        breathe.kill();
        gsap.set(img, { clearProps: "transform" });
        frame.removeEventListener("pointermove", onMove);
        frame.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="profile"
      ref={sectionRef}
      aria-labelledby="profile-heading"
      style={sectionStyle}
    >
      <style>{ABOUT_CSS}</style>
      <span aria-hidden="true" data-ghost style={ghostStyle}>
        01
      </span>

      <div className="about-grid" data-reveal>
        <figure ref={portraitRef} style={{ margin: 0, display: "grid", gap: "0.85rem" }}>
          <button
            ref={frameRef}
            type="button"
            onClick={playScan}
            aria-label="Replay the portrait scan line"
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              aspectRatio: "1 / 1",
              padding: 0,
              border: "1px solid var(--line)",
              background: "color-mix(in srgb, var(--paper) 4%, transparent)",
              overflow: "hidden",
              cursor: "crosshair",
            }}
          >
            <Image
              ref={imgRef}
              src={AVATAR}
              alt="Portrait of Yussif Sare, frontend developer based in Accra, Ghana"
              fill
              sizes="(min-width: 56rem) 40vw, 100vw"
              style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.08)", willChange: "transform" }}
            />

            <span
              ref={glareRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-10%",
                bottom: "-10%",
                left: 0,
                width: "45%",
                opacity: 0,
                background:
                  "linear-gradient(100deg, transparent, color-mix(in srgb, var(--paper) 22%, transparent), transparent)",
                mixBlendMode: "screen",
                pointerEvents: "none",
                willChange: "transform, opacity",
              }}
            />

            <span
              aria-hidden="true"
              className="about-scan-grid"
              style={{ position: "absolute", inset: 0, opacity: 0.55 }}
            />

            <span
              ref={scanRef}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "18%",
                opacity: 0,
                background:
                  "linear-gradient(180deg, transparent, color-mix(in srgb, var(--acid) 55%, transparent) 55%, var(--paper))",
                mixBlendMode: "screen",
                willChange: "transform, opacity",
              }}
            />

            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                background: "color-mix(in srgb, var(--night) 78%, transparent)",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              <span>Scan / Replay</span>
              <span style={{ color: "var(--acid)" }}>Lonely-v3n1x</span>
            </span>
          </button>

          <figcaption
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "0.75rem",
              ...labelStyle,
            }}
          >
            <span>Portrait / 2026</span>
            <a
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--paper)", transition: `color 260ms ${EASE}` }}
            >
              @{profile.username}
            </a>
          </figcaption>
        </figure>

        <div style={{ display: "grid", gap: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
          <div style={{ display: "grid", gap: "0.9rem" }}>
            <span data-reveal style={labelStyle}>
              01 / Profile
            </span>
            <h2
              id="profile-heading"
              data-reveal
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
              Frontend
              <br />
              <span style={{ color: "var(--red)" }}>Motion</span> From
              <br />
              Accra
            </h2>
          </div>

          <p
            data-reveal
            style={{
              maxWidth: "52ch",
              margin: 0,
              fontSize: "1rem",
              lineHeight: 1.65,
              color: MUTED,
            }}
          >
            {profile.bio} I build interfaces that move with intent — scroll-linked
            sequences, timeline choreography, and layout that survives a slow
            connection. Every animation here dies quietly when the system asks for
            reduced motion.
          </p>

          <dl
            data-reveal
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "1px",
              margin: 0,
              background: "var(--line)",
              border: "1px solid var(--line)",
            }}
          >
            {[
              { label: "Public repos", value: profile.publicRepos },
              { label: "Followers", value: profile.followers },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  padding: "1rem 1.15rem",
                  background: "var(--night)",
                }}
              >
                <dt style={labelStyle}>{stat.label}</dt>
                <dd
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-archivo-black)",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em",
                    color: "var(--paper)",
                  }}
                >
                  {String(stat.value).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>

          <ul
            data-reveal
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: "0.65rem",
            }}
          >
            {FACTS.map((fact) => (
              <li
                key={fact.key}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  paddingBottom: "0.65rem",
                  borderBottom: "1px solid var(--line)",
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ minWidth: "5.5rem", color: fact.tone }}>{fact.label}</span>
                <span aria-hidden="true" style={{ color: FAINT }}>
                  —
                </span>
                <span style={{ color: "var(--paper)" }}>{fact.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
