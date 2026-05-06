
# AXIS NOVA — v2: from "nice" to gallery-grade

The current page leans on flat opacity fades and a tired dark hero stack. We rebuild around a new visual thesis, install **framer-motion**, and replace passive transitions with choreography that reacts to scroll, cursor and time.

## 1. New visual thesis

Drop the black hero. New palette is warm, paper-like, with ink as accent — feels like an architectural monograph, not a tech site.

- **Paper** `#EFECE4` (background, dominant)
- **Ink** `#0E0E0C` (type)
- **Clay** `#C2724A` terracotta accent (single hot note — used on the moving index, hero ticker dot, hover states)
- **Mist** `#D9D4C7` (cards, dividers)
- Typography: keep Inter 200 for display, but introduce **"Fraunces"** (variable serif) for an oversized italic display word that morphs in the hero. Use `font-variation-settings` opsz/wght animation — that's the "out of the box" type move.

## 2. Hero — "Living Blueprint"

Replace the cross-fading photo hero with a layered, generative composition. Five layers, all animated by framer-motion + scroll:

```text
┌────────────────────────────────────────────────────┐
│  AXIS NOVA            ───────────                  │  ← ultra-thin top rail with live time (Tokyo / NYC)
│                                                    │
│           A R C H I T E C T U R E                  │  ← split-letter stagger reveal (each glyph eases in
│           [italic serif word morphs:               │     on its own delay), letters wrapped in clip-paths
│            "tower" → "ground" → "light"            │
│            via AnimatePresence type swap]          │
│                                                    │
│   ┌─ blueprint SVG, slow draw-on with pathLength ─┐│
│   │  thin ink lines forming a tower elevation,    ││
│   │  axis ticks, dimension arrows; parallax on    ││
│   │  mouse move (springy, useMotionValue)         ││
│   └────────────────────────────────────────────────┘│
│                                                    │
│  35.6762° N · 139.6503° E   ●   14:02 JST          │
│  scroll ↓                              EST. 2009   │
└────────────────────────────────────────────────────┘
```

Motion details (framer-motion):
- `useScroll` + `useTransform` to slide the entire hero up 15% and fade as user enters Philosophy → reads as a pinned dolly.
- Hand-drawn SVG **blueprint of a tower elevation** with `motion.path` `pathLength` 0→1 over 2.5s, staggered per layer (frame, axis grid, dimension lines, label callouts).
- Cursor parallax on the blueprint via `useMotionValue` + `useSpring` (stiffness 80, damping 20) — moves only ±12px so it feels weighty, not gimmicky.
- Display headline split per character with `motion.span` and stagger 0.04s, `clipPath` reveal from below.
- One **rotating italic serif word** ("tower" / "ground" / "light" / "silence") in the headline, swapped every 3.2s via `AnimatePresence mode="wait"` with `y` + `filter: blur` cross.
- Live local clocks (Tokyo + NYC) ticking — small, ambient, real.
- A single **clay dot** that subtly breathes (scale 1↔1.15, 4s loop) — the only color on the page until the index.

No background photograph. The blueprint IS the hero. Photographs appear later as reward.

## 3. Marquee bridge (new)

Between hero and Philosophy, a single slim row scrolls horizontally with `motion.div` driven by `useScroll` (not a CSS keyframe — speed reacts to actual scroll velocity using `useVelocity` + `useSpring`):

```
TOKYO ●  NEW YORK ●  EST. 2009 ●  42 ARCHITECTS ●  14 LIVE COMMISSIONS ●  ...
```

Direction flips on scroll-up. Tiny detail, big "this thing is alive" signal.

## 4. Philosophy — kinetic type

- The long sentence is split into **words**, each `motion.span` revealed on enter with `y: 24 → 0`, `opacity 0 → 1`, stagger 0.05.
- Background gets a barely-visible animated grain layer (`mix-blend-multiply`, opacity 0.05).
- A vertical 1px clay rule on the left grows from 0% to 100% height as the section enters view (`useInView` + transform).

## 5. Featured Projects — true cinematic pin

Rebuild with framer-motion's `useScroll({ target, offset })`:
- Sticky 100vh canvas, three projects.
- Image: not just opacity — each image sits in a **clip-path frame that expands from a thin horizontal slit** (`inset(50% 0 50% 0)` → `inset(0 0 0 0)`) as it becomes active. Outgoing image collapses to a slit.
- Project number ("014") is huge, **outline-only**, sits behind the photo and counter-parallaxes upward as you scroll the section.
- Right-side text panel: each line word-staggers in. Project metadata animates with a horizontal rule that draws under it.
- Replace the right-edge progress bar with a **circular dial top-right** showing 01/03 with an SVG arc using `pathLength` bound to scroll progress.
- Photos shift to **duotone (paper × ink)** instead of pure grayscale — feels intentional with the new palette.

## 6. Works Index — magnetic + image flip

- Hovered row: name letters lift on a 0.03s stagger (`y: 0 → -4 → 0`), clay underline draws left-to-right.
- Cursor preview becomes a **9:11 portrait card** that:
  - follows cursor with `useSpring` lag (snappier than the current CSS `left/top`),
  - rotates ±4° based on cursor velocity (`useVelocity`) — a real "weight" effect,
  - cross-fades content via `AnimatePresence` so swapping rows feels like flipping a slide.
- A sticky meta column on the left shows the **currently hovered city + year** in large type, animating with `AnimatePresence`.

## 7. Closing frame — controlled drama

- Background switches to ink, transition handled by an **SVG mask wipe** (a giant circle expanding from the CTA position) when the section enters view — gives a real "curtain" moment instead of a hard color flip.
- "Build quietly. Build to last." set in Fraunces italic, words revealed one-by-one.
- CTA button: magnetic hover (button translates ~6px toward cursor via `useSpring`), arrow extends on hover.

## 8. Global motion system

- Install **framer-motion**. Keep lenis for smooth scroll.
- Add `src/components/motion/` primitives reused across sections:
  - `<Reveal>` — wraps children, fade-up on enter (`useInView` once).
  - `<SplitText>` — splits a string into per-char or per-word motion spans with stagger.
  - `<MagneticButton>` — spring-follows cursor.
  - `<MarqueeScroll>` — velocity-driven horizontal marquee.
- Respect `prefers-reduced-motion`: a single hook disables stagger / parallax / blur.
- Top bar: when over ink sections it switches color via `useScroll` + a section-bounds map (cleaner than `mix-blend-difference`, which currently looks muddy).

## 9. Files touched

- `package.json` — add `framer-motion`, `@fontsource-variable/fraunces`.
- `src/styles.css` — new tokens (paper, ink, clay, mist), grain utility, duotone helper, Fraunces import.
- `src/components/motion/{Reveal,SplitText,MagneticButton,MarqueeScroll}.tsx` — new.
- `src/components/landing/Hero.tsx` — full rewrite (blueprint SVG + motion).
- `src/components/landing/Marquee.tsx` — new bridge section.
- `src/components/landing/Philosophy.tsx` — kinetic type pass.
- `src/components/landing/FeaturedProjects.tsx` — clip-path image transitions, outline numerals, dial.
- `src/components/landing/WorksIndex.tsx` — spring cursor card, sticky meta column.
- `src/components/landing/ClosingFrame.tsx` — SVG wipe + magnetic CTA.
- `src/components/landing/TopBar.tsx` — section-aware color logic.
- `src/routes/index.tsx` — insert `<Marquee/>` between Hero and Philosophy.

## Open question

Should the hero **blueprint** depict (a) a tower elevation, (b) a city plan/aerial axonometric, or (c) a quiet section drawing of a single room? I'll pick (a) tower elevation by default since the studio is "commercial & urban" — say the word if you'd rather (b) or (c).
