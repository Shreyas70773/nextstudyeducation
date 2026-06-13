"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { outcomes } from "@/lib/content";
import Kicker from "../ui/Kicker";
import TextReveal from "../ui/TextReveal";
import Reveal from "../ui/Reveal";
import { Check, PlayMark } from "../ui/icons";

// Light register — the warm "breath" chapter on brand cream. A calm editorial
// list of what you actually leave with, each line checked off in accent and
// separated by hairline rules, closing on an honest, reassuring note.

// Faint engineering-paper grid, kept clear through the reading column.
const GRID_MASK =
  "radial-gradient(ellipse 76% 64% at 50% 38%, transparent 0%, transparent 36%, black 100%)";

// Quiet two-tone emphasis on the note: the disclaimers recede, the substance lands.
const NOTE = outcomes.note;
const NOTE_SPLIT = NOTE.indexOf("Just");
const NOTE_LEAD = NOTE_SPLIT > 0 ? NOTE.slice(0, NOTE_SPLIT) : "";
const NOTE_REST = NOTE_SPLIT > 0 ? NOTE.slice(NOTE_SPLIT) : NOTE;

export default function Outcomes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const list = el.querySelector(".ot-list");
      const items = gsap.utils.toArray<HTMLElement>(".ot-item", el);
      const checks = gsap.utils.toArray<SVGPathElement>(".ot-check path", el);
      if (!list || !items.length) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        gsap.set(checks, { drawSVG: "100%" });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 26 });
      gsap.set(checks, { drawSVG: "0%" });

      const tl = gsap.timeline({
        defaults: { ease: "nx-out" },
        scrollTrigger: { trigger: list, start: "top 80%", once: true },
      });

      tl.to(items, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.09 }, 0).to(
        checks,
        { drawSVG: "100%", duration: 0.5, stagger: 0.09 },
        0.12,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="outcomes"
      ref={root}
      className="relative overflow-hidden bg-paper py-28 text-ink md:py-40"
    >
      {/* warm engineering-paper atmosphere — intentional on the cream canvas */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="blueprint-grid absolute inset-0 opacity-60"
          style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
        />
        <div className="bloom -right-24 -top-24 h-[420px] w-[420px] opacity-20" />
      </div>

      <div className="shell relative">
        {/* header */}
        <header className="max-w-[44rem]">
          <Kicker>{outcomes.eyebrow}</Kicker>
          <TextReveal
            lines={outcomes.headline}
            trigger
            className="display mt-6 max-w-[16ch] text-[clamp(2.4rem,5.4vw,4.4rem)] text-ink"
          />
        </header>

        {/* editorial outcomes list — two calm columns, ruled by hairlines */}
        <ul className="ot-list mt-16 grid grid-cols-1 border-b border-ink/10 md:mt-20 md:grid-cols-2">
          {outcomes.items.map((item, i) => (
            <li
              key={item}
              className={`ot-item group flex items-start gap-4 border-t border-ink/10 py-7 md:gap-5 md:py-9 ${
                i % 2 === 1 ? "md:border-l md:border-ink/10 md:pl-12" : "md:pr-12"
              }`}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-accent transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent/50 group-hover:bg-accent/5">
                <Check className="ot-check" size={18} />
              </span>
              <span className="font-display text-[clamp(1.15rem,1.9vw,1.55rem)] font-medium leading-snug tracking-tight text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* honest, reassuring close — a quiet callout */}
        <Reveal className="mt-16 md:mt-24">
          <aside
            aria-label="An honest note on what these programs do and don't promise"
            className="relative max-w-[66ch] overflow-hidden rounded-2xl border border-ink/10 bg-paper-deep/60 px-8 py-10 md:px-12 md:py-14"
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
            <div className="flex items-start gap-5">
              <PlayMark size={13} className="mt-2.5 shrink-0 text-accent" />
              <p className="text-balance font-display text-[clamp(1.25rem,2.6vw,1.95rem)] font-medium leading-[1.32] tracking-tight">
                {NOTE_LEAD && <span className="text-ink/55">{NOTE_LEAD}</span>}
                <span className="text-ink">{NOTE_REST}</span>
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
