"use client";

import { useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { gsap, useGSAP, ScrollTrigger, isReducedMotion } from "@/lib/animations";
import TouchField from "./TouchField";

const DENSITY = { desktop: 650, mobile: 260 };
const MIN_WIDTH = 820;
const DOLLY_ID = "three-field-dolly";
const PAPER = new Color(0xf3f0e8);
const ACID = new Color(0xd8ff4f);
const COBALT = new Color(0x4357ff);

/** null => below the 820px breakpoint, the CSS gradient fallback owns the surface. */
function density(): number | null {
  if (window.innerWidth < MIN_WIDTH) return null;
  return window.matchMedia("(pointer: coarse)").matches ? DENSITY.mobile : DENSITY.desktop;
}

function buildCloud(count: number): BufferGeometry {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const tint = new Color();

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.4 + Math.pow(Math.random(), 0.72) * 2.4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.6 - 0.9;

    tint.copy(PAPER).lerp(ACID, Math.pow(Math.random(), 2.2) * 0.85);
    if (Math.random() > 0.9) tint.lerp(COBALT, 0.6);
    colors[i * 3] = tint.r;
    colors[i * 3 + 1] = tint.g;
    colors[i * 3 + 2] = tint.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return geometry;
}

export default function ThreeField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let dispose: (() => void) | null = null;
    let tier = density();

    const mountField = () => {
      const count = density();
      if (count === null) return;
      const reduced = isReducedMotion();
      const aim = { x: 0, y: 0 };
      const dolly = { now: 0, target: 0 };
      const rings: Mesh[] = [];
      const pulses: { scale: number; opacity: number }[] = [];
      let frame = 0;
      let onScreen = false;

      let renderer: WebGLRenderer;
      try {
        renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }

      const scene = new Scene();
      const camera = new PerspectiveCamera(55, 1, 0.1, 60);
      camera.position.set(0, 0, 4.8);

      const geometry = buildCloud(count);
      const material = new PointsMaterial({
        size: 0.05,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: AdditiveBlending,
      });
      const cloud = new Points(geometry, material);
      scene.add(cloud);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const resize = () => {
        const box = mount.getBoundingClientRect();
        if (box.width < 1 || box.height < 1) return;
        camera.aspect = box.width / box.height;
        camera.updateProjectionMatrix();
        renderer.setSize(box.width, box.height, false);
      };
      resize();
      const boxWatcher = new ResizeObserver(resize);
      boxWatcher.observe(mount);

      const draw = (time: number) => {
        dolly.now += (dolly.target - dolly.now) * 0.09;
        camera.position.x += (aim.x * 0.65 - camera.position.x) * 0.07;
        camera.position.y += (aim.y * 0.45 - camera.position.y) * 0.07;
        camera.position.z = 4.8 - dolly.now * 2;
        camera.lookAt(0, 0, 0);
        cloud.rotation.y = time * 0.00005 + aim.x * 0.09;
        cloud.rotation.x = aim.y * -0.07;
        material.opacity = 0.92 - dolly.now * 0.5;
        renderer.render(scene, camera);
      };

      const tick = (time: number) => {
        frame = requestAnimationFrame(tick);
        draw(time);
      };
      const sync = () => {
        const live = !reduced && onScreen && !document.hidden;
        if (live === (frame !== 0)) return;
        if (live) {
          frame = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      };
      const onVisibility = () => sync();
      document.addEventListener("visibilitychange", onVisibility);

      const gate = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          sync();
        },
        { threshold: 0 },
      );
      gate.observe(mount);
      if (reduced) draw(0);

      const pulse = (nx: number, ny: number) => {
        const spot = new Vector3(nx, ny, 0.5).unproject(camera);
        const ring = new Mesh(
          new RingGeometry(0.5, 0.56, 64),
          new MeshBasicMaterial({
            color: ACID,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: AdditiveBlending,
          }),
        );
        ring.position.set(spot.x, spot.y, 0.5);
        scene.add(ring);
        const state = { scale: 0.1, opacity: 0.9 };
        rings.push(ring);
        pulses.push(state);
        gsap.to(state, {
          scale: 2.8,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          onUpdate: () => {
            ring.scale.setScalar(state.scale);
            (ring.material as MeshBasicMaterial).opacity = state.opacity;
          },
          onComplete: () => {
            ring.geometry.dispose();
            (ring.material as MeshBasicMaterial).dispose();
            scene.remove(ring);
            rings.splice(rings.indexOf(ring), 1);
            pulses.splice(pulses.indexOf(state), 1);
          },
        });
      };

      const onMove = (event: PointerEvent) => {
        aim.x = (event.clientX / window.innerWidth) * 2 - 1;
        aim.y = -((event.clientY / window.innerHeight) * 2 - 1);
      };
      const onDown = (event: PointerEvent) => {
        const box = mount.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right) return;
        if (event.clientY < box.top || event.clientY > box.bottom) return;
        pulse(
          ((event.clientX - box.left) / box.width) * 2 - 1,
          -((event.clientY - box.top) / box.height) * 2 + 1,
        );
      };
      if (!reduced) {
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
      }

      const dollyTrigger = ScrollTrigger.create({
        id: DOLLY_ID,
        trigger: mount,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          dolly.target = self.progress;
        },
        onRefresh: resize,
      });

      dispose = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        gate.disconnect();
        boxWatcher.disconnect();
        dollyTrigger.kill();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        for (const state of pulses) gsap.killTweensOf(state);
        for (const ring of rings) {
          ring.geometry.dispose();
          (ring.material as MeshBasicMaterial).dispose();
        }
        rings.length = 0;
        pulses.length = 0;
        geometry.dispose();
        material.dispose();
        scene.clear();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    mountField();

    const tierWatcher = new ResizeObserver(() => {
      const next = density();
      if (next === tier) return;
      tier = next;
      dispose?.();
      dispose = null;
      mount.replaceChildren();
      mountField();
    });
    tierWatcher.observe(mount);

    return () => {
      tierWatcher.disconnect();
      dispose?.();
    };
  });

  return (
    <div className="field" aria-hidden="true">
      <TouchField />
      <div className="field__gl" ref={mountRef} />
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
        .field__gl {
          position: absolute;
          inset: 0;
        }
        .field :global(canvas) {
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
