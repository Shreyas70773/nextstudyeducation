"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { gap } from "@/lib/content";
import Kicker from "../ui/Kicker";
import TextReveal from "../ui/TextReveal";
import { ArrowRight, PlayMark } from "../ui/icons";

// The Gap — editorial "ledger" of the four things a degree leaves unfinished,
// each answered by the Nextudy workflow. Problem is stated quietly (muted body),
// the answer lands large and confident (display) so the page literally reads
// pain -> relief. Asymmetric 2-col on desktop, stacked on mobile, separated by
// hairline rules (never a 3-card grid).

// Phrase to lift in accent inside each solution. Pure styling over the copy in
// content.ts — if a phrase ever stops matching, the line renders plainly.
const EMPHASIS = [
  "real workflows",
  "from week one",
  "show in an interview",
  "A mentor translates",
];

function highlight(text: string, phrase: string): React.ReactNode {
  const i = text.indexOf(phrase);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-accent">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

export default function TheGap() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const rows = gsap.utils.toArray<HTMLElement>(".gap-row", el);
      if (!rows.length) return;

      if (prefersReducedMotion()) {
        gsap.set(rows, { autoAlpha: 1, y: 0 });
        return;
      }

      // Rows carry `.reveal-up`, so they are hidden via CSS from the very first
      // paint (the `js` class is on <html>) — no FOUC. gsap.set re-asserts the
      // start values, then a scroll-triggered gsap.to reveals them, ending at
      // autoAlpha:1 (the visible final state, overriding the CSS hide).
      gsap.set(rows, { autoAlpha: 0, y: 32 });

      const tween = gsap.to(rows, {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "nx-out",
        scrollTrigger: {
          trigger: el.querySelector(".gap-list"),
          start: "top 78%",
          once: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: root },
  );

  return (
    <section id="gap" ref={root} className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div
        className="bloom left-[-12%] top-[14%] h-[420px] w-[560px] opacity-25"
        aria-hidden="true"
      />

      <div className="shell relative">
        <header className="max-w-5xl">
          <Kicker>{gap.eyebrow}</Kicker>
          <TextReveal
            lines={gap.headline}
            trigger
            as="h2"
            className="display mt-6 text-[clamp(1.9rem,4vw,3.25rem)] text-bone"
          />
        </header>

        <ul className="gap-list mt-14 md:mt-20">
          {gap.problems.map((item, i) => (
            <li key={item.problem} className="gap-row reveal-up">
              <div className="hairline" aria-hidden="true" />

              <div className="group grid items-start gap-x-8 gap-y-5 py-9 md:grid-cols-[minmax(0,0.95fr)_auto_minmax(0,1.3fr)] md:gap-x-12 md:gap-y-0 md:py-11">
                {/* the problem — quiet, muted, the way it actually feels */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-sm font-semibold tabular-nums text-faint transition-colors duration-300 group-hover:text-accent">
                      {`0${i + 1}`}
                    </span>
                    <span className="eyebrow text-faint">The problem</span>
                  </div>
                  <p className="mt-3 max-w-[32ch] text-lg leading-relaxed text-mute">
                    {item.problem}
                  </p>
                </div>

                {/* the turn */}
                <div className="flex justify-start self-start text-accent md:justify-center md:self-center md:pt-1">
                  <ArrowRight
                    size={24}
                    className="rotate-90 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:rotate-0 md:group-hover:translate-x-1.5"
                  />
                </div>

                {/* the answer — large, confident, relief */}
                <div>
                  <span className="eyebrow inline-flex items-center gap-2 text-accent">
                    <PlayMark size={10} />
                    The fix
                  </span>
                  <p className="mt-3 max-w-[40ch] font-display text-xl font-medium leading-[1.25] tracking-[-0.01em] text-bone md:text-[1.5rem]">
                    {highlight(item.solution, EMPHASIS[i])}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="hairline" aria-hidden="true" />
      </div>
    </section>
  );
}
