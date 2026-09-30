"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP, isReducedMotion, splitTextToChars } from "@/lib/animations";
import { getMood } from "@/lib/mood";
import Ticker from "./Ticker";
import { useMagnetic, useRipple } from "./motion";

const ThreeField = dynamic(() => import("./ThreeField"), {
  ssr: false,
  loading: () => <ThreeFieldPlaceholder />,
});

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@/\\";
const REACH = 210;
const PUSH = 54;
const SKEW_MAX = 6.5;
const SKEW_GAIN = 11;
const SKEW_SETTLE = 140;
const TILT_RANGE = 12;

type OrientationEventConstructor = {
  requestPermission?: () => Promise<string>;
};

function orientationSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(pointer: coarse)").matches) return false;
  return "DeviceOrientationEvent" in window;
}

// Gradient must match ThreeField's .field background or the chunk swap flashes.
function ThreeFieldPlaceholder() {
  return (
    <div className="field" aria-hidden="true">
      <style jsx>{`
        .field {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(120% 92% at 20% 14%, rgba(67, 87, 255, 0.32), transparent 62%),
            radial-gradient(88% 70% at 82% 78%, rgba(216, 255, 79, 0.16), transparent 64%),
            radial-gradient(70% 60% at 52% 46%, rgba(255, 49, 49, 0.12), transparent 72%),
            var(--night);
        }
      `}</style>
    </div>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title) return;

    const source = Array.from(title.textContent ?? "").map((c) => (c === " " ? "\u00A0" : c));
    const chars = splitTextToChars(title);
    for (const char of chars) char.style.display = "inline-block";

    if (isReducedMotion()) return;

    const reveals = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]", root);
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(chars, {
        yPercent: 120,
        rotateX: -48,
        opacity: 0,
        duration: 1.15,
        stagger: 0.032,
        transformOrigin: "50% 100%",
      })
      .from(reveals, { y: 26, opacity: 0, duration: 0.85, stagger: 0.08 }, "-=0.62");

    const pushers = chars.map((char) => ({
      x: gsap.quickTo(char, "x", { duration: 0.8, ease: "power3.out" }),
      y: gsap.quickTo(char, "y", { duration: 0.8, ease: "power3.out" }),
    }));
    let rects: DOMRect[] = [];
    const measure = () => {
      rects = chars.map((char) => char.getBoundingClientRect());
    };
    measure();

    const repel = (clientX: number, clientY: number) => {
      for (let i = 0; i < chars.length; i += 1) {
        const rect = rects[i];
        if (!rect) continue;
        const dx = clientX - (rect.left + rect.width / 2);
        const dy = clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.max(0, 1 - dist / REACH) ** 2 * PUSH;
        pushers[i].x((dx / dist) * force);
        pushers[i].y((dy / dist) * force);
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      // Touch devices also emit pointermove; touchmove owns those to avoid double work.
      if (event.pointerType === "touch") return;
      repel(event.clientX, event.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) repel(touch.clientX, touch.clientY);
    };
    const onReset = () => {
      for (const pusher of pushers) {
        pusher.x(0);
        pusher.y(0);
      }
    };

    let scramble: ReturnType<typeof gsap.to> | null = null;
    const onScramble = () => {
      if (scramble) scramble.kill();
      const state = { t: 0 };
      scramble = gsap.to(state, {
        t: 1,
        duration: 0.85,
        ease: "none",
        onUpdate: () => {
          for (let i = 0; i < chars.length; i += 1) {
            const local = gsap.utils.clamp(0, 1, (state.t - (i / chars.length) * 0.4) / 0.6);
            chars[i].textContent =
              local >= 1 ? source[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
        },
        onComplete: () => {
          for (let i = 0; i < chars.length; i += 1) chars[i].textContent = source[i];
        },
      });
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onReset);
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onReset, { passive: true });
    root.addEventListener("touchcancel", onReset, { passive: true });
    title.addEventListener("pointerdown", onScramble);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onReset);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onReset);
      root.removeEventListener("touchcancel", onReset);
      title.removeEventListener("pointerdown", onScramble);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      if (scramble) scramble.kill();
    };
  });

  useMagnetic(rootRef);
  useRipple(rootRef);

  const [tiltReady, setTiltReady] = useState(false);
  const [tiltOn, setTiltOn] = useState(false);
  const [moodLabel, setMoodLabel] = useState<string | null>(null);

  useGSAP(
    () => {
      setMoodLabel(getMood().label);
      setTiltReady(orientationSupported() && !isReducedMotion());
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!tiltOn || isReducedMotion()) return;
      const root = rootRef.current;
      const inner = root?.querySelector<HTMLElement>(".hero__inner");
      const cue = root?.querySelector<HTMLElement>(".hero__cue");
      if (!root || !inner) return;
      const innerX = gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" });
      const innerY = gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" });
      const cueX = cue
        ? gsap.quickTo(cue, "x", { duration: 1.1, ease: "power3.out" })
        : null;
      const cueY = cue
        ? gsap.quickTo(cue, "y", { duration: 1.1, ease: "power3.out" })
        : null;
      const onTilt = (event: DeviceOrientationEvent): void => {
        if (event.gamma === null || event.beta === null) return;
        const px = gsap.utils.clamp(-1, 1, event.gamma / 30);
        const py = gsap.utils.clamp(-1, 1, (event.beta - 40) / 30);
        innerX(px * TILT_RANGE);
        innerY(py * TILT_RANGE);
        cueX?.(-px * TILT_RANGE * 1.5);
        cueY?.(-py * TILT_RANGE * 1.5);
      };
      window.addEventListener("deviceorientation", onTilt);
      return () => {
        window.removeEventListener("deviceorientation", onTilt);
        gsap.set([inner, cue], { clearProps: "transform" });
      };
    },
    { scope: rootRef, dependencies: [tiltOn] },
  );

  const enableTilt = (): void => {
    const ctor = window.DeviceOrientationEvent as unknown as
      | OrientationEventConstructor
      | undefined;
    const request = ctor?.requestPermission;
    if (typeof request === "function") {
      request
        .call(ctor)
        .then((result) => {
          if (result === "granted") setTiltOn(true);
        })
        .catch(() => undefined);
      return;
    }
    setTiltOn(true);
  };

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      const title = titleRef.current;
      if (!title) return;

      const skewTo = gsap.quickTo(title, "skewX", {
        duration: 0.6,
        ease: "power3.out",
      });
      let lastY = window.scrollY;
      let lastAt = performance.now();
      let settleTimer = 0;

      const onScroll = () => {
        if (title.getBoundingClientRect().bottom < 0) return;

        const now = performance.now();
        const y = window.scrollY;
        const elapsed = Math.max(now - lastAt, 8);
        skewTo(
          gsap.utils.clamp(-SKEW_MAX, SKEW_MAX, ((y - lastY) / elapsed) * SKEW_GAIN),
        );
        lastY = y;
        lastAt = now;

        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => skewTo(0), SKEW_SETTLE);
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.clearTimeout(settleTimer);
        gsap.killTweensOf(title);
        gsap.set(title, { clearProps: "transform,willChange" });
      };
    },
    { scope: rootRef },
  );

  return (
    <>
      <section id="top" className="hero" ref={rootRef}>
        <ThreeField />
        <div className="hero__grid" aria-hidden="true" />

        <div className="hero__inner">
          <div className="hero__meta">
            <p className="hero__place" data-hero-reveal>
              <i className="hero__dot" />
              Accra, Ghana
            </p>
            <p className="hero__role" data-hero-reveal>
              Frontend / Motion
            </p>
            {moodLabel ? (
              <p className="hero__mood" data-hero-reveal>
                — {moodLabel}
              </p>
            ) : null}
          </div>

          <h1 className="hero__title" ref={titleRef} aria-label="Yussif Sare">
            YUSSIF SARE
          </h1>

          <p className="hero__tagline" data-hero-reveal>
            I engineer and animate the web — <em>interfaces with weight, motion and intent.</em>
          </p>

          <div className="hero__actions">
            <span className="hero__mag" data-magnetic>
              <a
                className="hero__btn hero__btn--solid"
                data-hero-reveal
                data-ripple
                href="#work"
              >
                See the work
              </a>
            </span>
            <span className="hero__mag" data-magnetic>
              <a className="hero__btn" data-hero-reveal href="#contact">
                Start a project
              </a>
            </span>
          </div>
        </div>

        <a className="hero__cue" data-hero-reveal href="#work" aria-label="Scroll to the work section">
          <span className="hero__cueTrack">
            <span className="hero__cueDot" />
          </span>
          Scroll
        </a>

        {tiltReady && !tiltOn ? (
          <button
            type="button"
            onClick={enableTilt}
            style={{
              position: "absolute",
              right: "var(--pad)",
              bottom: "clamp(1.5rem, 4vh, 2.5rem)",
              zIndex: 2,
              border: "1px solid var(--line)",
              borderRadius: 999,
              background: "color-mix(in srgb, var(--night) 70%, transparent)",
              padding: "0.55rem 1rem",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--acid)",
            }}
          >
            Enable tilt
          </button>
        ) : null}

        <style jsx>{`
          .hero {
            --pad: clamp(1.25rem, 5vw, 5rem);
            --gap: clamp(0.5rem, 1.6vw, 1.25rem);
            position: relative;
            isolation: isolate;
            display: grid;
            align-content: end;
            min-height: 100svh;
            min-height: 100dvh;
            padding: var(--pad);
            padding-bottom: clamp(4.5rem, 10vh, 7rem);
            overflow: hidden;
            border-bottom: 1px solid var(--line);
          }
          .hero__grid {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            background-image: linear-gradient(90deg, var(--line) 1px, transparent 1px);
            background-size: 25% 100%;
            opacity: 0.5;
            -webkit-mask-image: linear-gradient(180deg, transparent, #000 28%, #000 72%, transparent);
            mask-image: linear-gradient(180deg, transparent, #000 28%, #000 72%, transparent);
          }
          .hero__inner {
            position: relative;
            z-index: 2;
            display: grid;
            gap: clamp(0.75rem, 2vw, 1.5rem);
          }
          .hero__meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--gap);
            padding-bottom: var(--gap);
            border-bottom: 1px solid var(--line);
            font-family: var(--font-dm-mono);
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--paper);
            opacity: 0.7;
          }
          .hero__place,
          .hero__role {
            margin: 0;
          }
          .hero__dot {
            display: inline-block;
            width: 7px;
            height: 7px;
            margin-right: 0.7em;
            border-radius: 50%;
            background: var(--acid);
            animation: hero-pulse 2.4s ease-out infinite;
          }
          @keyframes hero-pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(216, 255, 79, 0.55);
            }
            70%,
            100% {
              box-shadow: 0 0 0 12px rgba(216, 255, 79, 0);
            }
          }
          .hero__title {
            margin: 0;
            font-family: var(--font-archivo-black);
            font-weight: 400;
            font-size: clamp(2.75rem, 11vw, 12rem);
            line-height: 0.84;
            letter-spacing: -0.045em;
            text-transform: uppercase;
            white-space: nowrap;
            max-width: 100%;
            color: var(--paper);
            perspective: 700px;
            cursor: crosshair;
          }
          .hero__tagline {
            margin: 0;
            max-width: 46ch;
            font-size: clamp(1rem, 1.35vw, 1.3rem);
            line-height: 1.45;
            color: var(--paper);
            opacity: 0.78;
          }
          .hero__tagline em {
            font-style: normal;
            color: var(--acid);
          }
          .hero__actions {
            display: flex;
            flex-wrap: wrap;
            gap: var(--gap);
            margin-top: clamp(0.25rem, 1.2vw, 1rem);
          }
          .hero__mag {
            display: inline-flex;
          }
          .hero__btn {
            display: inline-flex;
            align-items: center;
            padding: 0.9em 1.6em;
            border: 1px solid var(--line);
            border-radius: 999px;
            font-family: var(--font-dm-mono);
            font-size: 0.75rem;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--paper);
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.35s,
              color 0.35s, border-color 0.35s;
          }
          .hero__btn:hover {
            transform: translateY(-3px);
            border-color: var(--paper);
          }
          .hero__btn--solid {
            background: var(--acid);
            border-color: var(--acid);
            color: var(--night);
          }
          .hero__btn--solid:hover {
            background: var(--paper);
            border-color: var(--paper);
          }
          .hero__cue {
            position: absolute;
            left: var(--pad);
            bottom: clamp(1.5rem, 4vh, 2.5rem);
            z-index: 2;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            font-family: var(--font-dm-mono);
            font-size: 0.65rem;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            opacity: 0.6;
          }
          .hero__cueTrack {
            position: relative;
            display: block;
            width: 1px;
            height: 54px;
            overflow: hidden;
            background: var(--line);
          }
          .hero__cueDot {
            position: absolute;
            inset-inline: 0;
            top: 0;
            height: 40%;
            background: var(--acid);
            animation: hero-cue 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          @keyframes hero-cue {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(250%);
            }
          }
          @media (max-width: 819px) {
            .hero {
              min-height: 92svh;
              min-height: 92dvh;
            }
            .hero__meta {
              font-size: 0.62rem;
              letter-spacing: 0.14em;
            }
            .hero__grid {
              background-size: 50% 100%;
            }
            .hero__cueTrack {
              height: 38px;
            }
          }
        `}</style>
      </section>

      <Ticker />
    </>
  );
}
