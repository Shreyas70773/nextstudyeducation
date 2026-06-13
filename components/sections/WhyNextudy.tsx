"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { why } from "@/lib/content";
import Kicker from "../ui/Kicker";
import Reveal from "../ui/Reveal";
import TextReveal from "../ui/TextReveal";
import WireframeBuilding from "../visuals/WireframeBuilding";

// Asymmetric bento. A 3-col, grid-flow-dense layout where the lead pillar owns a
// 2x2 block (with a faint wireframe behind it), two quiet tiles stack to its right,
// and the last pillar runs full-width as a banner. Spans sum to 9 = 3x3 — no holes.
//   [0 0 1]
//   [0 0 2]
//   [3 3 3]

// Quiet two-digit index marker, shared by every tile.
function Index({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-sm font-semibold tracking-[0.25em] text-accent">
        {n}
      </span>
      <span className="h-px w-10 bg-accent/40" />
    </div>
  );
}

// Hover lift uses the standalone `translate` CSS property — GSAP's entrance
// writes to `transform`, so the two never collide and the entrance stays crisp.
const tileBase =
  "why-tile reveal-up group relative overflow-hidden rounded-3xl border border-line bg-ink-800 p-8 transition-[translate,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:[translate:0_-3px] hover:border-accent/50 md:p-10";

export default function WhyNextudy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const tiles = gsap.utils.toArray<HTMLElement>(".why-tile", el);

      if (prefersReducedMotion()) {
        gsap.set(tiles, { autoAlpha: 1, y: 0, clearProps: "transform" });
        return;
      }

      // Pre-shift; .reveal-up already pins opacity:0 so there is no flash.
      gsap.set(tiles, { y: 32 });
      const tween = gsap.to(tiles, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "nx-out",
        // Hand transform back to CSS so the hover lift works after entrance.
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="why"
      ref={root}
      className="relative overflow-hidden bg-ink py-24 md:py-36"
    >
      <div className="bloom -left-32 top-24 h-[420px] w-[520px] opacity-[0.28]" />

      <div className="shell-wide relative">
        <header className="max-w-2xl">
          <Reveal>
            <Kicker>{why.eyebrow}</Kicker>
          </Reveal>
          <TextReveal
            as="h2"
            trigger
            lines={why.headline}
            className="display mt-6 text-[clamp(2.1rem,4.4vw,3.7rem)] text-bone"
          />
        </header>

        <ul className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 md:mt-20 md:auto-rows-[minmax(12rem,auto)] md:grid-cols-3 md:gap-5">
          {why.pillars.map((p, i) => {
            const idx = String(i + 1).padStart(2, "0");

            // Lead pillar — the dominant 2x2 tile with a faint wireframe behind.
            if (i === 0) {
              return (
                <li
                  key={p.title}
                  className={`${tileBase} flex flex-col justify-between md:col-span-2 md:row-span-2`}
                >
                  <WireframeBuilding className="pointer-events-none absolute -bottom-12 -right-10 z-0 h-[320px] w-auto opacity-[0.26] [mask-image:radial-gradient(ellipse_72%_82%_at_72%_76%,black,transparent_80%)] md:h-[440px]" />
                  <div className="relative z-10">
                    <Index n={idx} />
                  </div>
                  <div className="relative z-10 mt-20">
                    <h3 className="font-display text-2xl font-semibold leading-[1.05] tracking-tight text-bone md:text-[1.9rem]">
                      {p.title}
                    </h3>
                    <p className="mt-4 max-w-[34ch] leading-relaxed text-mute">
                      {p.copy}
                    </p>
                  </div>
                </li>
              );
            }

            // Closing pillar — full-width banner, copy set wide beside the title.
            if (i === 3) {
              return (
                <li
                  key={p.title}
                  className={`${tileBase} flex flex-col gap-6 md:col-span-3 md:flex-row md:items-center md:gap-12`}
                >
                  <div className="md:w-[42%]">
                    <Index n={idx} />
                    <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-bone md:text-2xl">
                      {p.title}
                    </h3>
                  </div>
                  <p className="leading-relaxed text-mute md:w-[58%] md:text-lg">
                    {p.copy}
                  </p>
                </li>
              );
            }

            // Quiet stacked tiles to the right of the lead.
            return (
              <li key={p.title} className={`${tileBase} flex flex-col`}>
                <Index n={idx} />
                <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-bone md:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-[34ch] leading-relaxed text-mute">
                  {p.copy}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
