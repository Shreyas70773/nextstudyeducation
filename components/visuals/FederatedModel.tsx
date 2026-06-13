"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// "Next" — coordinated, clash-free delivery. Three discipline layers
// (architecture / structure / services) sit as exploded isometric planes that
// align on a shared axis, linked by coordination guides, with one bright
// coordination node that pulses and a resolved check. Reads as federation, not
// a single building (which is the previous panel).

const CX = 300;
const HW = 142;
const HH = 71;
const LEVELS = [196, 300, 404];

const diamond = (cy: number) =>
  `${CX},${cy - HH} ${CX + HW},${cy} ${CX},${cy + HH} ${CX - HW},${cy} ${CX},${cy - HH}`;

export default function FederatedModel({
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
      const planes = gsap.utils.toArray<SVGElement>(".fm-plane", el);
      const links = gsap.utils.toArray<SVGElement>(".fm-link", el);
      const rings = gsap.utils.toArray<SVGElement>(".fm-ring", el);
      const node = el.querySelector<SVGElement>(".fm-node");
      const check = el.querySelector<SVGElement>(".fm-check");

      if (prefersReducedMotion()) {
        gsap.set([el, ...planes], { autoAlpha: 1, y: 0 });
        gsap.set(links, { drawSVG: "100%" });
        gsap.set([node, check], { scale: 1, autoAlpha: 1, drawSVG: "100%", transformOrigin: "center" });
        return;
      }

      gsap.set(el, { autoAlpha: 1 });
      gsap.set(planes, { autoAlpha: 0, y: (i) => (i === 0 ? -26 : i === 2 ? 26 : 0) });
      gsap.set(links, { drawSVG: "0%" });
      gsap.set([node, ...rings], { scale: 0, transformOrigin: "center", autoAlpha: 1 });
      gsap.set(check, { drawSVG: "0%" });

      if (!play) return;

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(planes, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "nx-out" })
        .to(links, { drawSVG: "100%", duration: 0.7, stagger: 0.08, ease: "nx-out" }, "-=0.5")
        .to(node, { scale: 1, duration: 0.5, ease: "back.out(2.2)" }, "-=0.3")
        .to(check, { drawSVG: "100%", duration: 0.4, ease: "nx-out" }, "-=0.1");

      // Coordination pulse rings.
      rings.forEach((r, i) => {
        gsap.fromTo(
          r,
          { scale: 0.3, autoAlpha: 0.6 },
          {
            scale: 2.6,
            autoAlpha: 0,
            duration: 2.4,
            delay: 1.6 + i * 0.8,
            repeat: -1,
            ease: "sine.out",
            transformOrigin: "center",
          },
        );
      });

      return () => tl.kill();
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
      <defs>
        <linearGradient id="fm-stroke" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.66 0.15 55)" />
          <stop offset="100%" stopColor="oklch(0.83 0.15 74)" />
        </linearGradient>
      </defs>

      {/* vertical coordination guides at the left / right corners */}
      <line className="fm-link" x1={CX - HW} y1={LEVELS[0]} x2={CX - HW} y2={LEVELS[2]} stroke="oklch(0.762 0.158 64)" strokeWidth={1} strokeDasharray="3 7" opacity={0.55} />
      <line className="fm-link" x1={CX + HW} y1={LEVELS[0]} x2={CX + HW} y2={LEVELS[2]} stroke="oklch(0.762 0.158 64)" strokeWidth={1} strokeDasharray="3 7" opacity={0.55} />
      <line className="fm-link" x1={CX} y1={LEVELS[0] - HH} x2={CX} y2={LEVELS[2] + HH} stroke="oklch(0.762 0.158 64)" strokeWidth={1} strokeDasharray="3 7" opacity={0.35} />

      {/* architecture layer */}
      <g className="fm-plane">
        <polyline points={diamond(LEVELS[0])} stroke="url(#fm-stroke)" strokeWidth={1.5} strokeLinejoin="round" opacity={0.62} />
        <line x1={CX} y1={LEVELS[0] - HH} x2={CX} y2={LEVELS[0] + HH} stroke="oklch(0.762 0.158 64)" strokeWidth={1} opacity={0.4} />
        <line x1={CX - HW} y1={LEVELS[0]} x2={CX + HW} y2={LEVELS[0]} stroke="oklch(0.762 0.158 64)" strokeWidth={1} opacity={0.4} />
      </g>

      {/* structure layer (dominant) */}
      <g className="fm-plane">
        <polyline points={diamond(LEVELS[1])} stroke="url(#fm-stroke)" strokeWidth={1.7} strokeLinejoin="round" />
        <line x1={CX - HW} y1={LEVELS[1]} x2={CX} y2={LEVELS[1] - HH} stroke="oklch(0.83 0.15 74)" strokeWidth={1.1} opacity={0.55} />
        <line x1={CX + HW} y1={LEVELS[1]} x2={CX} y2={LEVELS[1] + HH} stroke="oklch(0.83 0.15 74)" strokeWidth={1.1} opacity={0.55} />
      </g>

      {/* services layer */}
      <g className="fm-plane">
        <polyline points={diamond(LEVELS[2])} stroke="url(#fm-stroke)" strokeWidth={1.5} strokeLinejoin="round" opacity={0.62} strokeDasharray="6 5" />
      </g>

      {/* coordination node + pulse + resolved check */}
      <g style={{ transformBox: "fill-box" }}>
        <circle className="fm-ring" cx={CX} cy={LEVELS[1]} r={14} fill="none" stroke="oklch(0.83 0.15 74)" strokeWidth={1.4} style={{ transformOrigin: `${CX}px ${LEVELS[1]}px` }} />
        <circle className="fm-ring" cx={CX} cy={LEVELS[1]} r={14} fill="none" stroke="oklch(0.83 0.15 74)" strokeWidth={1.4} style={{ transformOrigin: `${CX}px ${LEVELS[1]}px` }} />
        <circle className="fm-node" cx={CX} cy={LEVELS[1]} r={9} fill="oklch(0.83 0.15 74)" style={{ transformOrigin: `${CX}px ${LEVELS[1]}px` }} />
      </g>
      <path className="fm-check" d={`M ${CX - 5} ${LEVELS[1]} l 3.4 3.6 l 6.4 -7.6`} fill="none" stroke="oklch(0.24 0.07 60)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
