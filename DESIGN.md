# DESIGN.md — Nextudy

Dark cinematic, warm charcoal canvas, single electric accent (brand orange). Reconciles
the brand's dark-theme spec with an awwwards-grade motion craft. Tokens live in
`app/globals.css` (@theme, OKLCH). The full author rules are in `docs/SECTION_CONTRACT.md`.

## Color (OKLCH, never pure #000/#fff)
- Canvas `--color-ink` warm near-black; surfaces `ink-800` / `ink-700` / `ink-600`.
- Light register: `paper` (brand cream #fdfada) for the Outcomes + Testimonials "breath" chapter, with `text-ink` + `border-paper-line`.
- Type: `bone` (warm white), `mute` (secondary), `faint` (captions).
- Accent: `accent` #f9a11d (dominant), `accent-bright`, `accent-deep`, `accent-ink` (text on orange).
- No gradient text, no neon element glows. Ambient orange via `.bloom` (background atmosphere only).

## Typography
- Display: Satoshi (self-hosted, `font-display`), 300/400/500/700/900. Tight tracking, clamp() sizing, headlines 2-3 lines max.
- Body: Manrope (`font-body`), `max-w-[60ch]`, leading-relaxed.

## Layout
- `.shell` (78rem) / `.shell-wide` (90rem). Cinematic vertical rhythm (py-24 md:py-36, varied).
- No three-equal-card rows; use asymmetric grids, bento (grid-flow-dense), zig-zag, horizontal scroll, editorial lists.
- Mobile: collapse to single column under md. `min-h-[100dvh]` for full-height, never `h-screen`.

## Motion (GSAP 3.15 + Lenis, no Framer Motion)
- Eases: `nx-out` (cubic 0.16,1,0.3,1) default, `nx-inout`. Entrances 0.6-1.2s.
- Idioms: SplitText line-mask headings (`TextReveal`), scroll reveals (`Reveal`), pinned scrub (TheShift), drawSVG line draws (WireframeBuilding / journey), magnetic CTAs (`Magnetic`), seamless marquee (`Marquee`), preloader counter + curtain.
- Always guard `prefersReducedMotion()` to a visible final state; clean up timelines/ScrollTriggers/SplitText.
- Animate transform/opacity/drawSVG/clipPath only. Fixed film grain overlay (never on scroll nodes).

## Components / primitives
`ui/Button` (anchor CTA, primary/ghost, magnetic), `ui/Magnetic`, `ui/Reveal`, `ui/TextReveal`,
`ui/Kicker` (meaningful eyebrow), `ui/Marquee`, `ui/Logo`, `ui/icons` (inline SVG, no icon font),
`visuals/WireframeBuilding` (iso BIM wireframe, drawSVG + pulsing coordination nodes),
`visuals/BlueprintBackdrop` (hairline grid + scan line). Brand assets in `public/brand` (mark.png, wordmark.png).
