"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Ring = { mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>; age: number };

export default function ThreeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hero = canvas.closest<HTMLElement>(".archive-hero");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 8;

    const group = new THREE.Group();
    scene.add(group);

    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const COUNT = mobile ? 260 : 650;
    const base = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cobalt = new THREE.Color("#4357ff");
    const ink = new THREE.Color("#141414");
    const mist = new THREE.Color("#9a968c");

    for (let i = 0; i < COUNT; i += 1) {
      base[i * 3] = (Math.random() - 0.5) * 16;
      base[i * 3 + 1] = (Math.random() - 0.5) * 10;
      base[i * 3 + 2] = (Math.random() - 0.5) * 6;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.3 + Math.random() * 0.7;
      const roll = Math.random();
      const color = roll < 0.68 ? cobalt : roll < 0.88 ? ink : mist;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ depthWrite: false, opacity: 0.62, size: 0.045, sizeAttenuation: true, transparent: true, vertexColors: true });
    const points = new THREE.Points(geometry, material);
    group.add(points);

    const ringGeometry = new THREE.RingGeometry(0.48, 0.55, 48);
    const rings: Ring[] = [];
    let boost = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    const spawnRing = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const normalX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normalY = -((clientY - rect.top) / rect.height) * 2 + 1;
      const point = new THREE.Vector3(normalX, normalY, 0.5).unproject(camera);
      const direction = point.sub(camera.position).normalize();
      const distance = -camera.position.z / direction.z;
      const ringMaterial = new THREE.MeshBasicMaterial({ color: "#4357ff", opacity: 0.75, side: THREE.DoubleSide, transparent: true });
      const mesh = new THREE.Mesh(ringGeometry, ringMaterial);
      mesh.position.copy(camera.position).add(direction.multiplyScalar(distance));
      mesh.scale.setScalar(0.25);
      group.add(mesh);
      rings.push({ age: 0, mesh });
      boost = 1;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onPointerDown = (event: PointerEvent) => spawnRing(event.clientX, event.clientY);

    let frame = 0;
    let last = performance.now();
    const render = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = now / 1000;
      boost = Math.max(0, boost - delta * 1.1);
      const scrollT = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      camera.position.z = 8 - scrollT * 1.6;
      group.rotation.y += delta * (0.05 + boost * 0.35);
      group.rotation.x += ((pointerY * 0.12) - group.rotation.x) * 0.04;
      group.rotation.z += ((pointerX * 0.05) - group.rotation.z) * 0.04;

      const position = geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i += 1) {
        const speed = speeds[i] * (1 + boost * 3);
        position.setXYZ(
          i,
          base[i * 3] + Math.sin(time * speed * 0.6 + phases[i]) * 0.35,
          base[i * 3 + 1] + Math.sin(time * speed + phases[i]) * 0.45,
          base[i * 3 + 2],
        );
      }
      position.needsUpdate = true;

      for (let i = rings.length - 1; i >= 0; i -= 1) {
        const ring = rings[i];
        ring.age += delta;
        const life = ring.age / 0.9;
        ring.mesh.scale.setScalar(0.25 + ring.age * 4.2);
        ring.mesh.material.opacity = Math.max(0, 0.75 * (1 - life));
        if (life >= 1) {
          group.remove(ring.mesh);
          ring.mesh.material.dispose();
          rings.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    (hero ?? canvas).addEventListener("pointerdown", onPointerDown);

    let observer: IntersectionObserver | undefined;
    if (reducedMotion) {
      render(performance.now());
      stop();
    } else {
      observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      }, { threshold: 0.02 });
      observer.observe(canvas);
    }

    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      (hero ?? canvas).removeEventListener("pointerdown", onPointerDown);
      rings.forEach((ring) => {
        group.remove(ring.mesh);
        ring.mesh.material.dispose();
      });
      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          const pointMaterial = object.material as THREE.Material;
          pointMaterial.dispose();
        }
      });
      ringGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas aria-hidden="true" className="three-field" ref={canvasRef} />;
}
