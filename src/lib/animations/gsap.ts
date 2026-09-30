import { gsap as gsapCore } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsapCore.registerPlugin(ScrollTrigger);

export { gsapCore as gsap, useGSAP, ScrollTrigger };

export function setupScrollTrigger(): void {
  gsapCore.registerPlugin(ScrollTrigger);
}
