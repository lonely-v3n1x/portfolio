"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createTimeline } from "animejs";
import Image from "next/image";
import CursorBubble from "@/components/CursorBubble";
import Opener from "@/components/Opener";
import SmoothScroll from "@/components/SmoothScroll";
import SpeedLines from "@/components/SpeedLines";
import { ArrowUpRight, MenuIcon } from "@/components/Icons";
import { githubProfile, quests, stats } from "@/data/season";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navItems = [
  { label: "Quests", href: "#quests" },
  { label: "Arsenal", href: "#arsenal" },
  { label: "Contact", href: "#contact" },
];

function AccraClock() {
  const [time, setTime] = useState("--:--:--");
  const [twelveHour, setTwelveHour] = useState(false);
  useEffect(() => {
    const update = () => {
      try {
        setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", hour12: twelveHour, minute: "2-digit", second: "2-digit", timeZone: "Africa/Accra" }));
      } catch {
        setTime(new Date().toLocaleTimeString("en-GB"));
      }
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [twelveHour]);
  return (
    <button aria-label="Toggle clock format" className="season-clock" data-cursor-label="toggle time" onClick={() => setTwelveHour((value) => !value)} title="Toggle 12/24 hour" type="button">
      {time} ACC
    </button>
  );
}

export default function SeasonExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ key: number; sub: string; title: string } | null>(null);
  const [booted, setBooted] = useState(false);

  useGSAP(
    () => {
      const shell = root.current;
      if (!shell) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const refresh = () => ScrollTrigger.refresh();
      const cleanups: Array<() => void> = [];
      window.addEventListener("load", refresh, { once: true });
      cleanups.push(() => window.removeEventListener("load", refresh));

      if (!reducedMotion) {
        const progress = shell.querySelector<HTMLElement>("[data-season-progress]");
        const level = shell.querySelector<HTMLElement>("[data-level]");
        if (progress) {
          gsap.to(progress, {
            ease: "none",
            scaleX: 1,
            scrollTrigger: {
              end: "bottom bottom",
              onUpdate: (self) => {
                if (level) level.textContent = `LVL ${Math.min(5, Math.floor(self.progress * 5) + 1)}`;
              },
              scrub: 0.3,
              start: "top top",
              trigger: shell,
            },
          });
        }

        gsap.from("[data-herochars]", { autoAlpha: 0, duration: 0.55, ease: "back.out(1.8)", rotation: () => gsap.utils.random(-14, 14), scale: 1.6, stagger: 0.045, yPercent: 110 });
        gsap.fromTo("[data-impact-ring]", { autoAlpha: 0.9, scale: 0.2 }, { autoAlpha: 0, duration: 1.1, ease: "expo.out", scale: 1 });
        gsap.from("[data-herometa]", { autoAlpha: 0, duration: 0.6, stagger: 0.1, y: 18 });

        gsap.to(".op-title", {
          ease: "none",
          opacity: 0,
          scrollTrigger: { end: "bottom 30%", scrub: 0.6, start: "top top", trigger: ".op-hero" },
          yPercent: -12,
        });

        const header = shell.querySelector<HTMLElement>(".season-header");
        if (header) {
          ScrollTrigger.create({
            end: "max",
            onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive),
            onUpdate: (self) => header.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 260),
            start: 90,
          });
        }

        const logo = shell.querySelector<HTMLElement>(".season-logo");
        if (logo) {
          const onLogoClick = () => {
            gsap.timeline()
              .to(logo, { duration: 0.09, ease: "none", rotation: -14, x: -4 })
              .to(logo, { duration: 0.09, ease: "none", rotation: 2, x: 4 })
              .to(logo, { duration: 0.35, ease: "elastic.out(1, 0.35)", rotation: 0, x: 0 });
          };
          logo.addEventListener("click", onLogoClick);
          cleanups.push(() => logo.removeEventListener("click", onLogoClick));
        }

        let masherUnlocked = false;
        const levelMeter = shell.querySelector<HTMLElement>("[data-level]");
        if (levelMeter) {
          const onLevelClick = () => {
            gsap.fromTo(levelMeter, { scale: 1 }, { duration: 0.5, ease: "elastic.out(1, 0.35)", scale: 1.6 });
            if (!masherUnlocked) {
              masherUnlocked = true;
              window.dispatchEvent(new CustomEvent("season:unlock", { detail: ["BUTTON MASHER", "you clicked everything"] }));
            }
          };
          levelMeter.addEventListener("click", onLevelClick);
          cleanups.push(() => levelMeter.removeEventListener("click", onLevelClick));
        }

        shell.querySelectorAll<HTMLElement>(".season-nav a").forEach((link) => {
          const onPunch = () => gsap.fromTo(link, { scale: 0.9 }, { duration: 0.4, ease: "back.out(2.2)", scale: 1 });
          link.addEventListener("pointerdown", onPunch);
          cleanups.push(() => link.removeEventListener("pointerdown", onPunch));
        });

        gsap.utils.toArray<HTMLElement>("[data-ghostnum]").forEach((ghost) => {
          gsap.to(ghost, { ease: "none", scrollTrigger: { end: "bottom top", scrub: 1, start: "top bottom", trigger: ghost.parentElement }, yPercent: -18 });
        });

        gsap.utils.toArray<HTMLElement>("[data-wipe-heading]").forEach((heading) => {
          gsap.fromTo(heading, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", y: 34 }, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power4.out", scrollTrigger: { once: true, start: "top 86%", trigger: heading }, y: 0 });
        });

        const skewTargets = gsap.utils.toArray<HTMLElement>("[data-skew]");
        const clampSkew = gsap.utils.clamp(-7, 7);
        const skewProxy = { skew: 0 };
        const skewSetter = (value: number) => skewTargets.forEach((target) => {
          target.style.transform = `skewX(${value}deg)`;
        });
        ScrollTrigger.create({
          end: "max",
          onUpdate: (self) => {
            const skew = clampSkew(self.getVelocity() / -900);
            if (Math.abs(skew) > Math.abs(skewProxy.skew)) {
              skewProxy.skew = skew;
              gsap.to(skewProxy, { duration: 0.6, ease: "power3", onUpdate: () => skewSetter(skewProxy.skew), overwrite: true, skew: 0 });
            }
          },
          start: 0,
        });

        const slashLayer = shell.querySelector<HTMLElement>("[data-slashes]");
        let lastSlashY = window.scrollY;
        ScrollTrigger.create({
          end: "max",
          onUpdate: (self) => {
            const y = self.scroll();
            if (!slashLayer || Math.abs(y - lastSlashY) < 480) return;
            lastSlashY = y;
            if (slashLayer.childElementCount > 2) return;
            const slash = document.createElement("span");
            slash.className = "scroll-slash";
            slash.style.top = `${6 + Math.random() * 82}%`;
            slash.style.transform = `rotate(${-26 + Math.random() * 14}deg)`;
            slashLayer.appendChild(slash);
            gsap.fromTo(slash, { opacity: 0, scaleX: 0 }, {
              duration: 0.22,
              ease: "power4.in",
              onComplete: () => {
                gsap.to(slash, { delay: 0.18, duration: 0.5, onComplete: () => slash.remove(), opacity: 0 });
              },
              opacity: 1,
              scaleX: 1,
            });
          },
          start: 0,
        });
        cleanups.push(() => {
          if (slashLayer) slashLayer.innerHTML = "";
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, { autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { once: true, start: "top 88%", trigger: element }, y: 26 });
        });
        gsap.utils.toArray<HTMLElement>("[data-stat-fill]").forEach((fill) => {
          gsap.fromTo(fill, { scaleX: 0 }, { duration: 1.1, ease: "expo.out", scaleX: Number(fill.dataset.statFill || "0") / 100, scrollTrigger: { once: true, start: "top 85%", trigger: fill } });
        });
        gsap.utils.toArray<HTMLElement>("[data-quest-row]").forEach((row, index) => {
          gsap.from(row, { autoAlpha: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { once: true, start: "top 90%", trigger: row }, x: index % 2 === 0 ? -34 : 34 });
        });
      }

      if (finePointer && !reducedMotion) {
        const hero = shell.querySelector<HTMLElement>("[data-speedhero]");
        const heroTitle = shell.querySelector<HTMLElement>(".op-title");
        const heroChars = shell.querySelectorAll<HTMLElement>("[data-herochars]");
        if (hero && heroTitle && heroChars.length) {
          const repellers = Array.from(heroChars).map((character) => ({
            character,
            xTo: gsap.quickTo(character, "x", { duration: 0.5, ease: "power3" }),
            yTo: gsap.quickTo(character, "y", { duration: 0.5, ease: "power3" }),
          }));
          const onRepel = (event: PointerEvent) => {
            repellers.forEach((repeller) => {
              const bounds = repeller.character.getBoundingClientRect();
              const dx = bounds.left + bounds.width / 2 - event.clientX;
              const dy = bounds.top + bounds.height / 2 - event.clientY;
              const distance = Math.hypot(dx, dy) || 1;
              const force = Math.min(60, 9000 / distance);
              repeller.xTo((dx / distance) * force * 0.4);
              repeller.yTo((dy / distance) * force * 0.4);
            });
          };
          const onCalm = () => repellers.forEach((repeller) => {
            repeller.xTo(0);
            repeller.yTo(0);
          });
          const onGlitch = () => {
            gsap.fromTo(heroChars, { skewX: 0 }, { duration: 0.07, ease: "none", onComplete: () => gsap.set(heroChars, { skewX: 0, x: 0 }), repeat: 3, skewX: () => gsap.utils.random(-14, 14), yoyo: true });
          };
          const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&/";
          const onScramble = () => {
            heroChars.forEach((character, index) => {
              if (character.dataset.final === undefined) character.dataset.final = character.textContent ?? "";
              const proxy = { progress: 0 };
              gsap.to(proxy, {
                delay: index * 0.03,
                duration: 0.5,
                ease: "none",
                onComplete: () => {
                  character.textContent = character.dataset.final ?? "";
                },
                onUpdate: () => {
                  character.textContent = proxy.progress < 1 ? glyphs[Math.floor(Math.random() * glyphs.length)] : (character.dataset.final ?? "");
                },
                progress: 1,
              });
            });
          };
          hero.addEventListener("pointermove", onRepel);
          hero.addEventListener("pointerleave", onCalm);
          heroTitle.addEventListener("pointerenter", onGlitch);
          hero.addEventListener("pointerdown", onScramble);
          cleanups.push(() => {
            hero.removeEventListener("pointermove", onRepel);
            hero.removeEventListener("pointerleave", onCalm);
            heroTitle.removeEventListener("pointerenter", onGlitch);
            hero.removeEventListener("pointerdown", onScramble);
          });
        }
        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((element) => {
          const moveX = gsap.quickTo(element, "x", { duration: 0.5, ease: "power3" });
          const moveY = gsap.quickTo(element, "y", { duration: 0.5, ease: "power3" });
          const onMove = (event: PointerEvent) => {
            const bounds = element.getBoundingClientRect();
            moveX((event.clientX - (bounds.left + bounds.width / 2)) * 0.18);
            moveY((event.clientY - (bounds.top + bounds.height / 2)) * 0.18);
          };
          const onLeave = () => {
            moveX(0);
            moveY(0);
          };
          element.addEventListener("pointermove", onMove);
          element.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            element.removeEventListener("pointermove", onMove);
            element.removeEventListener("pointerleave", onLeave);
          });
        });
      }

      if (coarsePointer && !reducedMotion) {
        const press = (event: PointerEvent) => {
          const target = event.target;
          if (target instanceof Element) {
            target.closest<HTMLElement>("[data-quest-row],.op-button,.game-overlay button")?.classList.add("is-pressed");
          }
        };
        const release = () => shell.querySelectorAll(".is-pressed").forEach((pressed) => pressed.classList.remove("is-pressed"));
        shell.addEventListener("pointerdown", press);
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
        cleanups.push(() => {
          shell.removeEventListener("pointerdown", press);
          window.removeEventListener("pointerup", release);
          window.removeEventListener("pointercancel", release);
        });
      }

      const speedHeroEl = shell.querySelector<HTMLElement>("[data-speedhero]");
      let pressTimer: number | undefined;
      const onPressStart = () => {
        window.clearTimeout(pressTimer);
        pressTimer = window.setTimeout(() => {
          const ring = shell.querySelector<HTMLElement>("[data-impact-ring]");
          if (ring && !reducedMotion) {
            gsap.fromTo(ring, { autoAlpha: 0.9, scale: 0.2 }, { autoAlpha: 0, duration: 1, ease: "expo.out", scale: 1 });
          }
          if (!reducedMotion) {
            gsap.fromTo(".op-title", { x: 0 }, { clearProps: "x", duration: 0.06, repeat: 3, x: 6, yoyo: true });
          }
          try {
            navigator.vibrate(40);
          } catch {
            /* vibration unavailable */
          }
        }, 550);
      };
      const onPressEnd = () => window.clearTimeout(pressTimer);
      if (speedHeroEl) {
        speedHeroEl.addEventListener("pointerdown", onPressStart);
        speedHeroEl.addEventListener("pointerup", onPressEnd);
        speedHeroEl.addEventListener("pointercancel", onPressEnd);
        speedHeroEl.addEventListener("pointerleave", onPressEnd);
        cleanups.push(() => {
          speedHeroEl.removeEventListener("pointerdown", onPressStart);
          speedHeroEl.removeEventListener("pointerup", onPressEnd);
          speedHeroEl.removeEventListener("pointercancel", onPressEnd);
          speedHeroEl.removeEventListener("pointerleave", onPressEnd);
        });
      }

      const onRippleDown = (event: PointerEvent) => {
        if (reducedMotion) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const control = target.closest<HTMLElement>(".op-button, .game-overlay button, [data-quest-row]");
        if (!control) return;
        const bounds = control.getBoundingClientRect();
        const size = Math.max(bounds.width, bounds.height) * 2.1;
        const ripple = document.createElement("span");
        ripple.className = "click-ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - bounds.left}px`;
        ripple.style.top = `${event.clientY - bounds.top}px`;
        control.appendChild(ripple);
        gsap.fromTo(ripple, { opacity: 0.28, scale: 0 }, { duration: 0.65, ease: "power2.out", onComplete: () => ripple.remove(), opacity: 0, scale: 1 });
      };
      shell.addEventListener("pointerdown", onRippleDown);
      cleanups.push(() => shell.removeEventListener("pointerdown", onRippleDown));

      const sections = shell.querySelectorAll<HTMLElement>("[data-section]");
      const navLinks = shell.querySelectorAll<HTMLElement>("[data-nav-target]");
      const visited = new Set<string>();
      const achievements: Record<string, [string, string]> = {
        quests: ["QUEST ACCEPTED", "six missions on the board"],
        arsenal: ["GEARED UP", "you inspected the arsenal"],
        profile: ["ORIGIN STORY", "you met the protagonist"],
        contact: ["FINAL TRANSMISSION", "you reached the last episode"],
      };
      sections.forEach((section) => {
        const target = section.dataset.section;
        ScrollTrigger.create({
          end: "bottom 45%",
          onToggle: (self) => {
            navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.navTarget === target && self.isActive));
            if (self.isActive && target && achievements[target] && !visited.has(target)) {
              visited.add(target);
              window.dispatchEvent(new CustomEvent("season:unlock", { detail: achievements[target] }));
            }
            if (self.isActive && finePointer) {
              gsap.fromTo(section, { x: 0 }, { clearProps: "x", duration: 0.05, repeat: 3, x: 3, yoyo: true });
            }
          },
          start: "top 45%",
          trigger: section,
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: root },
  );

  useEffect(() => {
    const onUnlock = (event: Event) => {
      const [title, sub] = (event as CustomEvent<[string, string]>).detail;
      setToast({ key: Date.now(), sub, title });
    };
    window.addEventListener("season:unlock", onUnlock);
    return () => window.removeEventListener("season:unlock", onUnlock);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const element = root.current?.querySelector<HTMLElement>("[data-toast]");
    if (!element) return;
    gsap.fromTo(element, { autoAlpha: 0, scale: 0.94, y: 24 }, { autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)", scale: 1, y: 0 });
    const timer = window.setTimeout(() => {
      gsap.to(element, { autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: () => setToast((current) => (current?.key === toast.key ? null : current)), y: 12 });
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const code = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let position = 0;
    const burst = () => {
      const shell = root.current;
      if (!shell || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const layer = shell.querySelector<HTMLElement>("[data-confetti]");
      if (!layer) return;
      const colors = ["#ff3131", "#d8ff4f", "#f3f0e8", "#4357ff", "#141414"];
      for (let i = 0; i < 70; i += 1) {
        const piece = document.createElement("span");
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[i % colors.length];
        layer.appendChild(piece);
        gsap.to(piece, {
          duration: 1.4 + Math.random(),
          ease: "power1.in",
          keyframes: [{ y: -(120 + Math.random() * 220), duration: 0.4 }, { y: window.innerHeight * 0.7, duration: 1.1 }],
          onComplete: () => piece.remove(),
          rotation: Math.random() * 720 - 360,
          x: (Math.random() - 0.5) * 260,
        });
      }
      window.dispatchEvent(new CustomEvent("season:unlock", { detail: ["CHEAT CODE", "up up down down accepted"] }));
    };
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      position = key === code[position] ? position + 1 : key === code[0] ? 1 : 0;
      if (position === code.length) {
        position = 0;
        burst();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const shell = root.current;
    if (!shell || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const trigger = shell.querySelector<HTMLElement>("[data-profile-trigger]");
    if (!trigger) return;
    const onClick = () => {
      const frame = trigger.querySelector<HTMLElement>("[data-profile-frame]");
      const scan = trigger.querySelector<HTMLElement>(".profile-portrait-scan");
      const ghost = trigger.querySelector<HTMLElement>("[data-profile-ghost]");
      const timeline = createTimeline({ defaults: { ease: "outExpo" } });
      if (frame) timeline.add(frame, { duration: 700, rotate: [-2, 2, -1.2, 0], scale: [1, 0.965, 1.02, 1] }, 0);
      if (scan) timeline.add(scan, { duration: 650, ease: "inOutQuad", top: ["-34%", "100%"] }, 0);
      if (ghost) timeline.add(ghost, { duration: 700, opacity: [0.38, 0.72, 0.38] }, 0);
    };
    trigger.addEventListener("click", onClick);
    return () => trigger.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="season-root" id="top" ref={root}>
      {!booted ? <Opener onDone={() => setBooted(true)} /> : null}
      <div aria-hidden="true" className="season-progress"><span data-season-progress /></div>
      <div aria-hidden="true" className="slash-layer" data-slashes />
      <header className="season-header">
        <span aria-hidden="true" className="header-slash" />
        <div className="season-header-inner">
          <a className="season-logo" data-cursor-label="home" data-magnetic href="#top" onClick={() => setMenuOpen(false)}>
            <span>YS</span>
            <strong>folio — 26</strong>
          </a>
          <nav aria-label="Season navigation" className="season-nav">
            {navItems.map((item) => <a data-cursor-label="open" data-nav-target={item.href} href={item.href} key={item.href}><span className="roll"><span>{item.label}</span><span aria-hidden="true">{item.label}</span></span></a>)}
          </nav>
          <div className="season-status"><AccraClock /><span data-level>LVL 1</span></div>
          <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} className="season-menu-button" onClick={() => setMenuOpen(!menuOpen)} type="button"><MenuIcon open={menuOpen} /></button>
        </div>
        <div className={`season-menu${menuOpen ? " is-open" : ""}`}>
          {navItems.map((item, index) => <a data-menu-link data-nav-target={item.href} href={item.href} key={item.href} onClick={() => setMenuOpen(false)}><span>EP.0{index + 1}</span>{item.label}<ArrowUpRight size={15} /></a>)}
        </div>
      </header>

      <main>
        <section className="op-hero" data-section="home" data-speedhero>
          <SpeedLines />
          <div className="op-hero-top" data-herometa><span>EST. 2026</span><span>ACCRA / GHANA</span></div>
          <div aria-hidden="true" className="moon-mark" data-herometa />
          <h1 className="op-title">
            <span className="op-line">{Array.from("YUSSIF").map((character, index) => <span data-herochars key={`y-${index}`}>{character}</span>)}</span>
            <span className="op-line">{Array.from("SARE").map((character, index) => <span className="op-outline" data-herochars key={`s-${index}`}>{character}</span>)}</span>
          </h1>
          <div aria-hidden="true" className="op-impact"><span data-impact-ring /></div>
          <p className="op-tag" data-herometa>frontend developer — interfaces with impact frames.</p>
          <div className="op-actions" data-herometa>
            <a className="op-button" data-cursor-label="start quests" data-magnetic href="#quests">START ▸</a>
            <a className="op-ghost" data-cursor-label="say hi" href="#contact">transmission</a>
          </div>
          <div aria-hidden="true" className="op-badge" data-herometa>
            <svg viewBox="0 0 120 120"><defs><path d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" id="badge-circle" /></defs><text><textPath href="#badge-circle">OPEN FOR WORK • YUSSIF SARE • OPEN FOR WORK • </textPath></text></svg>
          </div>
          <div className="op-scroll" data-herometa><span>SCROLL</span><i /></div>
        </section>

        <section className="episode" data-section="profile" id="profile">
          <span aria-hidden="true" className="ep-ghost" data-ghostnum>01</span>
          <div className="episode-head" data-reveal><span>EP.01</span><h2 data-wipe-heading data-skew>ORIGIN<br /><em>STORY</em></h2></div>
          <div className="episode-grid">
            <button aria-label="Replay portrait animation" className="profile-portrait" data-profile-trigger type="button">
              <div className="profile-portrait-ghost" aria-hidden="true" data-profile-ghost />
              <div className="profile-portrait-frame" data-profile-frame>
                <Image alt="Portrait of Yussif Sare" fill priority={false} sizes="(max-width: 820px) 86vw, 340px" src="/profile.jpg" />
                <span aria-hidden="true" className="profile-portrait-scan" />
              </div>
              <div className="profile-portrait-meta"><span>ys / 001</span><span>click to replay</span></div>
            </button>
            <div className="episode-copy" data-reveal>
              <p className="episode-lede">“{githubProfile.bio}.” — that&apos;s Dave, aka {githubProfile.username}, studying at Accra Technical University with {githubProfile.publicRepos} public repos and counting.</p>
              <p>From C systems and Python hardware hacks to interfaces people actually touch — this season is the frontend cut.</p>
              <div className="fact-row"><span>BASE</span><strong>Accra, Ghana</strong></div>
              <div className="fact-row"><span>FOCUS</span><strong>frontend / motion</strong></div>
              <div className="fact-row"><span>STATUS</span><strong>open for work</strong></div>
            </div>
          </div>
        </section>

        <section className="episode" data-section="arsenal" id="arsenal">
          <span aria-hidden="true" className="ep-ghost" data-ghostnum>02</span>
          <div className="episode-head" data-reveal><span>EP.02</span><h2 data-wipe-heading data-skew>THE<br /><em>ARSENAL</em></h2></div>
          <div className="stat-list">
            {stats.map((stat) => (
              <div className="stat-row" data-reveal key={stat.name}>
                <div className="stat-top"><span>{stat.name}</span><span>{stat.value}</span></div>
                <div className="stat-track"><i data-stat-fill={stat.value} /></div>
                <small>{stat.flavor}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="episode" data-section="quests" id="quests">
          <span aria-hidden="true" className="ep-ghost" data-ghostnum>03</span>
          <div className="episode-head" data-reveal><span>EP.03</span><h2 data-wipe-heading data-skew>SIDE<br /><em>QUESTS</em></h2></div>
          <div className="quest-list">
            {quests.map((quest) => (
              <a className="quest-row" data-cursor-label="accept quest" data-quest-row href={quest.repo} key={quest.id} rel="noreferrer" target="_blank">
                <span className={`quest-rank rank-${quest.rank}`}>{quest.rank}</span>
                <span className="quest-main"><strong>{quest.title}</strong><small>{quest.description}</small>{quest.preview ? <span className="quest-preview"><Image alt={`${quest.title} preview`} height={120} src={quest.preview} width={192} /></span> : null}</span>
                <span className="quest-genre">{quest.genre}</span>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        </section>

        <div aria-hidden="true" className="op-ticker"><div className="op-ticker-track">{["YUSSIF SARE", "FRONTEND DEVELOPER", "MOTION", "ACCRA / GHANA", "OPEN FOR WORK"].map((word) => <span key={word}>{word}<i>✦</i></span>)}{["YUSSIF SARE", "FRONTEND DEVELOPER", "MOTION", "ACCRA / GHANA", "OPEN FOR WORK"].map((word) => <span key={`again-${word}`}>{word}<i>✦</i></span>)}</div></div>

        <section className="episode" data-section="contact" id="contact">
          <span aria-hidden="true" className="ep-ghost" data-ghostnum>04</span>
          <div className="episode-head" data-reveal><span>FINAL</span><h2 data-wipe-heading data-skew>SEND A<br /><em>SIGNAL</em></h2></div>
          <div className="episode-copy" data-reveal>
            <p className="episode-lede">Got a quest, a role, or a weird idea? My inbox is the next episode.</p>
            <div className="contact-rows">
              <a data-cursor-label="email me" href="mailto:hello@example.com">hello@example.com <ArrowUpRight size={16} /></a>
              <a data-cursor-label="view github" href={githubProfile.url} rel="noreferrer" target="_blank">github.com/{githubProfile.username} <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="season-footer">
        <span>TO BE CONTINUED ▶</span>
        <a data-cursor-label="back to top" href="#top">Back to top ↑</a>
      </footer>

      <div aria-hidden="true" className="confetti-layer" data-confetti />
      {toast ? <div className="toast" data-toast key={toast.key} role="status"><span>trophy unlocked</span><strong>{toast.title}</strong><small>{toast.sub}</small></div> : null}
      <SmoothScroll />
      <CursorBubble />
    </div>
  );
}
