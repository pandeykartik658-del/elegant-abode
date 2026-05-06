## Plan — Restore Hero v5 + targeted refinements

### Step 1 — Restore v5 (you do this)
Open the History panel and revert to the message that implemented **Hero v5 — Drafting Table** (the matted-paper monograph, *before* the v6 Cinematic Atelier dark redesign). This restores `Hero.tsx` and `styles.css` exactly. Do not let me re-create v5 by hand — revert is lossless, manual rewrite isn't.

When you're back on v5, approve this plan and I'll apply the refinements below on top.

---

### Step 2 — Refinements to make v5 genuinely architectural (10/10)

**A. Tighten the composition (less is more)**
- Reduce element count by ~30%. v5 has too many concurrent micro-elements (grid + ticks + compass + numeral + brackets + section line + clocks + plate caption + status dot). The eye can't rest.
- Keep: drafting grid, mat plate, numeral counter, one clock pair, morph word.
- Remove: corner brackets, SECT. A—A′ line, compass rose, status pulse dot. They read as decoration, not architecture.

**B. Real architectural depth (not blend tricks)**
- Mat plate gets a true **double-mat**: outer 12px paper-warm, inner 1px ink hairline, 4px gap, then image. This is how monograph plates are actually printed — instant tactility.
- Add a soft **drop shadow under the plate** (0 30px 60px -20px ink/12%) so it lifts off the page. That's the depth that's missing.
- Image: very subtle warm duotone (sepia 0.06, contrast 1.04) — keeps it photographic, not flat grayscale.

**C. Typography — push to 10/10**
- Swap headline face from Fraunces to **GT Sectra Display** vibe via free alternative: **"Newsreader" Variable** (opsz 144, wght 380) — it has the architectural Roman gravitas Fraunces lacks at display size. Pair with **"JetBrains Mono"** (kept) for metadata.
- Headline: `9.2vw`, `tracking: -0.045em`, `leading: 0.86`, optical-size 144. "of" stays italic, indented 6ch, set at 38% ink.
- Morph word: italic Newsreader (not clay-saturated), ink at 100%, with a **single 1px clay underline** that draws on entry. Color discipline: clay appears once.
- Add a tiny **plate label set in mono small-caps** above headline: `PL.03 · MERIDIAN TOWER · SGP MMXXIII` — letter-spaced 0.18em, ink/45%. This is the architectural caption move.

**D. Grid as structure, not wallpaper**
- Drop grid opacity to 3.5%, but add **two solid 1px ink hairlines** at column 3 and column 9 of the 12-col grid — these become the actual compositional spine the headline and plate align to. Visible structure > invisible noise.
- Add column numbers `01 02 03…` in mono micro at the very top edge, ink/30%. Architectural drawing-sheet move.

**E. Motion — calmer, more deliberate**
- Cut entrance from 12 beats to 5: hairlines draw → plate fades + shadow grows → headline rises → morph + underline → numeral counts.
- Remove the horizontal split-curtain wipe on photo change (too theatrical). Replace with a **slow cross-dissolve + 1.04 scale** over 1.4s. Reads as turning a monograph page.
- Word morph interval: 4.2s (was 3.4). Gives each word room.

**F. Color discipline**
- Clay used in exactly **two places**: the underline beneath the morph word, and the page-progress bar (already global). Nowhere else in the hero.
- Everything else: ink on paper-warm at varied opacities (100, 70, 45, 30). Hierarchy through opacity, not hue.

---

### Files to change (after you revert)
- `src/components/landing/Hero.tsx` — remove brackets/section line/compass/status dot; add double-mat plate, plate caption, column-spine hairlines, column numbers; rework motion to 5 beats; cross-dissolve photos.
- `src/styles.css` — add Newsreader Variable import, `.mat-double` utility, `.plate-shadow` utility, drop unused v5 utilities.
- `package.json` — add `@fontsource-variable/newsreader`.

### What stays untouched
TopBar, Marquee, Philosophy, FeaturedProjects, **Selected Works**, ClosingFrame, Cursor, PageProgress.

---

**Action required from you:** revert to v5 via the History panel above, then reply "approved" and I'll apply Step 2.