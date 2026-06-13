# Nextudy — Section Author Contract

You are building ONE section component for an awwwards-grade, dark-cinematic landing
page for **Nextudy**, a mentor-led BIM / AEC upskilling startup (helps civil engineers,
architects, and graduates move into Building Information Modeling careers). Tagline:
"Skill up now." The page is Next.js 16 (App Router) + React 19 + Tailwind v4 + GSAP 3.15
+ Lenis. Your section must feel like it was made by the same hand as the Hero and
The Shift sections (read them — they are the gold reference).

## Non-negotiable: read these first
- `components/sections/Hero.tsx` and `components/sections/TheShift.tsx` (reference quality + motion idioms)
- `lib/content.ts` (your copy comes from here, do not invent new copy)
- `app/globals.css` (design tokens + utility classes)
- `components/ui/*` and `components/visuals/*` (the primitives you must reuse)

## Stack rules
- File is a Client Component: start with `"use client";`.
- Animate ONLY with GSAP via `@/lib/gsap` (never add Framer Motion, never `window.addEventListener('scroll')`).
- Import gsap helpers from `@/lib/gsap`: `gsap, useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, prefersReducedMotion`.
- Registered eases: `"nx-out"` (default), `"nx-inout"`. gsap defaults already use `nx-out`.
- Use `useGSAP(() => { ... }, { scope: ref })` with a root ref. Always guard: `if (prefersReducedMotion()) { /* set final state visible */ return; }`.
- Animate transform/opacity only (`autoAlpha`, `x/y/yPercent`, `scale`, `drawSVG`, `clipPath`). Never animate layout props.
- Clean up: return a cleanup that kills timelines/ScrollTriggers/SplitText (`tween.scrollTrigger?.kill(); split?.revert()`), or rely on `gsap.context` revert.
- No new npm dependencies. No images except `picsum.photos/seed/...` if truly needed (prefer vector/CSS). No emojis. No custom mouse cursor.

## Design tokens (Tailwind utilities, all generated from globals.css @theme)
Backgrounds: `bg-ink` (base canvas), `bg-ink-800` (elevated), `bg-ink-700` (card), `bg-ink-600` (raised).
Light register: `bg-paper` (brand cream) with `text-ink` headings, `text-ink/70` body, `border-paper-line`.
Text: `text-bone` (warm white, headings/body on dark), `text-mute` (secondary), `text-faint` (captions).
Accent (brand orange, dominant): `text-accent`, `bg-accent`, `text-accent-ink` (dark text ON orange), `text-accent-bright`.
Borders/lines: `border-line`. Fonts: `font-display` (Satoshi, headings), `font-body` (Manrope, default body).
Utility classes: `.shell` (max 78rem + responsive padding), `.shell-wide` (max 90rem), `.display` (display heading defaults),
`.eyebrow` (uppercase tracked label), `.bloom` (ambient orange glow blob — position it, give size), `.blueprint-grid`,
`.hairline`, `.reveal-up` (starts hidden; gsap reveals it).
Never use pure black/white, gradient text, neon element glows, or `h-screen` (use `min-h-[100dvh]`).

## Primitives you MUST reuse (do not reinvent)
- `import Button from "@/components/ui/Button"` — props: `href`, `variant?: "primary"|"ghost"`, `magnetic?`, `showArrow?`. Anchor-based CTA.
- `import Magnetic from "@/components/ui/Magnetic"` — wrap an element to pull it toward the cursor.
- `import Reveal from "@/components/ui/Reveal"` — scroll entrance wrapper. Props: `as?`, `className?`, `y?`, `delay?`, `start?`. Use for blocks/cards.
- `import TextReveal from "@/components/ui/TextReveal"` — kinetic heading. Props: `lines: string[]`, `as?`, `className?`, `start?`, `trigger` (pass `trigger` boolean true to play on scroll). Use for section H2s.
- `import Kicker from "@/components/ui/Kicker"` — meaningful eyebrow label (play-mark + words). Use the `eyebrow` field from content.
- `import Marquee from "@/components/ui/Marquee"` — props: `items: string[]`, `speed?`, `reverse?`.
- `import Logo from "@/components/ui/Logo"`.
- Icons (named): `import { ArrowUpRight, ArrowRight, Plus, Check, Spinner, PlayMark, Social } from "@/components/ui/icons"`.
- Visuals: `import WireframeBuilding from "@/components/visuals/WireframeBuilding"`, `import BlueprintBackdrop from "@/components/visuals/BlueprintBackdrop"`.
- Content: `import { ... } from "@/lib/content"`.

## Layout + craft rules (anti-AI-slop, enforced)
- Wrap content in `.shell` or `.shell-wide`. Generous vertical rhythm between sections: `py-24 md:py-36` (cinematic chapters), vary it, do not make every section identical.
- BANNED: three equal cards in a row (icon+title+text x3). Use asymmetric grids, 2-col zig-zag, bento (`grid-flow-dense`), horizontal scroll, or editorial lists instead.
- BANNED: cheap meta labels like "SECTION 01" / "QUESTION 05" / "ABOUT US". Use the meaningful `eyebrow` text from content via `<Kicker>`.
- BANNED: fake statistics, fake logos, placement/salary promises. The brief forbids them.
- Headlines: `font-display`, tight tracking (`tracking-[-0.02em]`/`tracking-tight`), `clamp()` sizing, max 2-3 lines, wide container. Emphasis via `text-accent` on a word/line (never gradient text).
- Body copy: `text-mute` on dark / `text-ink/70` on cream, `max-w-[60ch]`, `leading-relaxed`.
- Hover: cards/links must react (subtle border to `border-accent/50`, slight `-translate-y` or inner element move, image `scale-105` inside `overflow-hidden`). Buttons get press feedback (Button primitive already does).
- Responsive: mobile-first, collapse to single column under `md`, `px` handled by `.shell`. Test mentally at 390px and 1440px.
- Accessibility: real semantic tags, `aria-*` where needed, focus-visible rings on interactive elements, `prefers-reduced-motion` respected.

## Motion idioms to match the reference sections
- Section heading: `<TextReveal lines={...} trigger ... />` (line-mask rise on scroll).
- Blocks/cards entering: wrap in `<Reveal>` or do a staggered `gsap.from(cards, { y: 28, autoAlpha: 0, stagger: 0.08, scrollTrigger: { trigger, start: "top 80%", once: true }})`. Remember cards/items need `autoAlpha` from 0; set initial hidden so there is no flash (use the `.reveal-up` class or `gsap.set`).
- Use `drawSVG` for any line-drawing (e.g., a roadmap path) tied to a scrollTrigger.
- Keep it disciplined: every animation earns its place. Smooth `nx-out`, durations 0.6-1.2s for entrances.

## Output
- Write your file to the exact path given. Default-export the component named exactly as specified.
- The component takes NO props and renders a `<section id="...">` with the given anchor id.
- Return ONLY after the file is written and self-consistent (correct imports, valid TSX, no undefined symbols). Do NOT run build or dev.
