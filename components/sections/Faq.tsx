"use client";

import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  SplitText,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/gsap";
import { faqs } from "@/lib/content";
import Kicker from "../ui/Kicker";
import { Plus, ArrowUpRight } from "../ui/icons";

// Dark-register accordion. Left column anchors the chapter (label + heading +
// a quiet pointer to the lead form); right column is the list. One item open at
// a time, the first open by default. Expand/collapse uses the grid-template-rows
// 0fr->1fr technique so the panel grows on the compositor without layout jank;
// the icon morphs plus -> x with a transform only. Entrances are GSAP-driven.

export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const heading = el.querySelector<HTMLHeadingElement>(".faq-heading");
      const items = gsap.utils.toArray<HTMLElement>(".faq-item", el);

      if (prefersReducedMotion()) {
        if (heading) gsap.set(heading, { autoAlpha: 1 });
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      // Pre-hide so nothing flashes before the scroll reveal runs.
      gsap.set(items, { autoAlpha: 0, y: 24 });

      const itemsTween = gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.07,
        scrollTrigger: { trigger: ".faq-list", start: "top 82%", once: true },
      });

      let split: SplitText | null = null;
      let headingTween: gsap.core.Tween | null = null;
      // Guard the async work: if the effect is torn down (unmount or StrictMode
      // double-invoke) before fonts settle, skip splitting so we never create a
      // dangling SplitText/ScrollTrigger on an already-cleaned heading.
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !heading) return;
        split = new SplitText(heading, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        gsap.set(heading, { autoAlpha: 1 });
        gsap.set(split.lines, { yPercent: 110 });
        headingTween = gsap.to(split.lines, {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.1,
          scrollTrigger: { trigger: heading, start: "top 85%", once: true },
        });
        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        itemsTween.scrollTrigger?.kill();
        itemsTween.kill();
        headingTween?.scrollTrigger?.kill();
        headingTween?.kill();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section id="faq" ref={root} className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="bloom -right-40 top-1/4 h-[440px] w-[440px] opacity-25" />

      <div className="shell relative grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
        {/* chapter anchor */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Kicker>Questions</Kicker>

          <h2 className="faq-heading reveal-up display mt-6 text-[clamp(2rem,3.6vw,3.25rem)] text-bone">
            Straight answers,
            <br />
            <span className="text-accent">no script.</span>
          </h2>

          <p className="mt-6 max-w-[34ch] leading-relaxed text-mute">
            Still deciding where you fit? A mentor will talk through which program
            suits you, and which doesn&apos;t.
          </p>

          <a
            href="#lead"
            className="group mt-7 inline-flex items-center gap-2 rounded-sm font-display text-[0.95rem] font-medium tracking-tight text-accent transition-colors duration-200 hover:text-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
          >
            Get the course syllabus
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* accordion */}
        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="faq-item reveal-up border-t border-line last:border-b"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`faq-trigger-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-6 rounded-md py-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:py-7"
                  >
                    <span
                      className={`font-display text-lg font-medium tracking-tight transition-colors duration-300 md:text-xl ${
                        isOpen ? "text-bone" : "text-mute group-hover:text-bone"
                      }`}
                    >
                      {item.q}
                    </span>
                    <span
                      className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border text-accent transition-colors duration-300 ${
                        isOpen ? "border-accent/60" : "border-line group-hover:border-accent/50"
                      }`}
                    >
                      <Plus
                        size={18}
                        className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  aria-hidden={!isOpen}
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[56ch] pb-7 pr-12 leading-relaxed text-mute">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
