"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Subtle blueprint atmosphere: a hairline grid with a single slow scan line.
// Lives behind content, masked to fade at the edges so it never fights the type.
export default function BlueprintBackdrop({
  className = "",
  fade = "radial",
}: {
  className?: string;
  fade?: "radial" | "top" | "bottom";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scan = ref.current?.querySelector(".bp-scan");
      if (!scan || prefersReducedMotion()) return;
      gsap.fromTo(
        scan,
        { yPercent: -10, opacity: 0 },
        {
          yPercent: 1000,
          opacity: 1,
          duration: 7,
          ease: "none",
          repeat: -1,
          repeatDelay: 2.5,
          keyframes: { opacity: [0, 0.8, 0.8, 0] },
        },
      );
    },
    { scope: ref },
  );

  const mask =
    fade === "radial"
      ? "radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent 78%)"
      : fade === "top"
        ? "linear-gradient(to bottom, black, transparent 85%)"
        : "linear-gradient(to top, black, transparent 85%)";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div className="blueprint-grid absolute inset-0" />
      <div className="bp-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
    </div>
  );
}
