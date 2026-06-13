"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { shift } from "@/lib/content";
import Kicker from "../ui/Kicker";
import TextReveal from "../ui/TextReveal";
import WireframeBuilding from "../visuals/WireframeBuilding";
import DisconnectedSheets from "../visuals/DisconnectedSheets";
import FederatedModel from "../visuals/FederatedModel";
import { Check } from "../ui/icons";

// "Why now" reworked as a sticky stack: three full-height panels (Then / Now /
// Next) physically slide up and stack over one another as you scroll, each
// shrinking + dimming as the next covers it. The movement is large and obvious
// on desktop and mobile, unlike a subtle scrub, and the mechanic differs from
// the horizontal Programs gallery so the page stays varied.

// Three distinct, elegant vector scenes that carry the narrative:
// fragmented 2D drawings -> one coordinated model -> a federated, clash-free
// delivery. Each animates in cleanly and stays (no draw-then-vanish).
const VISUALS = [
  <DisconnectedSheets key="then" className="h-full w-full" play />,
  <WireframeBuilding key="now" className="h-full w-full" play />,
  <FederatedModel key="next" className="h-full w-full" play />,
];

const PANEL_BG = ["bg-ink", "bg-ink-800", "bg-ink"];

export default function TheShift() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const panels = gsap.utils.toArray<HTMLElement>(".sh-panel", el);

      if (prefersReducedMotion()) {
        gsap.set(".sh-anim", { autoAlpha: 1, y: 0 });
        return;
      }

      const triggers: ScrollTrigger[] = [];

      panels.forEach((panel, i) => {
        // Entrance of each panel's content as it rises into view.
        const inner = panel.querySelectorAll<HTMLElement>(".sh-anim");
        gsap.set(inner, { autoAlpha: 0, y: 34 });
        const entrance = gsap.to(inner, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "nx-out",
          scrollTrigger: { trigger: panel, start: "top 65%", once: true },
        });
        if (entrance.scrollTrigger) triggers.push(entrance.scrollTrigger);

        // Depth: shrink + dim a panel as the next one slides over it.
        if (i < panels.length - 1) {
          const cover = gsap.to(panel, {
            scale: 0.93,
            autoAlpha: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
          if (cover.scrollTrigger) triggers.push(cover.scrollTrigger);
        }
      });

      ScrollTrigger.refresh();

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root },
  );

  return (
    <section id="shift" ref={root} className="relative bg-ink">
      {/* intro */}
      <div className="shell relative z-10 pt-24 pb-12 md:pt-36 md:pb-16">
        <div className="bloom left-[6%] top-[20%] h-[360px] w-[480px] opacity-30" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <Kicker>{shift.eyebrow}</Kicker>
          <TextReveal
            lines={shift.headline}
            trigger
            as="h2"
            className="display mt-6 text-[clamp(2.1rem,5vw,4rem)] text-bone"
          />
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-mute">{shift.body}</p>
          <div className="mt-10 flex items-center gap-3 text-faint">
            <span className="text-sm uppercase tracking-[0.25em]">Scroll through the shift</span>
            <span className="h-px w-10 bg-line" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* sticky stack */}
      <div className="relative">
        {shift.stages.map((stage, i) => (
          <article
            key={stage.tag}
            className={`sh-panel sticky top-0 flex min-h-[100dvh] items-center overflow-hidden ${PANEL_BG[i]} ${
              i > 0 ? "rounded-t-[2.25rem] border-t border-line/60 shadow-[0_-30px_60px_-30px_rgba(0,0,0,0.85)]" : ""
            }`}
            style={{ transformOrigin: "center center", zIndex: i + 1 }}
          >
            <div className="blueprint-grid absolute inset-0 opacity-[0.35]" aria-hidden="true" />
            <div
              className="bloom right-[10%] top-1/2 h-[460px] w-[460px] -translate-y-1/2"
              style={{ opacity: i === 0 ? 0.12 : 0.4 }}
              aria-hidden="true"
            />

            <div className="shell relative grid w-full items-center gap-10 pt-20 pb-12 md:grid-cols-2 md:gap-14 md:pt-16">
              {/* copy */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="sh-anim flex items-center gap-4">
                  <span className="font-display text-6xl font-bold leading-none text-accent/90 md:text-7xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-12 w-px bg-line" aria-hidden="true" />
                  <span className="eyebrow text-faint">{stage.tag}</span>
                </div>
                <h3 className="sh-anim display mt-7 text-[clamp(2rem,4.4vw,3.4rem)] text-bone">
                  {stage.title}
                </h3>
                <p className="sh-anim mt-5 max-w-[44ch] text-lg leading-relaxed text-mute">
                  {stage.copy}
                </p>
                {i === 2 && (
                  <div className="sh-anim mt-7 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                    <Check size={16} />
                    Conflicts resolved before construction
                  </div>
                )}
              </div>

              {/* visual */}
              <div className={`sh-anim relative mx-auto aspect-square w-full max-w-[420px] md:max-w-[480px] ${i % 2 === 1 ? "md:order-1" : ""}`}>
                {VISUALS[i]}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
