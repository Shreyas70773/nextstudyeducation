"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

// Smooth scroll for desktop (mouse) only. On touch devices — phones, iPads —
// Lenis is skipped so the browser's native momentum scrolling is used, which is
// dramatically smoother on iOS/WebKit than JS-driven scroll. ScrollTrigger works
// with native scroll automatically. In-page anchor links smooth-scroll either
// way (Lenis when present, native scrollTo otherwise).
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const useLenis =
      !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let lenis: Lenis | undefined;
    let raf: ((time: number) => void) | undefined;

    if (useLenis) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // Delegate in-page anchor clicks to a smooth scroll, offset for the nav.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.25 });
      } else {
        const top =
          (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      }
    };
    document.addEventListener("click", onClick);

    // Defer a refresh so layout (fonts, sticky/pinned sections) settles first.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener("click", onClick);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
