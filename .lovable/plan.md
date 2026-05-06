# AXIS NOVA — Architecture Landing Page

A fictional commercial & urban architecture studio. Stark monochrome (bone white #F7F5F0, deep black #0A0A0A), ultra-thin sans display + small uppercase labels, gallery-like whitespace. Cinematic scroll: pinned sections, image cross-fades, slow reveals.

## Page structure (single landing route `/`)

```text
[ Fixed top bar ]
  AXIS NOVA            ·            WORKS · STUDIO · INDEX · CONTACT
  (thin hairline divider, black-on-bone, mixes to bone-on-black over dark sections)

[ 1. Hero — pinned, full-viewport ]
  Massive ultra-thin display title cross-fading between three words:
    "STRUCTURE."  →  "SILENCE."  →  "SCALE."
  Beneath: studio descriptor —
    "An architecture & urban practice. Tokyo / New York. Est. 2009."
  Bottom-left meta: N 35.6762° · E 139.6503°  ·  04 / SCROLL
  Bottom-right: a slow vertical marquee of current commissions
  Background: large cinematic vibrant  image of a concrete tower
  fading slowly between 3 frames as the user begins to scroll.

[ 2. Philosophy — editorial pause ]
  Bone background. Left column: small label "01 — APPROACH".
  Right column: a single long sentence set in 48–64px thin serif/sans,
  e.g. "We design buildings that hold their breath — quiet volumes for
  loud cities, where light, mass, and silence do the talking."
  Below: short 3-line paragraph + signature mark of principal architect.

[ 3. Featured project showcase — pinned, cinematic ]
  Sticky section that holds the viewport while three featured projects
  scroll past. Each project = full-bleed B&W photograph on the left
  (cross-fades as you scroll), with text panel on the right:
    Project № 014
    MERIDIAN TOWER
    Office · Singapore · 2024
    42 floors · 78,000 m²  ·  Client: Hesse Capital
    One-paragraph description.
  Featured: Meridian Tower (Singapore) · Halden Exchange (Oslo) ·
            North Quay Masterplan (Rotterdam).
  A thin progress rail on the right edge tracks 01 / 03.

[ 4. Selected works — index ]
  A typographic numbered index, no thumbnails by default:
    014   MERIDIAN TOWER         Singapore        2024   Office
    013   HALDEN EXCHANGE        Oslo             2024   Civic
    012   NORTH QUAY             Rotterdam        2023   Masterplan
    011   KOJIMA OFFICES         Tokyo            2023   Office
    010   ATLAS PAVILION         Lisbon           2022   Cultural
    ...   (12–14 rows)
  Hovering a row reveals a small floating image preview that follows
  the cursor, plus a hairline underline animation on the row.

[ 5. Closing frame ]
  Full-bleed black section. Centered ultra-thin line:
    "Build quietly. Build to last."
  Below: a single CTA — "Begin a commission →" linking to a stub
  contact route, plus minimal footer (studio addresses, two social
  marks, © AXIS NOVA MMXXVI).
```

## Visual system

- Palette: bone `#F7F5F0`, ink `#0A0A0A`, hairline `#0A0A0A / 12%`,
one warm accent `#B8A88A` used only on tiny meta marks.
- Type: a thin geometric sans (Inter/Manrope at weight 200) for display;
small-caps tracking-wide labels at 11–12px for meta.
- Layout: 12-col grid, generous left/right gutters, large vertical
rhythm (160–240px between sections).
- Imagery: high-quality black-and-white architecture photography
(sourced from Unsplash for placeholders).

## Interactions

- Hero word cross-fade on a 4s loop with image cross-fade behind it.
- Pinned featured-projects section using `position: sticky` with
scroll-driven opacity/translate on the image stack and text panel.
- Numbered-index hover preview that follows the cursor, fading in/out.
- Subtle fade-up reveals on section entry (IntersectionObserver).
- Top bar swaps text/background colors when scrolled over dark sections.
- Reduced-motion: disable cross-fades and parallax, keep static frames.
- use GSAP and lenis for animation effect 

## Technical notes

- Single route: replace `src/routes/index.tsx` content; add route-specific
`head()` with title "AXIS NOVA — Architecture & Urban Practice" and
matching og tags.
- Components under `src/components/landing/`: `TopBar`, `Hero`,
`Philosophy`, `FeaturedProjects` (pinned), `WorksIndex`, `ClosingFrame`.
- Add design tokens to `src/styles.css`: override `--background` /
`--foreground` to bone/ink, add `--ink-12` hairline, `--accent-warm`.
- Use Tailwind utilities + a small amount of scoped CSS for the sticky
scroll choreography. No new heavy deps; use existing animations and
IntersectionObserver. Images from Unsplash URLs as placeholders.
- Stub `/contact` route so the CTA link type-checks (simple page with
studio email + addresses).