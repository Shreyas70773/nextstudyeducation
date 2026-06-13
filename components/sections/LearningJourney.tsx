"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { journey } from "@/lib/content";
import Kicker from "../ui/Kicker";

// A scrubbed roadmap. As the section scrolls, an accent-gradient path draws
// itself with DrawSVGPlugin; each of the six steps and its node light up in
// sequence as the line reaches them. Desktop is a vertical serpentine with
// steps alternating left/right of the spine; mobile collapses to a left rail
// with steps stacked to its right. Reduced motion: everything drawn + visible.

const VBW = 1000;
const VBH = 1500;
const TOP = 150; // y of the first node
const GAP = 240; // vertical distance between nodes
const LX = 380; // x of left-side nodes
const RX = 620; // x of right-side nodes

const nodeX = (i: number) => (i % 2 === 0 ? LX : RX);
const nodeY = (i: number) => TOP + i * GAP;

// Smooth vertical S-curve threading every node in order.
const buildPath = () => {
  let d = `M ${nodeX(0)} ${nodeY(0)}`;
  for (let i = 1; i < journey.length; i++) {
    const x0 = nodeX(i - 1);
    const x1 = nodeX(i);
    const y0 = nodeY(i - 1);
    const y1 = nodeY(i);
    d += ` C ${x0} ${y0 + GAP / 2}, ${x1} ${y1 - GAP / 2}, ${x1} ${y1}`;
  }
  return d;
};

const DESKTOP_PATH = buildPath();

export default function LearningJourney() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const heading = el.querySelector(".jr-heading") as Element;
      const allLines = gsap.utils.toArray<SVGElement>(".jr-d-line, .jr-m-line", el);
      const allNodes = gsap.utils.toArray<Element>(".jr-d-node, .jr-m-node", el);
      const allCards = gsap.utils.toArray<Element>(".jr-d-card, .jr-m-card", el);

      if (prefersReducedMotion()) {
        gsap.set(heading, { autoAlpha: 1, y: 0 });
        gsap.set(allLines, { drawSVG: "100%", autoAlpha: 1 });
        gsap.set(allNodes, { scale: 1, autoAlpha: 1, transformOrigin: "center" });
        gsap.set(allCards, { autoAlpha: 1, y: 0 });
        return;
      }

      // Heading rises once on scroll (independent of breakpoint).
      gsap.set(heading, { y: 26 });
      gsap.to(heading, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "nx-out",
        scrollTrigger: { trigger: heading, start: "top 85%", once: true },
      });

      const N = journey.length;
      const span = N / (N - 1); // timeline gap per node so node N-1 lands at the end

      const mm = gsap.matchMedia();

      // Desktop serpentine -------------------------------------------------
      mm.add("(min-width: 768px)", () => {
        const stage = el.querySelector(".jr-d-stage") as Element;
        const line = el.querySelector(".jr-d-line") as Element;
        const nodes = gsap.utils.toArray<Element>(".jr-d-node", el);
        const cards = gsap.utils.toArray<Element>(".jr-d-card", el);

        gsap.set(line, { autoAlpha: 1, drawSVG: "0%" });
        gsap.set(nodes, { scale: 0, autoAlpha: 0, transformOrigin: "center" });
        gsap.set(cards, { autoAlpha: 0, y: 30 });

        const tl = gsap.timeline({
          defaults: { ease: "nx-out" },
          scrollTrigger: {
            trigger: stage,
            start: "top 72%",
            end: "bottom 82%",
            scrub: 0.8,
          },
        });

        tl.to(line, { drawSVG: "100%", ease: "none", duration: N }, 0);
        nodes.forEach((n, i) => {
          // two concentric circles per step share the class; light them as the
          // line tip arrives at this node (its fractional position along the path).
          tl.to(n, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" }, span * i);
        });
        cards.forEach((c, i) => {
          tl.to(c, { autoAlpha: 1, y: 0, duration: 0.7 }, span * i + 0.12);
        });
      });

      // Mobile rail --------------------------------------------------------
      mm.add("(max-width: 767.98px)", () => {
        const list = el.querySelector(".jr-m-list") as Element;
        const line = el.querySelector(".jr-m-line") as Element;
        const nodes = gsap.utils.toArray<Element>(".jr-m-node", el);
        const cards = gsap.utils.toArray<Element>(".jr-m-card", el);

        gsap.set(line, { autoAlpha: 1, drawSVG: "0%" });
        gsap.set(nodes, { scale: 0, autoAlpha: 0, transformOrigin: "center" });
        gsap.set(cards, { autoAlpha: 0, y: 22 });

        const tl = gsap.timeline({
          defaults: { ease: "nx-out" },
          scrollTrigger: {
            trigger: list,
            start: "top 82%",
            end: "bottom 78%",
            scrub: 0.8,
          },
        });

        tl.to(line, { drawSVG: "100%", ease: "none", duration: N }, 0);
        nodes.forEach((n, i) => {
          tl.to(n, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(1.7)" }, span * i);
        });
        cards.forEach((c, i) => {
          tl.to(c, { autoAlpha: 1, y: 0, duration: 0.6 }, span * i + 0.08);
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="journey"
      ref={root}
      aria-labelledby="journey-heading"
      className="relative overflow-hidden bg-ink py-24 md:py-36"
    >
      <div className="bloom left-1/2 top-[8%] h-[440px] w-[680px] -translate-x-1/2 opacity-30" />

      <div className="shell relative">
        {/* header */}
        <header className="max-w-[40rem]">
          <Kicker>The path</Kicker>
          <h2
            id="journey-heading"
            className="jr-heading reveal-up display mt-6 text-[clamp(2.1rem,4.4vw,3.7rem)] text-bone"
          >
            How you{" "}
            <span className="text-accent">get there.</span>
          </h2>
        </header>

        {/* ---------------- desktop serpentine ---------------- */}
        <div className="jr-d-stage relative mx-auto mt-24 hidden w-full max-w-[1040px] md:block">
          <svg
            viewBox={`0 0 ${VBW} ${VBH}`}
            className="block h-auto w-full"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="jr-grad-d"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={VBH}
              >
                <stop offset="0%" stopColor="oklch(0.66 0.15 55)" />
                <stop offset="100%" stopColor="oklch(0.83 0.15 74)" />
              </linearGradient>
            </defs>

            {/* faint planned route underneath the drawn line */}
            <path
              d={DESKTOP_PATH}
              stroke="oklch(0.66 0.150 55)"
              strokeWidth={1.4}
              strokeDasharray="1 9"
              strokeLinecap="round"
              opacity={0.22}
            />
            {/* the line that draws itself */}
            <path
              className="jr-d-line reveal-up"
              d={DESKTOP_PATH}
              stroke="url(#jr-grad-d)"
              strokeWidth={2}
              strokeLinecap="round"
            />

            {/* nodes: one group per step so both rings light up together as
                the line tip arrives (timeline indexes by step, not by circle) */}
            {journey.map((s, i) => (
              <g key={s.index} className="jr-d-node reveal-up">
                <circle
                  cx={nodeX(i)}
                  cy={nodeY(i)}
                  r={12}
                  fill="none"
                  stroke="oklch(0.762 0.158 64)"
                  strokeWidth={1.3}
                />
                <circle
                  cx={nodeX(i)}
                  cy={nodeY(i)}
                  r={5.5}
                  fill="oklch(0.83 0.15 74)"
                />
              </g>
            ))}
          </svg>

          {/* steps positioned along the path, alternating sides */}
          <ol className="absolute inset-0">
            {journey.map((s, i) => {
              const left = i % 2 === 0;
              const topPct = (nodeY(i) / VBH) * 100;
              return (
                <li
                  key={s.index}
                  className={`absolute -translate-y-1/2 ${left ? "text-right" : "text-left"}`}
                  style={{
                    top: `${topPct}%`,
                    left: left ? "0%" : "64%",
                    right: left ? "64%" : "0%",
                  }}
                >
                  {/* gsap animates y on this inner block, so the li keeps the
                      -translate-y-1/2 centering transform untouched */}
                  <div className="jr-d-card reveal-up">
                    <div
                      className={`flex items-center gap-3 ${left ? "justify-end" : "justify-start"}`}
                    >
                      {left && <span className="h-px w-10 bg-accent/40" />}
                      <span className="font-display text-sm font-semibold tracking-[0.3em] text-accent">
                        {s.index}
                      </span>
                      {!left && <span className="h-px w-10 bg-accent/40" />}
                    </div>
                    <h3 className="mt-3.5 font-display text-[clamp(1.15rem,1.5vw,1.4rem)] font-medium tracking-tight text-bone">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-mute">{s.copy}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ---------------- mobile rail ---------------- */}
        <ol className="jr-m-list relative mt-14 max-w-[34rem] md:hidden">
          {/* drawn rail, faded at both ends so it reads as a continuous route */}
          <div
            className="pointer-events-none absolute bottom-2 left-[1.125rem] top-2 w-[3px] -translate-x-1/2"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 6%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 6%, black 90%, transparent)",
            }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 3 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="jr-grad-m"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100"
                >
                  <stop offset="0%" stopColor="oklch(0.66 0.15 55)" />
                  <stop offset="100%" stopColor="oklch(0.83 0.15 74)" />
                </linearGradient>
              </defs>
              <line
                x1="1.5"
                y1="0"
                x2="1.5"
                y2="100"
                stroke="oklch(0.66 0.150 55)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                opacity={0.22}
              />
              <line
                className="jr-m-line reveal-up"
                x1="1.5"
                y1="0"
                x2="1.5"
                y2="100"
                stroke="url(#jr-grad-m)"
                strokeWidth={3}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {journey.map((s) => (
            <li key={s.index} className="relative pb-11 pl-[3.25rem] last:pb-0">
              {/* node sitting on the rail */}
              <span
                className="jr-m-node reveal-up absolute left-[1.125rem] top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-ink ring-1 ring-accent/60"
                aria-hidden="true"
              >
                <span className="h-2 w-2 rounded-full bg-accent-bright" />
              </span>

              <div className="jr-m-card reveal-up">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs font-semibold tracking-[0.3em] text-accent">
                    {s.index}
                  </span>
                  <span className="h-px w-8 bg-accent/30" />
                </div>
                <h3 className="mt-2.5 font-display text-lg font-medium tracking-tight text-bone">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-mute">{s.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
