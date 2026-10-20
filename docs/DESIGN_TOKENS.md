# HOUSE OF OTARU — PRODUCTION DESIGN TOKENS (DESIGN_TOKENS.MD)
**Document ID:** OTARU-TOK-002  
**Implementation Standard:** Strict CSS Custom Properties (`:root`) + Tailwind Configuration  
**Aesthetic Profile:** Tactile Luxury Monochrome with Kuroki Indigo Accent  

---

## 1. Color Palette Tokens

The palette is derived from raw, unbleached textile fibers, vegetable indigo vats, sumi calligraphy ink, and aged deccan limestone.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   OTARU COLOR ARCHITECTURE                                      │
├──────────────────┬─────────────┬─────────────┬──────────────────────────────────────────────────┤
│ Token Name       │ Hex Value   │ HSL Value   │ Semantic Role                                    │
├──────────────────┼─────────────┼─────────────┼──────────────────────────────────────────────────┤
│ `--color-ink`    │ `#111110`   │ 60°, 3%, 6% │ Primary dark surface, master headings, body copy │
│ `--color-paper`  │ `#F5F2EC`   │ 43°, 27%, 94%│ Primary warm light canvas, main backgrounds     │
│ `--color-paper-2`│ `#ECE7DE`   │ 39°, 24%, 90%│ Secondary light surface, cards, drawers, inputs  │
│ `--color-white`  │ `#FFFFFF`   │ 0°, 0%, 100%│ Crisp contrast, image surroundings, badges       │
│ `--color-graphite│ `#353431`   │ 45°, 4%, 20%│ Secondary text, captions, structural dividers    │
│ `--color-stone`  │ `#B6AEA1`   │ 38°, 14%, 67%│ Muted borders, secondary labels, disabled states │
│ `--color-indigo` │ `#1F2A44`   │ 222°, 37%, 20%│ Signature maison accent, primary CTAs, selvedge │
│ `--color-indigo-hover`│ `#293859`│ 221°, 37%, 26%│ Hover state for primary actions               │
│ `--color-indigo-active`│`#161F33`│ 221°, 40%, 14%│ Active/Pressed state for primary actions       │
│ `--color-hairline`│ `rgba(17,17,16,0.12)` │ Structural borders, card outlines (1px solid)   │
│ `--color-hairline-strong`│ `rgba(17,17,16,0.22)` │ Section dividers, table borders (1px)    │
│ `--color-error`  │ `#9E2A2B`   │ 359°, 58%, 39%│ Validation failure, size required, stock alerts │
│ `--color-success`│ `#2D5A27`   │ 113°, 39%, 25%│ Confirmed reservation, verified provenance      │
└──────────────────┴─────────────┴─────────────┴──────────────────────────────────────────────────┘
```

---

## 2. Typography Tokens & Fluid Scale

House of Otaru uses **two primary typographic engines** and one functional monospace:
1. **Display Engine (`--font-display`)**: `Fraunces`, `Shippori Mincho`, serif.
2. **Body & Commerce Engine (`--font-body`)**: `Hanken Grotesk`, system-ui, sans-serif.
3. **Registry & Notations (`--font-mono`)**: `DM Mono`, monospace.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      FLUID TYPE SCALE                                           │
├───────────────┬───────────────────────────────┬──────────────┬───────────────┬──────────────────┤
│ Token Name    │ Fluid Definition              │ Line Height  │ Letter Spacing│ Semantic Purpose │
├───────────────┼───────────────────────────────┼──────────────┼───────────────┼──────────────────┤
│ `--display-xl`│ `clamp(3.0rem, 7.5vw, 6.75rem)`│ 0.98        │ `-0.025em`    │ Campaign Hero H1 │
│ `--display-l` │ `clamp(2.25rem, 5.0vw, 4.25rem)`│ 1.05       │ `-0.020em`    │ Section Headlines│
│ `--display-m` │ `clamp(1.75rem, 3.2vw, 2.75rem)`│ 1.15       │ `-0.015em`    │ Movement Titles  │
│ `--heading-s` │ `clamp(1.25rem, 2.0vw, 1.75rem)`│ 1.25       │ `-0.010em`    │ Product Names    │
│ `--body-l`    │ `1.125rem (18px)`             │ 1.60         │ `0.000em`     │ Editorial Leads  │
│ `--body`      │ `1.000rem (16px)`             │ 1.65         │ `0.000em`     │ Standard Body    │
│ `--body-s`    │ `0.875rem (14px)`             │ 1.55         │ `0.010em`     │ Cart, PDP Details│
│ `--caption`   │ `0.750rem (12px)`             │ 1.40         │ `0.140em`     │ Monospace Kicker │
│ `--micro`     │ `0.6875rem (11px)`            │ 1.30         │ `0.180em`     │ Archival Codes   │
└───────────────┴───────────────────────────────┴──────────────┴───────────────┴──────────────────┘
```

### Typographic Invariants:
- **Max Measure (`--measure`)**: `60ch` for editorial paragraphs; `42ch` for subheads. Never let text span 100% full-width on widescreen displays.
- **`text-wrap: balance`**: Applied automatically on `--display-xl`, `--display-l`, and `--display-m` to eliminate orphan words.
- **Zero Decorative Characters**: No kanji characters used as standalone decorative watermarks unless specifically identifying an authentic Japanese textile provenance (e.g. Tokushima sukumo indigo).

---

## 3. Spacing System (4px Base Architecture)

All spacing follows an unyielding geometric 4px progression:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SPACING SYSTEM                                       │
├────────────┬──────────┬────────────────────────────────────────────────────────────────┤
│ Token Name │ Value    │ Semantic Usage                                                 │
├────────────┼──────────┼────────────────────────────────────────────────────────────────┤
│ `--sp-1`   │ `4px`    │ Micro inline gap, badge padding                                │
│ `--sp-2`   │ `8px`    │ Icon-to-text spacing, compact pill padding                     │
│ `--sp-3`   │ `12px`   │ Form input vertical padding, card tag spacing                  │
│ `--sp-4`   │ `16px`   │ Standard component padding, mobile gutters                     │
│ `--sp-6`   │ `24px`   │ Desktop card internal padding, grid column gaps                │
│ `--sp-8`   │ `32px`   │ Component stack gap, drawer internal margins                   │
│ `--sp-12`  │ `48px`   │ Subsection separation, header clearance                        │
│ `--sp-16`  │ `64px`   │ Section header to grid gap                                     │
│ `--sp-24`  │ `96px`   │ Editorial break padding                                        │
│ `--sp-36`  │ `144px`  │ Major movement division                                        │
│ `--section-pad`│ `clamp(5rem, 10vw, 9rem)` │ Standard homepage section top/bottom padding│
│ `--page-gutter`│ `clamp(1.25rem, 4vw, 3.5rem)`│ Responsive page horizontal margins       │
└────────────┴──────────┴────────────────────────────────────────────────────────────────┘
```

---

## 4. Grid, Layout & Aspect Ratio Rules

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              GRID & VIEWPORT BREAKPOINTS                               │
├─────────────────┬──────────┬─────────┬─────────┬───────────────────────────────────────┤
│ Viewport Tier   │ Width    │ Columns │ Gutter  │ Max Content Width                     │
├─────────────────┼──────────┼─────────┼─────────┼───────────────────────────────────────┤
│ Mobile Portrait │ `360px`  │ 4       │ 16px    │ 100% - (2 * 16px)                     │
│ Mobile Standard │ `390px`  │ 4       │ 16px    │ 100% - (2 * 16px)                     │
│ Tablet Portrait │ `768px`  │ 8       │ 24px    │ 100% - (2 * 24px)                     │
│ Tablet Landscape│ `1024px` │ 12      │ 24px    │ 960px                                 │
│ Desktop Standard│ `1280px` │ 12      │ 32px    │ 1200px                                │
│ Desktop Wide    │ `1440px+`│ 12      │ 40px    │ 1360px (`--grid-max`)                 │
└─────────────────┴──────────┴─────────┴─────────┴───────────────────────────────────────┘
```

### Merchandising Image Aspect Ratios:
- `--ratio-portrait`: `4 / 5` (`0.80`) — **Default for all apparel garments** (Yama Jacket, Kiryū Trouser, Biratori Overshirt).
- `--ratio-tall`: `3 / 4` (`0.75`) — Full-body model silhouettes.
- `--ratio-square`: `1 / 1` (`1.00`) — Accessories (Ōmi Tote, Watch Cap), macro fabric scans.
- `--ratio-campaign`: `16 / 9` (`1.77`) — Desktop campaign landscape banners.
- `--ratio-mobile-hero`: `9 / 16` (`0.56`) — Full-bleed mobile vertical hero.

---

## 5. Component Interaction States

Every interactive element supports six distinct, non-ambiguous states:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                INTERACTION MATRIX                                      │
├───────────┬────────────────────────────┬─────────────────────────────┬─────────────────┤
│ State     │ Primary Button (Indigo)    │ Secondary Button (Outline)  │ Form Input      │
├───────────┼────────────────────────────┼─────────────────────────────┼─────────────────┤
│ Default   │ bg: `#1F2A44`, text: White │ border: 1px hairline, text: Ink│ border: 1px stone│
│ Hover     │ bg: `#293859`, scale: 1.0  │ border: 1px ink, bg: White  │ border: 1px ink │
│ Focus-Vis.│ ring: 2px `#1F2A44` (2px off)│ ring: 2px `#1F2A44`       │ ring: 2px indigo│
│ Active    │ bg: `#161F33`, scale: 0.99 │ bg: `#ECE7DE`               │ border: 1px ink │
│ Disabled  │ opacity: 0.40, cursor: not-allowed │ opacity: 0.40       │ opacity: 0.40   │
│ Loading   │ text: transparent + spinner│ text: transparent + spinner │ bg: `#F5F2EC`   │
└───────────┴────────────────────────────┴─────────────────────────────┴─────────────────┘
```

---

## 6. Motion Tokens

Motion emulates physical textile mass: slow, deliberate, unhurried, with mechanical precision.

```css
:root {
  /* Easings */
  --ease-editorial: cubic-bezier(0.16, 1, 0.3, 1); /* Quintic ease-out */
  --ease-settle:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-mechanical:cubic-bezier(0.4, 0, 0.2, 1);

  /* Durations */
  --dur-instant:    100ms; /* Button presses, micro-toggles */
  --dur-fast:       200ms; /* Dropdown reveals, badge updates */
  --dur-normal:     400ms; /* Drawer slides, accordion expands */
  --dur-slow:       750ms; /* Page transitions, hero reveals */
  --dur-cinematic:  1200ms; /* Hero background slow zoom */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-instant:    0ms;
    --dur-fast:       0ms;
    --dur-normal:     0ms;
    --dur-slow:       0ms;
    --dur-cinematic:  0ms;
  }
}
```
