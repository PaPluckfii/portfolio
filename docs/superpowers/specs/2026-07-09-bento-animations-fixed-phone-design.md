# Bento-style Animations + Fixed Phone — Design

Date: 2026-07-09
Files touched: `index.html`, `style.css`, `app.js` (no new deps, no build step)

## Goal

Give the portfolio bento.me-style motion flair, and pin the phone mockup to the
right side of the viewport for the entire desktop scroll, with the phone screen
mirroring the section the user is reading.

## Layout

**Desktop (>860px):**
- Wrap page in a 2-column grid: content column (flexible) + right column (~360px).
- Phone moves out of the hero into a global `<aside class="phone-col">` sibling
  of `<main>`; inside it, the phone is `position: sticky` with a top offset so it
  stays pinned through the whole scroll.
- Hero text stays in the content column and reflows to single-column width.

**Mobile (≤860px):**
- Keep the existing behavior: mini fixed phone widget bottom-right,
  `pointer-events` handling unchanged.

## Two-way phone sync

- An IntersectionObserver watches the page sections and switches the phone's
  visible "screen" with a crossfade.
- Phone screens are absolutely-positioned layers inside `.phone-screen`:

| Page section | Phone screen |
|---|---|
| Hero | Homescreen (clock, date, drawer handle) — existing |
| Apps (#projects) | Mini detail of the currently selected app (icon, name, key metrics) |
| Skills (#skills) | "Skills" app: scrolling chip list |
| Experience (#experience) | Notification shade: the 4 job cards as notifications |
| Contact (#contact) | Contacts app: email / GitHub / LinkedIn rows with real links |

- Existing drawer behavior kept: opening the drawer and tapping an app icon
  scrolls the page to #projects and opens that app's detail panel. Drawer
  overlays whatever synced screen is showing (higher z-index, as today).
- Selecting a different app updates the Apps mini-screen content.

## Animations

1. **Hover lift + tilt** — `.skill-group`, `.notif`, `.app-detail`, contact
   links: `translateY(-8px) rotate(-2deg) scale(1.04)` with shadow, springy
   transition.
2. **Spring stagger entrance** — replace the current `.reveal` fade-up with a
   keyframe that overshoots (spring cubic-bezier). Reuse the existing `--d`
   stagger delays.
3. **Rotating glow border** — conic-gradient border animation on the active
   `.app-detail` card via `@property --a`. Browsers without `@property`
   degrade to a static border (acceptable).
4. **Reduced motion** — all of the above disabled under
   `prefers-reduced-motion: reduce`, matching existing pattern.

## Out of scope (decided)

- Skill chip marquee (cut by user).
- Phone swipe/touch gestures — drawer button covers navigation.
- Floating-overlay phone variant — dedicated column chosen instead.

## Error handling / fallbacks

- No-JS: fallback grid still renders all projects (existing); phone stays on
  homescreen; page remains fully readable single-column-ish content.
- Sync observer failure is cosmetic only — page navigation never depends on it.

## Testing

- Manual: scroll desktop viewport top→bottom, confirm phone pinned and screen
  switches per section; drawer nav still works; resize to ≤860px confirms mini
  widget; toggle reduced-motion confirms animations off.
