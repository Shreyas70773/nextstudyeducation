"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { testimonials } from "@/lib/content";
import Kicker from "../ui/Kicker";

// Light register (cream paper) editorial testimonials. NOT a 3-card grid: one
// featured voice carries the section as its de-facto headline, with two quieter
// supporting quotes set in a divided two-column band beneath it. Avatars are
// monogram initials — no stock faces. The featured quote rises with a SplitText
// line-mask; the hanging quote mark and the attributions stagger in after it.
//
// NOTE: these testimonials are PLACEHOLDERS. Replace every quote, name, and
// transition with real, consented learner stories before launch.

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [featured, ...supporting] = testimonials;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const quote = el.querySelector<HTMLElement>(".tm-quote");
      const mark = el.querySelector<HTMLElement>(".tm-mark");
      const items = gsap.utils.toArray<HTMLElement>(".tm-item", el);

      if (prefersReducedMotion()) {
        gsap.set([quote, mark, ...items], { autoAlpha: 1, y: 0 });
        return;
      }

      // Pre-hide synchronously so nothing flashes before the reveal runs.
      gsap.set([mark, ...items], { autoAlpha: 0, y: 24 });
      if (quote) gsap.set(quote, { autoAlpha: 0 });

      let split: SplitText | null = null;
      let tl: gsap.core.Timeline | null = null;
      let cancelled = false;

      // Split after fonts load so visual line breaks are correct. Guard against
      // unmount / Strict-Mode re-invoke that resolves after cleanup ran.
      document.fonts.ready.then(() => {
        if (cancelled || !quote) return;
        split = new SplitText(quote, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(quote, { autoAlpha: 1 });
        gsap.set(split.lines, { yPercent: 110 });

        tl = gsap.timeline({
          defaults: { ease: "nx-out" },
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
        tl.to(mark, { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
          .to(split.lines, { yPercent: 0, duration: 1.05, stagger: 0.09 }, 0.12)
          .to(items, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, "-=0.55");

        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        tl?.scrollTrigger?.kill();
        tl?.kill();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="testimonials"
      ref={root}
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-paper py-24 text-ink md:py-36"
    >
      {/* faint warm atmosphere — barely-there on cream */}
      <div className="bloom -right-32 top-0 h-[420px] w-[420px] opacity-[0.06]" aria-hidden />

      <div className="shell relative">
        <h2 id="testimonials-heading">
          <Kicker>In their words</Kicker>
        </h2>

        {/* Featured voice — the section's de-facto headline */}
        <figure className="relative mt-12 md:mt-16">
          <span
            aria-hidden
            className="tm-mark pointer-events-none absolute -left-1 -top-12 select-none font-display text-[clamp(6rem,13vw,11rem)] leading-none text-accent/20 md:-left-7 md:-top-16"
          >
            &#8220;
          </span>

          <blockquote className="tm-quote reveal-up relative max-w-[22ch] font-display text-[clamp(1.85rem,4.3vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink">
            {featured.quote}
          </blockquote>

          <figcaption className="tm-item reveal-up mt-9 flex items-center gap-4">
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent/10 font-display text-base font-semibold text-accent-deep ring-1 ring-accent/25"
            >
              {initials(featured.name)}
            </span>
            <span className="flex flex-col">
              <span className="font-display font-medium text-ink">{featured.name}</span>
              <span className="text-sm text-ink/60">{featured.transition}</span>
            </span>
          </figcaption>
        </figure>

        {/* Two quieter supporting quotes — editorial divided band, not a card grid */}
        <div className="mt-16 grid border-y border-paper-line md:mt-24 md:grid-cols-2">
          {supporting.map((t, i) => (
            <figure
              key={t.seed}
              className={`tm-item reveal-up group flex flex-col py-10 md:py-14 ${
                i === 0
                  ? "md:pr-12 lg:pr-16"
                  : "border-t border-paper-line md:border-l md:border-t-0 md:pl-12 lg:pl-16"
              }`}
            >
              <blockquote className="max-w-[42ch] text-lg leading-relaxed text-ink/80">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3.5">
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/10 font-display text-sm font-semibold text-accent-deep ring-1 ring-accent/20 transition-colors duration-300 group-hover:bg-accent/15 group-hover:ring-accent/45"
                >
                  {initials(t.name)}
                </span>
                <span className="flex flex-col">
                  <span className="font-display font-medium text-ink">{t.name}</span>
                  <span className="text-sm text-ink/60">{t.transition}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
