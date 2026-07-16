# Collage scatter-in + velocity-skew — design

Approved 2026-07-17. Replaces the collage's fade-up entrance and augments its scroll drift.

## Context

`#collage` (projects section) renders ~25 portrait screenshots in 4 masonry columns.
Today: per-image fade-up (`translateY(28px) scale(.96)` → none) via IntersectionObserver,
plus per-column vertical drift lerped in a rAF loop (`app.js` collage block). Feels static.

Research: Refero references + two web-research passes. Chosen patterns:
Codrops "Polaroid Stack to Grid" (scatter → sort) and scroll-velocity skew
(bram.us / GSAP skew-on-scroll pattern, implemented vanilla).

## 1. Scatter entrance

- Keep the existing per-image IntersectionObserver `.in` trigger and stagger delay.
- Entry state becomes `translate(var(--sx), var(--sy)) rotate(var(--sr)) scale(1.05)`
  (was `translateY(28px) scale(.96)`); transition transform/opacity only,
  easing `cubic-bezier(.16,1,.3,1)`, ~0.9s.
- `--sx/--sy/--sr` set per image in JS, deterministic from index
  (sin/cos of scaled index, no `Math.random`) so loads are stable and testable.
- Per-image (not whole-wall one-shot): wall is taller than the viewport; each image
  flies into place as it enters. Preserves lazy loading.
- Reduced motion: existing `body.js .collage img` override keeps images visible with
  no transform; must still win with the new vars.

## 2. Velocity skew

- Extend the existing rAF `step()`: track `scrollY` delta per frame, smooth it
  (`vel += (dy - vel) * 0.12`), clamp resulting skew to ±6deg, and apply `skewY`
  in the same transform string as the column drift `translateY`.
- Loop settles only when drift lerp is settled AND |vel| below threshold; final
  write ends at `skewY(0)` so columns rest upright.
- Same reduced-motion guard as today (whole animation block skipped).

## Scope

- `app.js`: collage block only (~15 lines).
- `style.css`: `.collage` entry rules only (~10 lines).
- New `tests/collage-motion.test.js` (node:test, source-content assertions, matching
  existing test conventions): scatter vars + rotate in entry CSS; deterministic seed
  in JS (no Math.random in collage block); skewY present in transform write with clamp;
  reduced-motion overrides intact.

No new files besides the test, no libraries.
