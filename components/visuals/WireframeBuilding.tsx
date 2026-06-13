"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Custom isometric BIM wireframe: stacked floor slabs + columns that draw in,
// with coordination nodes that pulse. No stock imagery. Pure vector so it stays
// crisp at any size and every stroke is animatable.

const FLOORS = 5;
const H = 56; // floor-to-floor in svg units

type P = [number, number];
const F: P = [300, 486];
const R: P = [474, 396];
const B: P = [300, 306];
const L: P = [126, 396];

const up = (p: P, k: number): P => [p[0], p[1] - H * k];
const poly = (pts: P[]) => pts.map((p) => p.join(",")).join(" ");
const slab = (k: number) => poly([up(F, k), up(R, k), up(B, k), up(L, k), up(F, k)]);

const nodes: { x: number; y: number; r: number }[] = [
  { ...pt(up(R, 2)), r: 1 },
  { ...pt(up(B, 3)), r: 1 },
  { ...pt(up(L, 1)), r: 1 },
  { ...pt(up(F, 4)), r: 1 },
  { ...pt(up(R, 5)), r: 1 },
];
function pt(p: P) {
  return { x: p[0], y: p[1] };
}

export default function WireframeBuilding({
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
      const reduced = prefersReducedMotion();

      const slabs = gsap.utils.toArray<SVGElement>(".wf-slab", el);
      const cols = gsap.utils.toArray<SVGElement>(".wf-col", el);
      const nodeEls = gsap.utils.toArray<SVGElement>(".wf-node", el);

      if (reduced) {
        gsap.set([...slabs, ...cols], { drawSVG: "100%" });
        gsap.set(nodeEls, { scale: 1, transformOrigin: "center" });
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      gsap.set(el, { autoAlpha: 1 });
      gsap.set([...slabs, ...cols], { drawSVG: "0%" });
      gsap.set(nodeEls, { scale: 0, transformOrigin: "center" });

      if (!play) return;

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(cols, { drawSVG: "100%", duration: 1.2, stagger: 0.05, ease: "nx-out" })
        .to(slabs, { drawSVG: "100%", duration: 0.9, stagger: 0.1, ease: "nx-out" }, 0.2)
        .to(
          nodeEls,
          { scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)" },
          "-=0.5",
        );

      // Continuous coordination pulse
      nodeEls.forEach((n, i) => {
        gsap.to(n, {
          scale: 1.55,
          opacity: 0.4,
          duration: 1.6,
          delay: 1.4 + i * 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "center",
        });
      });

      return () => tl.kill();
    },
    { scope: ref, dependencies: [play] },
  );

  const slabLevels = Array.from({ length: FLOORS + 1 }, (_, k) => k);
  const corners: P[] = [F, R, B, L];

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 600"
      className={`reveal-up ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wf-stroke" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.66 0.15 55)" />
          <stop offset="100%" stopColor="oklch(0.83 0.15 74)" />
        </linearGradient>
      </defs>

      {/* columns */}
      {corners.map((c, i) => (
        <line
          key={`c${i}`}
          className="wf-col"
          x1={c[0]}
          y1={c[1]}
          x2={up(c, FLOORS)[0]}
          y2={up(c, FLOORS)[1]}
          stroke="url(#wf-stroke)"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}

      {/* floor slabs, fainter toward the top */}
      {slabLevels.map((k) => (
        <polyline
          key={`s${k}`}
          className="wf-slab"
          points={slab(k)}
          stroke="url(#wf-stroke)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          opacity={0.45 + (k / FLOORS) * 0.55}
        />
      ))}

      {/* one diagonal brace to read as structure */}
      <line
        className="wf-col"
        x1={F[0]}
        y1={F[1]}
        x2={up(R, FLOORS)[0]}
        y2={up(R, FLOORS)[1]}
        stroke="oklch(0.762 0.158 64)"
        strokeWidth={1}
        strokeDasharray="2 7"
        opacity={0.5}
      />

      {/* coordination nodes */}
      {nodes.map((n, i) => (
        <circle
          key={`n${i}`}
          className="wf-node"
          cx={n.x}
          cy={n.y}
          r={5}
          fill="oklch(0.83 0.15 74)"
        />
      ))}
    </svg>
  );
}
