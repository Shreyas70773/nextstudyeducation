// Central GSAP setup. Registers the free 3.13+ plugin suite once on the client
// and exposes a shared, pre-configured instance so easing/curves stay consistent
// across every animated component.
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined" && !(gsap as unknown as { _nxReady?: boolean })._nxReady) {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase);

  // Signature easing curves (match the CSS custom-property curves in globals.css)
  CustomEase.create("nx-out", "0.16, 1, 0.3, 1");
  CustomEase.create("nx-inout", "0.77, 0, 0.175, 1");

  gsap.defaults({ ease: "nx-out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  (gsap as unknown as { _nxReady?: boolean })._nxReady = true;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase };
