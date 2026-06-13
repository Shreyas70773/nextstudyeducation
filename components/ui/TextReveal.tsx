"use client";

import { useRef, type ElementType } from "react";
import {
  gsap,
  useGSAP,
  SplitText,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/gsap";

// Kinetic headline. Renders explicit lines (preserved with <br>) then uses
// SplitText line-masks so each line rises from behind a clip on scroll.
// Splits after fonts load so line breaks are correct.
export default function TextReveal({
  lines,
  as: Tag = "h2",
  className = "",
  stagger = 0.085,
  start = "top 84%",
  trigger,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  stagger?: number;
  start?: string;
  trigger?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      const run = () => {
        split = new SplitText(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        gsap.set(el, { autoAlpha: 1 });
        gsap.set(split.lines, { yPercent: 110 });
        tween = gsap.to(split.lines, {
          yPercent: 0,
          duration: 1.1,
          stagger,
          ease: "nx-out",
          scrollTrigger: trigger
            ? { trigger: el, start, once: true }
            : undefined,
        });
      };

      document.fonts.ready.then(() => {
        run();
        ScrollTrigger.refresh();
      });

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Tag ref={ref} className={`reveal-up ${className}`}>
      {lines.flatMap((line, i): React.ReactNode[] =>
        i === 0 ? [line] : [<br key={i} />, line],
      )}
    </Tag>
  );
}
