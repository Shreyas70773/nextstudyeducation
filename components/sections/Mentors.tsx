"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  SplitText,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/gsap";
import { mentors } from "@/lib/content";
import Kicker from "../ui/Kicker";
import BlueprintBackdrop from "../visuals/BlueprintBackdrop";

// Initials for the monogram avatar (e.g. "Arvind Menon" -> "AM"). Deliberately
// vector/typographic: no stock face photos, no picsum portraits.
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Mentors() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const heading = el.querySelector<HTMLHeadingElement>(".mn-heading");
      const cards = gsap.utils.toArray<HTMLElement>(".mn-card", el);

      if (prefersReducedMotion()) {
        if (heading) gsap.set(heading, { autoAlpha: 1 });
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      // Cards: keep hidden until their staggered entrance, then hand transform
      // back to CSS so the hover lift works.
      gsap.set(cards, { autoAlpha: 0, y: 38 });
      const cardsTween = gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "nx-out",
        scrollTrigger: { trigger: ".mn-grid", start: "top 82%", once: true },
        onComplete: () => gsap.set(cards, { clearProps: "transform" }),
      });

      // Heading: line-mask rise, split after fonts load so wraps are correct.
      let split: SplitText | null = null;
      let headTween: gsap.core.Tween | null = null;

      if (heading) {
        document.fonts.ready.then(() => {
          split = new SplitText(heading, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
          });
          gsap.set(heading, { autoAlpha: 1 });
          gsap.set(split.lines, { yPercent: 110 });
          headTween = gsap.to(split.lines, {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: "nx-out",
            scrollTrigger: { trigger: heading, start: "top 85%", once: true },
          });
          ScrollTrigger.refresh();
        });
      }

      return () => {
        cardsTween.scrollTrigger?.kill();
        cardsTween.kill();
        headTween?.scrollTrigger?.kill();
        headTween?.kill();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="mentors"
      ref={root}
      className="relative overflow-hidden bg-ink py-24 md:py-36"
    >
      {/* atmosphere */}
      <BlueprintBackdrop fade="bottom" className="opacity-30" />
      <div
        className="bloom -top-24 left-[8%] h-[440px] w-[640px] opacity-25"
        aria-hidden="true"
      />

      <div className="shell-wide relative z-10">
        {/* editorial header */}
        <header className="max-w-[36rem]">
          <Kicker>Your mentors</Kicker>
          <h2 className="mn-heading reveal-up display mt-6 text-[clamp(2.1rem,4.6vw,3.7rem)] text-bone">
            Learn from the people
            <br />
            who <span className="text-accent">do the work.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-mute">
            The people teaching you coordinate real BIM projects. The workflow you
            practice is the one they run every day.
          </p>
        </header>

        {/*
          PLACEHOLDER: mentor data (name / role / experience / focus) and the
          monogram avatars below stand in for real people. Replace with the
          client's actual mentors — and, if desired, consented headshots — before
          launch. The monograms intentionally avoid stock or auto-generated faces.
        */}
        <ul
          role="list"
          className="mn-grid mt-14 grid list-none items-start gap-5 sm:gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4"
        >
          {mentors.map((m, i) => (
            <li
              key={m.seed}
              className={i % 2 === 1 ? "lg:mt-16" : ""}
            >
              <article
                className="mn-card reveal-up group relative flex h-full flex-col rounded-3xl border border-line bg-ink-800 p-7 transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-accent/50 hover:bg-ink-700/70"
              >
                {/* monogram avatar — derived from the name, never a photo */}
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-700 font-display text-lg font-semibold tracking-tight text-bone ring-1 ring-inset ring-accent/25 transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:text-accent-bright group-hover:ring-accent/60"
                  aria-hidden="true"
                >
                  {initials(m.name)}
                </div>

                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-bone">
                  {m.name}
                </h3>
                <p className="mt-1.5 font-display text-[0.95rem] text-accent">
                  {m.role}
                </p>
                <p className="mt-1 text-sm text-mute">{m.experience}</p>

                <ul role="list" className="mt-5 flex flex-wrap gap-2">
                  {m.focus.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-line bg-ink-700/60 px-2.5 py-1 text-[0.72rem] tracking-wide text-mute transition-colors duration-300 group-hover:border-line/80"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
