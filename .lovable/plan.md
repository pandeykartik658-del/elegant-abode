
# Hero v4 — "Editorial Depth"

The current hero has the right ingredients but reads flat: too many competing accents (clay rule + clay dot + clay word + clay corner ticks + clay counter), the photo and type live on the same plane with no atmospheric depth, and the entrance animations all fire on similar timings so nothing feels *led*. v4 rebuilds it as a single, breathing composition.

## 1. Composition — true depth in 3 planes

Establish three z-planes so the eye lands on the photo first, then the headline, then the metadata.

```text
plane Z-2  ▸ atmosphere : large faded numeral "17" + blueprint, blurred, drifting
plane Z-1  ▸ stage      : photo (left) + headline stack (right)
plane Z-0  ▸ hud        : top rail · bottom rail · scroll cue · index ticker
```

- Replace the boxed hairline frame + 4 corner ticks with **two thin asymmetric rules only**: a top-left bracket `┌` (24px) and a bottom-right bracket `┘` (24px). Less noise, more intent.
- Add a **giant background numeral** "17" (Fraunces, ~58vw, ink @ 4% opacity, behind everything) bleeding off the right edge. Slow parallax on scroll. This is the editorial anchor — it's what makes monographs feel like monographs.
- Move the blueprint *behind the photo column* at 6% opacity (not behind the type) so the right side stays clean for typography.

## 2. Photo — make it feel like a window, not a tile

- Wrap the photo in a **double frame**: outer 1px `--hairline` offset 12px, inner photo. Creates a passe-partout / mat board look.
- Add a **soft inner shadow** via `box-shadow: inset 0 0 80px rgba(14,14,12,.25)` so the image has held-print depth.
- Replace the 4-photo carousel with **3 photos** and slow it to **8s** intervals — current 5.8s is anxious, gallery pace is slower.
- The transition is the single hero animation: a **horizontal split-curtain wipe** — the outgoing image splits from a center seam (top half lifts up, bottom half drops) over 1.1s with `[0.83,0,0.17,1]`, revealing the next image already in place underneath. Drop the simultaneous opacity fade — wipes don't fade.
- Continuous Ken Burns scale 1.04 → 1.10 over 14s (slower than current 6s — current zoom is too fast and competes with the wipe).
- Add a **vertical caption strip** along the photo's right edge (rotated 90°, label-meta, ink/40): `MERIDIAN TOWER · SGP · 2023` — gallery wall label. Replaces the bottom rail's redundant project name.
- Keep the cursor reticle but make it a **thin ring (16px, no fill)** with a 1px clay center dot, so it reads as a focusing reticle, not a button.

## 3. Typography — one focal headline, one whisper

Current headline is 4 stacked lines all at the same weight — visually monotone. Rebuild as a hierarchy:

```text
                      ┌─ small eyebrow
ARCHITECTURE          ◂ N° XVII · MMXXVI
of                    ◂ display, ink/40, italic Fraunces, smaller (-30%)
TOWER.                ◂ display, ink, bold motion word (the hero word)
                      
                      ─── 64px clay rule
                      Quiet volumes for loud cities.
                      Tokyo · New York · since 2009.
```

- Drop "An / architecture / of / tower." — keep **3 lines only**: `ARCHITECTURE` (sans display, all caps, ink) · `of` (Fraunces italic, ink/40, ~50% size, indented 2ch) · `tower.` (Fraunces italic, clay, full size, the morphing word).
- The contrast between the rigid sans cap line and the soft italic morph is what creates the "designed" feel.
- Replace the morph blur (currently `blur(14px)`) with a **mask-image vertical reveal** — sharper, more architectural. Each new word slides up from below a hairline cut.
- Keep tagline but reduce to **one line** with a leading 64px clay rule — the current 2-line tagline + meta line + "01 — Vol. XVII" eyebrow is 3 redundant beats.

## 4. Color discipline — clay as accent, not decoration

Current uses clay 7+ times in the hero. Reduce to **3 deliberate uses**:
1. The morphing italic word (the hero moment)
2. The 64px tagline rule
3. The pulsing "live" dot in top rail

Remove clay from: corner ticks (delete ticks), vertical column rule (make it `--hairline`), photo counter dot (make it ink), bottom rail dot (make it a hairline `+`).

## 5. Synchronised choreography — one curtain, not ten entrances

Current entrances fire across 13 different `delay` values (0.4 → 1.7s) — feels scattered. Replace with a single **5-beat orchestrated sequence** driven by a parent `staggerChildren` variant on the `<section>`:

```text
beat   t       what                                                 ease
─────  ──────  ──────────────────────────────────────────────────  ─────────
0      0.0s    paper background fade-in from ink (200ms)            linear
1      0.2s    HUD — top rail + bottom rail fade + brackets draw    quint-out
2      0.5s    photo passe-partout opens (clip-path)                expo-in-out
3      0.9s    headline lines reveal, line-by-line 120ms stagger    quint-out
4      1.4s    tagline rule scales + tagline fades                  quint-out
5      1.8s    morph word arrives + Ken Burns starts                expo-out
```

All beats use a shared variants object so they actually feel *cued*, not just delayed. Use `motion.div variants={parent} initial="hidden" animate="visible"` and child variants — replace ad-hoc `initial`/`animate`/`delay` props throughout the file.

## 6. Scroll-out — let the hero exit with intent

Current scroll fade is just `opacity → 0.6 → 0`. Replace with:
- Photo: continues parallax (y: -120) and gains scale (1 → 1.06)
- Headline: y: -40, opacity → 0 *staggered per line bottom-up*
- Background "17" numeral: y: -300 (much faster than foreground = parallax depth)
- Top/bottom rails fade first (faster) so by the time the marquee enters, only the headline/photo are dissolving

This makes the transition into the marquee feel **filmic** instead of "the page scrolled."

## 7. Mobile

At `<md`, the split-stage collapses to a single column:
- Background numeral becomes `28vw`, anchored bottom-right
- Photo full-width, aspect 4/5
- Headline below, sized at `clamp(48px, 14vw, 88px)`
- Vertical caption strip rotates back to horizontal under the photo
- Top rail collapses to `TYO · NYC · N° XVII`

## Files

- `src/components/landing/Hero.tsx` — full rewrite (single file; structure above)
- `src/styles.css` — add `.shadow-print` (inset shadow), `.passe-partout` helper, optional `--ink-08` token

## Tradeoffs

- Reducing the carousel to 3 images and slowing to 8s means less "stuff happening" — that's the point. Galleries breathe.
- Removing the boxed frame + ticks is the biggest visible change; some users like the corner-tick look. If you want them back as a quieter detail, say "keep brackets" and I'll keep just the two diagonal corners but push them to `ink/15`.

## Open question

Default photo set stays as towers (3 of the current 4: Meridian, Halden, Kojima). Reply **"swap photos"** if you want a different mood (interiors / urban plans). Otherwise I proceed with the reduced tower set.
