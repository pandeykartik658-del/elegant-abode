
# Hero v3 — "Cinematic Stage" + motion sweep

Keep the current Hero as base, but rebuild it into an editorial split-stage with real depth, then propagate motion across the rest of the page. Slim the marquee. Trim filler.

## 1. Hero — split-stage composition

Replace the centered title-over-blueprint with a 12-column editorial stage that *feels* like a magazine spread caught mid-turn.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ TYO 14:02 · NYC 01:02      ●  14 LIVE                  N° XVII / 26 │
│                                                                      │
│   ┌──────────┐                                                       │
│   │          │   An                       [vertical clay rule        │
│   │  TALL    │   architecture             grows top→bottom on load]  │
│   │  PHOTO   │   of                                                  │
│   │  (live   │   ▸ tower.  ← morphs (Fraunces italic, clay)          │
│   │  parallax│                                                       │
│   │  + slow  │   ────────                                            │
│   │  zoom)   │   Quiet volumes for loud cities.                      │
│   │          │   Tokyo · New York · since 2009.                      │
│   └──────────┘                                                       │
│                                                                      │
│   01 / 04   meridian tower — singapore                    scroll ↓   │
└──────────────────────────────────────────────────────────────────────┘
```

Key elements:

- **Left column (5/12)**: a tall portrait photograph in a thin clip-path frame. On mount the frame opens from `inset(50% 8% 50% 8%)` → `inset(0)` over 1.4s with `[0.83,0,0.17,1]`. Inside, the image does a continuous slow zoom (scale 1.05 → 1.12, 14s loop). Cursor parallax shifts it ±10px. The photo cycles every 6s through 4 tower photos via `AnimatePresence` with a horizontal slit cross (clip-path swap), each with a faint `01/04` counter top-left of the frame.
- **Right column (7/12)**: typographic stack. "An / architecture / of / **tower.**" stacked on its own line each — per-line `clipPath: inset(0 0 100% 0)` reveal with 120ms stagger. The morphing italic word stays (Fraunces, clay). Replace bland body sentence with a two-line tagline only.
- **Vertical clay hairline** between the two columns scales from `scaleY:0` to `1` (origin top) over 1.6s on mount — anchors the composition.
- **Blueprint** is moved to a *background watermark* behind the right column at 8% opacity, large, drifting slowly upward on scroll (parallax). It stops being the star, becomes texture.
- **Top rail**: TYO/NYC clocks + "14 LIVE" + edition number. Compact, single line.
- **Bottom rail**: current photo index `01/04` + project name (animates via `AnimatePresence` on photo swap) + scroll cue. Removes "Est. 2009 — Vol. XVII" duplication.
- Cursor follows a small **ink dot reticle** (10px) on the photo column only — pure CSS-free spring via `useSpring`. Subtle, tactile.
- Initial choreography (1.8s total): top rail fade → vertical rule grows → photo frame opens → blueprint draws (faster, 1.4s) → headline lines reveal → bottom rail fades.

## 2. Trim content

- Drop the long body paragraph in the hero (only the 2-line tagline remains).
- Drop the "Est. 2009 — Vol. XVII" bottom-right block (already in top rail).
- Marquee: shrink to a thin strip — `py-2`, font `text-xs label-meta` tracking-wide, a single line of small caps with hairline top + bottom and clay dots between items. No more 5xl serif. Velocity reaction stays.

## 3. Motion sweep across the rest of the page

Existing sections work but feel static between transitions. Add:

- **Philosophy**: each cap-card lifts on hover (`y:-4`, clay underline draw). The `— H. Arai` signature does a handwritten draw effect using `motion.svg path` instead of plain text (use a stroke-drawn signature SVG inline).
- **FeaturedProjects**: when the active project changes, the right-side text panel slides in horizontally (`x: 60 → 0`, opacity, 0.7s) instead of plain opacity. Add a subtle continuous Ken Burns (scale 1→1.08 over 8s) on the active image. Add a `motion.div` page-edge "frame ticks" at each corner that rotate-in on enter.
- **WorksIndex**: when a row is hovered, the *other* rows fade to `opacity:0.35` and shift `x: 8` — focus mode. Row letters do a subtle `y` wave on hover.
- **ClosingFrame**: keep the wipe; add a slow continuous `letter-spacing` breath on the headline (0.02em ↔ 0.04em, 6s).
- **Global**: add a `<PageProgress>` 1px clay bar at the very top driven by `useScroll().scrollYProgress`. Add a custom **cursor** (12px ink ring with clay dot) that scales 2x on hovering interactive elements.

## 4. Files

- `src/components/landing/Hero.tsx` — full rewrite to split-stage.
- `src/components/landing/Marquee.tsx` — shrink to thin strip, small caps.
- `src/components/landing/FeaturedProjects.tsx` — slide-in text panel, Ken Burns, corner ticks.
- `src/components/landing/WorksIndex.tsx` — focus-on-hover dimming.
- `src/components/landing/Philosophy.tsx` — signature SVG draw, hover lift.
- `src/components/landing/ClosingFrame.tsx` — letter-spacing breath.
- `src/components/landing/PageProgress.tsx` — new, 1px scroll bar.
- `src/components/landing/Cursor.tsx` — new, custom spring cursor (desktop only).
- `src/routes/index.tsx` — mount `<PageProgress/>` and `<Cursor/>`.
- Hero photos: 4 Unsplash tower URLs (no new asset files).

## Open question

Default photo cycle is **4 tall tower photographs** (architectural, neutral, B&W-leaning). Reply with "city plan" or "interiors" to swap that mood; otherwise I proceed with towers.
