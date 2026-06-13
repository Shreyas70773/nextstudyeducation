"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { PlayMark } from "./icons";

// Seamless infinite marquee. Two identical tracks translate by -50% on loop so
// there is never a visible seam. Speed is px/sec, direction reversible.
export default function Marquee({
  items,
  speed = 60,
  reverse = false,
  className = "",
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;
      const half = el.scrollWidth / 2;
      const duration = half / speed;
      gsap.set(el, { xPercent: reverse ? -50 : 0 });
      gsap.to(el, {
        xPercent: reverse ? 0 : -50,
        duration,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: wrap, dependencies: [speed, reverse] },
  );

  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className="font-display text-lg font-medium tracking-tight text-mute whitespace-nowrap">
            {item}
          </span>
          <PlayMark size={9} className="mx-7 text-accent/70" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
