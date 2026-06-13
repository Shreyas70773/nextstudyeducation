"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { disciplines } from "@/lib/content";
import Marquee from "../ui/Marquee";
import Kicker from "../ui/Kicker";

// Slim credibility band beneath the hero. Two counter-running marquees of the
// real BIM toolset/skills, bracketed by hairline rules and dissolved at each
// edge with a mask. Understated by design: it states the modern stack without
// a single claim, logo, or stat.

// Items fade into the ink at the left/right margins so the loop has no hard seam.
const EDGE_FADE =
  "linear-gradient(to right, transparent 0%, #000 11%, #000 89%, transparent 100%)";

// Offset the second track so the two counter-running rows never show the same
// term stacked vertically — avoids a mirror-image "twin rows" look.
const disciplinesAlt = [...disciplines.slice(6), ...disciplines.slice(0, 6)];

export default function DisciplineMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const lines = gsap.utils.toArray<HTMLElement>(".dm-line", el);
      const rows = gsap.utils.toArray<HTMLElement>(".dm-row", el);
      const kicker = el.querySelector(".dm-kicker");

      // Reduced motion: paint the final, visible state and bail (the inner
      // Marquee primitive likewise sits still under reduced motion).
      if (prefersReducedMotion()) {
        gsap.set(lines, { scaleX: 1, autoAlpha: 1 });
        gsap.set([kicker, ...rows], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(lines, { scaleX: 0, autoAlpha: 1, transformOrigin: "50% 50%" });
      gsap.set(kicker, { autoAlpha: 0, y: 14 });
      gsap.set(rows, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({
        defaults: { ease: "nx-out" },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      tl.to(lines, { scaleX: 1, duration: 1.1, stagger: 0.14 }, 0)
        .to(kicker, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.15)
        .to(rows, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.25);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="disciplines"
      ref={root}
      aria-label="The modern BIM stack"
      className="relative overflow-hidden bg-ink py-12 md:py-16"
    >
      <div className="shell-wide">
        <div className="dm-line hairline reveal-up" />

        <div className="flex justify-center pt-7 md:pt-9">
          <span className="dm-kicker reveal-up">
            <Kicker>The modern BIM stack</Kicker>
          </span>
        </div>

        {/* Real, recoverable content for assistive tech (the marquee tracks
            below are decorative duplicates and aria-hidden inside Marquee). */}
        <p className="sr-only">
          Skills and tools you train on at Nextudy: {disciplines.join(", ")}.
        </p>

        <div className="mt-7 flex flex-col gap-4 md:mt-9 md:gap-5">
          <div
            className="dm-row reveal-up"
            style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
          >
            <Marquee items={disciplines} speed={30} />
          </div>
          <div
            className="dm-row reveal-up"
            style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
          >
            <Marquee items={disciplinesAlt} speed={24} reverse />
          </div>
        </div>

        <div className="dm-line hairline reveal-up mt-7 md:mt-9" />
      </div>
    </section>
  );
}
