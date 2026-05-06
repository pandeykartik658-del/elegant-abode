
# Hero v5 — "Drafting Table"

The current hero reads like a clean editorial layout but not like *architecture*. v5 fixes three weaknesses you called out:

1. **Architectural depth** — there's no sense of plan/section/elevation, no measured space, no layered material.
2. **Aesthetic feel** — the photo is a flat rectangle floating beside text. No tactility, no print quality, no atmosphere transitioning the eye between planes.
3. **Typography (7/10 → 10/10)** — Inter @ weight 200 is generic for a luxury practice. The display word "ARCHITECTURE" is wide and limp. Hierarchy lacks an anchor numeral.

Below is the redesign. Selected Works stays as-is (you like it).

---

## 1. Typography — change the voice, not just the size

Current display = `Inter wght:200 -0.05em`. That's *Apple keynote*, not *architecture monograph*. Architects use cut serifs, geometric grotesques, or ultra-condensed display faces. We'll move to a true editorial pairing:

| role | current | new | why |
|------|---------|-----|-----|
| display headline | Inter 200 | **Fraunces Variable** (`opsz:144, wght:300, SOFT:30`) high-contrast roman caps | already loaded, gives Didone-like contrast — instantly "monograph" |
| morph italic word | Fraunces italic | **Fraunces italic** with `opsz:144, wght:400, SOFT:100` + optical kerning | softer, more handwritten |
| meta / labels | Inter caps tracked | **JetBrains Mono** 400, tracked `0.18em` | engineers' caption — drafting feel |
| body micro | Inter | Inter 400 (kept) | unchanged |

Add JetBrains Mono via `@fontsource-variable/jetbrains-mono` (`bun add` it during build). Update `.label-meta` to use the mono.

Headline composition becomes:

```text
N°               XVII             ◂ mono, ink/30, drafted left
─────────────────────────────     ◂ 1px hairline rule, draws across
ARCHITECTURE                      ◂ Fraunces ROMAN caps, contrast
   of                             ◂ Fraunces italic, ink/35, indented
TOWER.                            ◂ Fraunces italic, clay (morph word)
─── 64px clay rule
Quiet volumes for loud cities.    ◂ italic body, single line
TYO · NYC · since MMIX
```

Removing the boxed sans "ARCHITECTURE" in favor of high-contrast Fraunces roman is the single biggest aesthetic upgrade. It makes the word read as engraved/printed instead of typed.

---

## 2. Architectural depth — measured, not just deep

We add three architecture-native motifs that flat editorial layouts don't have:

### a) Drafted tick-mark grid (background plane Z-3)
A faint 8-column architectural grid drawn in 1px hairlines across the entire viewport with **measurement ticks** every 80px (`A | B | C | D | E | F | G | H`). Opacity `ink/8`. Animates draw-in left→right over 1.4s on load. Becomes invisible structure that "explains" why elements align where they do — pure draftsmanship.

### b) Section / Elevation labels
Top-left of the photo gets a tiny label `SECT. A-A` and bottom of the right column gets `ELEV. NORTH`. These are blueprint vocabulary — they make the page feel like a sheet pulled from a project set.

### c) Compass rose (lower-right of hero)
A 56px architect's compass: a circle with N/E/S/W ticks, one slow continuous rotation (60s loop). Drawn with SVG at `ink/30`. Placed where the bottom rail meets the right margin. Quiet but unmistakable.

---

## 3. Photo plane — from rectangle to **window**

Three changes layer real depth into the image:

- **Mat board behind the frame**: a `paper` rectangle offset 24px down/right behind the photo with a `1px ink/15` border + soft drop. Makes the image feel printed and mounted, not embedded.
- **Section line through the photo**: a 1px clay-tinted horizontal cut at 38% from the top, with two tick marks `A` and `A'` at the ends. This is the line referenced by `SECT. A-A` — a tiny inside joke, but it visually slices the image into thirds (the architectural rule of thirds done literally).
- **Plate caption** sits *under* the photo (not vertically beside) in mono small caps:
  ```
  PL. 03 / MERIDIAN TOWER          SGP · 2023 · 47°F
  ```
  More gallery, less rotated label. The vertical `writing-mode` rotation reads as a gimmick on second visit.

Image transition stays the split-curtain wipe but slows to **1.3s** with a darker mid-frame: a 60ms paper-flash between exits (the outgoing image briefly reveals paper behind before the incoming arrives — like a slide projector advancing). This adds a beat of darkness that is far more cinematic than direct cross-cut.

---

## 4. Color & material discipline

Current paper is fine. Add:

- `--ink-warm: oklch(0.22 0.02 70)` — slightly warmer ink for body, leaving the cool ink for headlines. Splits the type into two material tones (graphite vs ink) which is what monograph plates actually do.
- `--paper-shadow: oklch(0.92 0.014 84)` — for the mat board so it reads as a different paper stock, not the same surface.

Clay stays the single accent. Used in: morph word, section line `A—A'`, 64px tagline rule, the live-dot. Four uses, all justified.

---

## 5. Synchronized motion (refined)

Sequence — each beat clearly handed off, no overlap fog:

```text
beat  t      element                                   ease
────  ─────  ───────────────────────────────────────  ────────
0     0.00s  paper fade-in                            linear
1     0.15s  drafting grid lines draw L→R             quint-out
2     0.45s  ticks letter in (A B C D E F G H)        quint-out
3     0.65s  HUD top + bottom rails                   quint-out
4     0.85s  N° XVII numeral counts up 0→17           expo-out
5     1.00s  rule under numeral draws L→R             expo-out
6     1.15s  photo mat fades in                       quint-out
7     1.30s  passe-partout opens (clip-path)          expo-in-out
8     1.55s  SECT. A-A line draws across photo        quint-out
9     1.65s  headline lines reveal (stagger 140ms)    quint-out
10    2.10s  morph word arrives                       expo-out
11    2.25s  64px clay rule + tagline                 quint-out
12    2.40s  compass rose fades + starts rotating     linear
```

Continuous loops (independent):
- Photo Ken Burns 1.04→1.10 over 16s
- Word morph every 3.4s
- Live dot pulse 2.4s
- Compass 60s rotation
- Tokyo/NYC clocks 15s tick

Scroll-out parallax: numeral leaves fastest (`y:-300`), photo `y:-120` + `scale:1.06`, headline `y:-40` per-line bottom-up, grid fades to 0, rails fade first.

---

## 6. Files to change

- **`src/components/landing/Hero.tsx`** — full rewrite per spec above. Add `<DraftingGrid />`, `<CompassRose />`, `<NumeralCounter />`, `<SectionLine />` as local components within the file.
- **`src/styles.css`** —
  - Add `@import "@fontsource-variable/jetbrains-mono/index.css";`
  - Add `.font-mono-meta` utility (JetBrains Mono 400, tracked)
  - Update `.label-meta` to use mono
  - Add `--ink-warm`, `--paper-shadow` tokens
  - Add `.mat-board` utility (offset shadow rectangle)
  - Add `.shadow-plate` (softer than `shadow-print`)
- **`package.json` / install** — `bun add @fontsource-variable/jetbrains-mono`

No other components touched. Marquee, Philosophy, FeaturedProjects, WorksIndex, ClosingFrame stay exactly as they are.

---

## What you'll see vs. now

| signal | now | after v5 |
|--------|-----|----------|
| typography voice | minimalist tech | engraved monograph |
| background | paper + faded "17" | paper + 8-col drafted grid + "17" |
| photo | floating rectangle | matted plate with section cut |
| metadata font | Inter caps | mono caps (drafting style) |
| architectural cues | none | grid ticks, SECT./ELEV. labels, compass rose, section line |
| numeral hierarchy | static "N° XVII / 26" in corner | giant counted numeral as primary anchor with rule below |
| photo transition | split wipe | split wipe + 60ms paper flash (slide-projector beat) |
| accents | 4 clay touches | 4 clay touches (disciplined) |

If you want to dial back any element say the word and I'll trim it: **"no grid"** removes the drafting grid; **"no compass"** removes the rose; **"keep label vertical"** keeps the rotated photo caption.
