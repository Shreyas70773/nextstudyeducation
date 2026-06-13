"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Wraps an interactive element and pulls it gently toward the cursor.
// Uses gsap.quickTo so updates run outside React's render cycle (no re-renders).
// Gated to fine-pointer + hover devices and disabled under reduced motion.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-flex will-change-transform ${className}`}>
      {children}
    </span>
  );
}
