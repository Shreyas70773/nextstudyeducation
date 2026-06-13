"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Scroll-triggered entrance for any block. Starts hidden (via .reveal-up so SSR
// paints the final state when JS/motion is off), then rises + fades in once.
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  y = 28,
  delay = 0,
  duration = 1,
  start = "top 86%",
}: {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.set(el, { y });
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration,
        delay,
        ease: "nx-out",
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`reveal-up ${className}`}>
      {children}
    </Tag>
  );
}
