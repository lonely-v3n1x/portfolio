"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

gsap.registerPlugin(useGSAP);

export default function CursorBubble() {
  const bubble = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const element = bubble.current;
      if (!element || !contextSafe || !window.matchMedia("(pointer: fine)").matches) return;
      const tag = element.querySelector<HTMLElement>(".cursor-tag");

      let idleFloat: gsap.core.Tween | undefined;
      let idleTimer: ReturnType<typeof gsap.delayedCall> | undefined;
      let hovering = false;
      let resting = false;

      gsap.set(element, { autoAlpha: 1, scale: 0.55, xPercent: -50, yPercent: -50 });
      const moveX = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3" });
      const moveY = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3" });
      const setState = contextSafe((active: boolean) => {
        gsap.killTweensOf(element, "autoAlpha,scale");
        gsap.to(element, {
          autoAlpha: 1,
          duration: active ? 0.55 : 0.25,
          ease: active ? "elastic.out(1, 0.45)" : "power2.out",
          scale: active ? 1 : 0.55,
        });
        element.classList.toggle("is-hot", active);
      });
      const startIdleFloat = contextSafe(() => {
        if (idleFloat) return;
        idleFloat = gsap.to(element, { duration: 2.2, ease: "sine.inOut", repeat: -1, y: "+=10", yoyo: true });
      });
      const stopIdleFloat = contextSafe(() => {
        idleTimer?.kill();
        idleTimer = undefined;
        idleFloat?.kill();
        idleFloat = undefined;
      });
      const scheduleIdle = contextSafe(() => {
        idleTimer?.kill();
        idleTimer = gsap.delayedCall(1.2, () => startIdleFloat());
      });
      const hideBubble = contextSafe(() => {
        stopIdleFloat();
        gsap.killTweensOf(element, "autoAlpha,scale");
        gsap.to(element, { autoAlpha: 0, duration: 0.25, ease: "power2.out" });
      });
      const onPointerMove = (event: PointerEvent) => {
        stopIdleFloat();
        moveX(event.clientX + 12);
        moveY(event.clientY - 12);
        if (!hovering) {
          if (!resting) {
            setState(false);
            resting = true;
          }
          scheduleIdle();
        } else {
          resting = false;
        }
      };
      const onPointerOver = (event: PointerEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const label = target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel;
        if (tag) tag.textContent = label ?? "open";
        hovering = Boolean(label);
        resting = false;
        if (hovering) {
          stopIdleFloat();
          setState(true);
        }
      };
      const onPointerOut = (event: PointerEvent) => {
        const next = event.relatedTarget;
        if (next instanceof Element && next.closest("[data-cursor-label]")) return;
        hovering = false;
        resting = true;
        setState(false);
        scheduleIdle();
      };
      const onPointerLeave = () => {
        hovering = false;
        resting = false;
        hideBubble();
      };

      window.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
      scheduleIdle();

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("pointerout", onPointerOut);
        document.documentElement.removeEventListener("pointerleave", onPointerLeave);
        idleTimer?.kill();
        idleFloat?.kill();
      };
    },
    { scope: bubble },
  );

  return (
    <div aria-hidden="true" className="cursor-bubble" ref={bubble}>
      <span className="cursor-reticle" />
      <span className="cursor-dot" />
      <span className="cursor-tag">open</span>
    </div>
  );
}
