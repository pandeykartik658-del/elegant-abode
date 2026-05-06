
# Hero v6 — "Cinematic Atelier"

You've said the matted-paper monograph reads quiet but flat. The cure isn't more drafting marks — it's **stage lighting, scale contrast, and a darker canvas**. v6 keeps the architectural rigor of v5 but trades the small right-side photo plate for a **full-bleed cinematic cover** with the type carved into it. Selected Works stays untouched.

---

## Diagnosis (why current hero feels 7/10)

1. **Single tonal range.** Everything is paper-on-paper. No deep blacks, no glow → no depth.
2. **Photo is too small.** A 4/5 plate beside text feels like a thumbnail, not a hero image.
3. **Color discipline is too disciplined.** Clay appears 4 times in tiny doses — invisible.
4. **Headline floats.** "ARCHITECTURE / of / tower." has no anchor against the busy grid.
5. **No volumetric depth.** Drafting grid is flat overlay; mat board is a 2D offset. There's no light, no atmosphere, no z-axis cue.

---

## Direction — "Studio at dusk"

Think: a curated monograph spread + a Kogonada film still. **Warm ink-black canvas**, a single shaft of warm window light, a giant cover image that the type is *cut into* with `mix-blend-mode: difference`, and one decisive clay accent that actually reads.

```text
┌──────────────────────────────────────────────────────────────┐
│  AXIS NOVA · ATELIER 2026               TYO 14:22 · NYC 01:22│
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│   ╔═══════════════════════════════════════╗                  │
│   ║                                       ║   N° 17          │
│   ║                                       ║   ──────         │
│   ║       [ Cover image, full-bleed ]    ║   PROJECTS        │
│   ║                                       ║   IN MOTION      │
│   ║   ARCHITECTURE                        ║                  │
│   ║       of                              ║   ↓ scroll       │
│   ║   ⟨ tower ⟩  ← clay, italic, morph   ║                  │
│   ║                                       ║                  │
│   ║   Quiet volumes for loud cities.      ║                  │
│   ╚═══════════════════════════════════════╝                  │
│                                                              │
│  PL.03 / MERIDIAN TOWER · SGP 2023        SECT.A-A′  ◐ 60s   │
└──────────────────────────────────────────────────────────────┘
```

---

## 1. Palette — introduce real depth

Add (don't replace):

```
--ink-deep:    oklch(0.18 0.018 60)   /* near-black, warm */
--ink-night:   oklch(0.12 0.012 50)   /* cinematic shadow */
--clay-glow:   oklch(0.74 0.17 45)    /* brighter clay for dark bg */
--brass:       oklch(0.78 0.12 80)    /* warm highlight accent */
--paper-warm:  oklch(0.96 0.018 80)   /* the existing paper, kept */
```

Hero becomes a **dark stage** (`bg-ink-deep`) with paper-warm type. The rest of the page (Marquee, Philosophy, Selected Works…) keeps the paper background — so the hero reads as a single cinematic plate before the monograph begins. This contrast alone adds the "vibrancy" you want without going maximalist.

---

## 2. Composition — full-bleed cover with carved type

**Replace the 5/12 photo + 6/12 text grid** with a single layered stage:

- **Layer A (back, 0):** dark `--ink-deep` canvas + 7% warm grain.
- **Layer B (z-10):** **full-bleed cover image** clipped to a giant 12-column matted plate with 6vw inset on left and 14vw inset on right (asymmetric framing — leaves a vertical "margin gutter" on the right for the HUD column). Heavy duotone treatment: image desaturated to ~45%, multiplied with a warm `#1a1410` overlay → it reads as one tonal family with the canvas. Subtle radial vignette focused on lower-left.
- **Layer C (z-20):** **shaft of light** — a 30° rotated, 240px-wide white→transparent gradient strip slowly drifting across the image (12s loop, 8% opacity peak). This is the single biggest cinematic upgrade: it gives the scene volumetric depth like raked dusk light through a window.
- **Layer D (z-30):** **headline carved into the image** using `mix-blend-mode: difference` + `color: var(--paper-warm)`. The type changes brightness depending on what's behind it — instant photographic depth.
- **Layer E (z-40):** HUD rail, numeral counter, plate caption, clocks — all in mono on top.

The drafting grid stays but at `ink/[0.04]` over the dark canvas; ticks switch to `--brass` at 25% opacity so they whisper instead of disappear.

---

## 3. Typography — bigger, bolder, anchored

| element | change |
|---------|--------|
| "ARCHITECTURE" | from `7.6vw` → `10vw` desktop, `wght:380, opsz:144, SOFT:30`, paper-warm. Tracks `-0.04em`. The single largest visual on the page. |
| "of" | smaller (`2.4vw`), italic, indented `4ch`, paper-warm at 50% opacity. Acts as a comma. |
| morph word ("tower.") | **clay-glow**, italic, `9vw`, with a 1.5px hairline underline that draws across as the word lands. This is the 5/5 moment — the only saturated color on screen. |
| tagline | "Quiet volumes for loud cities." — `Fraunces italic` at 1.2vw, paper-warm/65, sits below morph. |
| supporting line | "Tokyo · New York · since MMIX" in mono, brass tint at 60%. |

The headline now occupies ~55% of the screen height instead of ~30%. That's what reads as "vibrant" — typographic authority, not hue saturation.

---

## 4. The HUD column (right gutter)

A vertical 14vw rail anchored top-to-bottom on the right, separated from the cover by a 1px brass hairline. Contents top→bottom:

```
N° 17 / XXVI                    ← counted, brass, mono
──────────                       ← brass hairline draws L→R
PROJECTS IN MOTION               ← mono micro caps, paper/55
                                 (whitespace)
TYO  14:22                       ← live clock
NYC  01:22
                                 (whitespace)
● 14 LIVE COMMISSIONS            ← clay-glow pulse dot
                                 (whitespace)
SECT. A—A′                       ← mono micro
ELEV. NORTH ◐                    ← compass rose icon (already built), brass
                                 (push down)
SCROLL ↓                         ← bottom-anchored, paper/40
```

This consolidates every meta-detail into one disciplined column instead of scattering them across four corners. Reads as the title-block of an architectural drawing sheet.

---

## 5. Motion — choreographed in 6 acts (not 12)

12 beats was a lot. Compress to 6 distinct acts that the eye actually follows. Each act has a clear lead element + supporting motion.

```text
ACT  t      LEAD                          SUPPORT
───  ─────  ────────────────────────────  ─────────────────────────
1    0.00s  Canvas paper-warm flash       Grid hairlines fade to 4%
2    0.30s  Cover image reveals           Top-down clip (1.0s expo)
3    0.85s  Headline lines stagger up     "of" indents in 80ms after
4    1.40s  Morph word + underline draw   Clay glow 0→1, underline L→R
5    1.70s  HUD column draws top→bottom   Numeral counts 0→17, hairline draws
6    2.10s  Light shaft begins drifting   Tagline + scroll cue fade in
```

Continuous loops:
- **Light shaft drift** (12s linear, infinite) — the cinematic heartbeat
- Image Ken Burns 1.05→1.12 over 18s
- Word morph every 4s (slowed from 3.4 — gives each word more presence)
- Live dot pulse 2.4s
- Compass rose 60s rotation
- Clocks 30s tick

Scroll-out parallax stays but tuned: image `y:-160 scale:1.10`, headline `y:-50`, HUD `y:-90 opacity→0`, light shaft fades first.

Cursor on the image becomes a **brass crosshair reticle** with a tiny `VIEW` label that fades in on hover — replaces the current diff-blend dot.

---

## 6. The one decisive accent

**Clay-glow appears in exactly three places, each consequential:**

1. The morph word (the verb of the headline)
2. A 1.5px underline beneath the morph word (draws on entry)
3. The 14-live-commissions pulse dot in the HUD

That's it. No section line on the photo (we're losing it — it competed with the headline). No clay tagline rule. Three uses, each large enough to actually carry color. **Brass** carries the secondary warm work (compass, numeral, hairline under N°17) so clay isn't asked to do two jobs.

---

## 7. Files to change

- **`src/components/landing/Hero.tsx`** — restructure into the layered stage above. Remove the 5/7 photo+text grid; remove the SECT. A-A′ section line on the photo; remove asymmetric corner brackets (HUD column makes them redundant); add `<LightShaft />`, `<HudColumn />` local components; keep `<DraftingGrid />`, `<CompassRose />`, `<NumeralCounter />`.
- **`src/styles.css`** — add `--ink-deep`, `--ink-night`, `--clay-glow`, `--brass`, `--paper-warm` tokens. Add utilities: `.bg-ink-deep`, `.text-paper-warm`, `.text-clay-glow`, `.text-brass`, `.bg-brass`, `.border-brass`. Add `.duotone-warm` utility (filter: `grayscale(55%) sepia(0.18) contrast(1.08) brightness(0.78)`). Add `.shaft-light` keyframe (translateX + slight rotate, 12s linear infinite). Update `.mat-board` to work on dark.
- **`src/routes/index.tsx`** — no change. The hero owns its dark canvas; the page below stays paper.

No other components touched. **Marquee, Philosophy, FeaturedProjects, WorksIndex, ClosingFrame stay exactly as they are.**

---

## What you'll see vs. now

| signal | now (v5) | after v6 |
|--------|----------|----------|
| canvas | warm paper | warm ink-deep — instant cinema |
| photo | 4/5 plate, ~30% of viewport | full-bleed cover, ~85% |
| photo treatment | grayscale 38% + multiply | duotone warm + radial vignette + drifting light shaft |
| headline | `7.6vw` floating beside photo | `10vw` carved into photo via blend-mode |
| morph word | clay italic | **clay-glow** italic + drawn underline (the moment) |
| meta | scattered across 4 corners | unified HUD column, drawing sheet title-block |
| color saturation | 4 tiny clay dots, lost | 3 decisive uses of clay-glow + brass warm support |
| motion sequence | 12 beats (busy) | 6 choreographed acts |
| ambient motion | grid + numeral + dot + clock + compass | + drifting volumetric light shaft (the heartbeat) |
| depth cues | mat offset + parallax | mat + parallax + duotone vignette + light shaft + blend-mode type |

---

## Dial-back switches (say the word)

- **"keep paper"** — keep the warm paper canvas, apply the rest (cover, blend-mode type, light shaft) on light. Less cinematic, more editorial.
- **"no light shaft"** — drop the drifting gradient. Calmer.
- **"no carve"** — type sits on top of image with a soft scrim instead of `mix-blend-mode: difference`.
- **"more clay"** — extend clay-glow into the numeral and one HUD label.

If you approve as-is I'll implement v6 in the next turn.
