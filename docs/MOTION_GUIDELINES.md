# HOUSE OF OTARU — MOTION & PHYSICS GUIDELINES (MOTION_GUIDELINES.MD)
**Document ID:** OTARU-MOT-002  
**Role:** Creative Technologist & Motion Design Director  
**Stack Alignment:** GSAP 3.12 (Scroll & Sequences), Framer Motion 11.15 (UI States & Drawers), Lenis (Inertial Scroll)  
**Standard:** Editorial Luxury Restraint & Physical Textile Weight  

---

## 1. Motion Philosophy: Cinematic Restraint

Luxury is unhurried. Cheap interfaces bounce, shake, spin, and distract. A luxury digital maison moves with **physical weight, quiet friction, and mechanical precision**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE FOUR LAWS OF OTARU MOTION                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. MASS & TEXTILE WEIGHT                                                               │
│    Animations emulate real heavy cloth: heavy denim drape, oiled canvas fold,          │
│    subtle camera dolly pans. No cartoony elastic bounces or springy overshoot.         │
│                                                                                        │
│ 2. NEVER DELAY ACCESS TO CONTENT                                                       │
│    Motion directs attention; it never gates access. Essential product titles, prices,  │
│    and purchase buttons are immediately interactive. No full-page splash loaders.      │
│                                                                                        │
│ 3. NATIVE SCROLL INTEGRITY                                                             │
│    Zero scroll hijacking. The user retains absolute control of vertical scroll velocity.│
│    Lenis smooth scroll synchronizes 1:1 with GSAP ScrollTrigger ticks.                 │
│                                                                                        │
│ 4. STRICT ACCESSIBILITY INVARIANT                                                      │
│    When `prefers-reduced-motion: reduce` is active, all transitions collapse to        │
│    instantaneous 0ms state changes. Content remains 100% visible if JS fails.          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Motion Specifications by Surface

### 2.1 The Campaign Hero Sequence
- **Phase 01 (`0ms - 200ms`)**: Hero background image renders immediately at `scale(1.02)`.
- **Phase 02 (`200ms - 600ms`)**: Vignette and image softly settle from `scale(1.02)` to `scale(1.00)` (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Phase 03 (`300ms - 750ms`)**: Campaign headline and eyebrow fade in with a subtle upward translate:
  ```css
  from: { opacity: 0, transform: 'translateY(16px)' }
  to:   { opacity: 1, transform: 'translateY(0px)' }
  duration: 650ms, ease: cubic-bezier(0.16, 1, 0.3, 1)
  ```
- **Phase 04 (`600ms - 900ms`)**: Primary CTA link and bottom metadata bar fade in calmly.

### 2.2 Typography Motion Rules
- **No Character-by-Character Stagger**: Animating individual letter spans (`use-split-text` on large bodies) causes layout reflow, flashes of unstyled text, and voiceover accessibility errors.
- **Line-by-Line Reveal**: Display titles (H1/H2) may animate by full sentence or line using overflow-hidden masks and a clean `100% → 0%` Y-axis translation.
- **Fail-Safe**: If JavaScript fails or is blocked by privacy extensions, all headings default to `opacity: 1` and `transform: none` via CSS fallback.

### 2.3 Product Card Hover Micro-Interactions
- **Image Crossfade**: On desktop mouse hover, the secondary silhouette study crossfades smoothly over the primary image:
  ```css
  transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  primary: hover:scale(1.02);
  secondary: hover:opacity-100, hover:scale(1.02);
  ```
- **Mobile Touch**: On touch devices, secondary imagery is accessible via horizontal thumbnail tap or swipe; hover is never required to reveal essential details.

### 2.4 Allocation Tray / Cart Drawer
- **Entrance**: Slides from right to left (`translate-x-full → translate-x-0`).
- **Timing**: `400ms cubic-bezier(0.16, 1, 0.3, 1)`.
- **Backdrop**: Matte scrim fades from `opacity-0` to `opacity-60` (`300ms ease-out`).
- **Dismissal**: `Escape` key, click outside, or close button immediately triggers reverse slide (`300ms ease-in`). Focus returns to the opening trigger button.

---

## 3. Banished Motion Anti-Patterns

The following techniques are **strictly prohibited** in the House of Otaru codebase:
1. **Custom Follower Cursors**: Cursor dots, trailing circles, or magnetic cursor halos. (They break native OS cursor precision and create visual lag).
2. **Scroll Hijacking & Full-Page Snap**: Forcing the user to view one section per scroll notch.
3. **Continuous Rotation**: Rotating badges, spinning circular text stamps ("小樽 · ARCHIVE ·").
4. **Parallax Layout Shifts**: Floating background cards moving at disparate speeds that cause jitter on 60Hz and 120Hz displays.
5. **Mandatory Load Screens**: Screen-blocking loading animations with fake percentage counters.

---

## 4. Technical Motion Invariants

```typescript
// Strict prefers-reduced-motion hook utility
export function useMotionPreference() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduceMotion;
}
```

- **GPU Acceleration**: Animate only `transform` and `opacity`. Never animate `top`, `left`, `margin`, `padding`, or `height`.
- **Will-Change Management**: Apply `will-change: transform, opacity` only during active animation sequences and remove immediately upon completion to avoid GPU memory leaks.
- **ScrollTrigger Lifecycle**: Always call `ScrollTrigger.refresh()` after dynamic content or image loading, and kill timelines on component unmount (`useEffect` cleanup return).
