"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// "Then" — disconnected 2D drawings. Three flat orthographic sheets (plan,
// section, detail), askew and overlapping, each drifting on its own so they
// read as fragmented and uncoordinated. Muted, paper-like, deliberately flat.

const PAPER = "oklch(0.205 0.012 70)";
const EDGE = "oklch(0.5 0.045 68)";
const INK = "oklch(0.7 0.085 66)";

function Sheet({
  cls,
  transform,
  children,
  opacity = 1,
}: {
  cls: string;
  transform: string;
  children: React.ReactNode;
  opacity?: number;
}) {
  return (
    <g transform={transform} opacity={opacity}>
      <g className={cls}>
        <g className={`${cls}-float`}>{children}</g>
      </g>
    </g>
  );
}

export default function DisconnectedSheets({
  className = "",
  play = true,
}: {
  className?: string;
  play?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const sheets = gsap.utils.toArray<SVGElement>(".ds-sheet", el);
      const floats = gsap.utils.toArray<SVGElement>(".ds-sheet-float", el);

      if (prefersReducedMotion()) {
        gsap.set([el, ...sheets], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(el, { autoAlpha: 1 });
      gsap.set(sheets, { autoAlpha: 0, y: 26 });

      if (!play) return;

      gsap.to(sheets, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.14,
        ease: "nx-out",
        delay: 0.1,
      });

      // Each sheet drifts independently: the visual language of "disconnected".
      floats.forEach((f, i) => {
        gsap.to(f, {
          y: i % 2 === 0 ? -9 : 9,
          x: i === 1 ? 6 : -4,
          duration: 4 + i,
          delay: 1 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: ref, dependencies: [play] },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 600"
      className={`reveal-up ${className}`}
      fill="none"
      aria-hidden="true"
    >
      {/* detail sheet, behind */}
      <Sheet cls="ds-sheet" transform="translate(300 408) rotate(-4)" opacity={0.7}>
        <rect x={-110} y={-78} width={220} height={156} rx={7} fill={PAPER} stroke={EDGE} strokeWidth={1.4} />
        <line x1={-78} y1={-30} x2={78} y2={-30} stroke={INK} strokeWidth={1.2} />
        <line x1={-78} y1={-30} x2={-78} y2={20} stroke={INK} strokeWidth={1.2} />
        <line x1={78} y1={-30} x2={78} y2={20} stroke={INK} strokeWidth={1.2} />
        <line x1={-60} y1={40} x2={60} y2={40} stroke={INK} strokeWidth={1} strokeDasharray="4 6" opacity={0.7} />
        <circle cx={-60} cy={40} r={2.5} fill={INK} />
        <circle cx={60} cy={40} r={2.5} fill={INK} />
      </Sheet>

      {/* section sheet, upper right */}
      <Sheet cls="ds-sheet" transform="translate(388 232) rotate(6)" opacity={0.92}>
        <rect x={-104} y={-74} width={208} height={148} rx={7} fill={PAPER} stroke={EDGE} strokeWidth={1.4} />
        <line x1={-74} y1={-44} x2={74} y2={-44} stroke={INK} strokeWidth={1.2} />
        <line x1={-74} y1={-14} x2={74} y2={-14} stroke={INK} strokeWidth={1.2} />
        <line x1={-74} y1={18} x2={74} y2={18} stroke={INK} strokeWidth={1.2} />
        <line x1={-50} y1={-50} x2={-50} y2={50} stroke={INK} strokeWidth={1.2} />
        <line x1={48} y1={-50} x2={48} y2={50} stroke={INK} strokeWidth={1.2} />
      </Sheet>

      {/* plan sheet, front left */}
      <Sheet cls="ds-sheet" transform="translate(232 300) rotate(-7)" opacity={1}>
        <rect x={-112} y={-80} width={224} height={160} rx={7} fill={PAPER} stroke={EDGE} strokeWidth={1.5} />
        <rect x={-78} y={-50} width={156} height={100} fill="none" stroke={INK} strokeWidth={1.3} />
        <line x1={6} y1={-50} x2={6} y2={50} stroke={INK} strokeWidth={1.2} />
        <line x1={-78} y1={6} x2={6} y2={6} stroke={INK} strokeWidth={1.2} />
        <line x1={-40} y1={-50} x2={-40} y2={-32} stroke={PAPER} strokeWidth={3} />
        <line x1={6} y1={20} x2={28} y2={20} stroke={PAPER} strokeWidth={3} />
      </Sheet>
    </svg>
  );
}
