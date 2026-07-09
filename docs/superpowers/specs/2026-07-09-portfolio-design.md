# Portfolio Website — Design Spec (2026-07-09)

## Goal
Personal portfolio for Sumeet Das, Senior Android/KMM developer. Central gimmick: projects shown as apps in an Android phone app drawer, rendered in pure CSS. Modern, animated, minimalist, dark.

## Stack
Vanilla `index.html` + `style.css` + `app.js`. No build step, no dependencies (Google Fonts only). Deploy target: GitHub Pages.

## Visual system (refero: kirschberg.co.nz base)
- Background `#181818`, surfaces `#262626`, text `#fafafa`, muted `#a3a3a3`, hairline borders `#ffffff14`
- Accent: Android green `#3ddc84` — used sparingly (links, active states, phone UI highlights)
- Font: Inter (400/500), large headings ~clamp(32–64px), letter-spacing -0.04em on headings
- Radii: 16px default, 24px surfaces; no drop shadows — tonal separation only
- Section gap ~45–120px, generous whitespace

## Page structure (single page, vertical scroll)
1. **Hero** — name + "Kotlin/Android Developer", short summary line, CSS-drawn phone (right/center). Phone: rounded frame, punch-hole camera, status bar with live JS clock, home screen wallpaper (CSS gradient) with dock.
2. **App drawer (Projects)** — swipe-up affordance / click opens drawer inside the phone: grid of app icons (CSS-styled monogram icons). Tap icon → Android-style scale-up "app launch" → case-study panel beside/below phone with: app name, role, description, stack chips, metrics.
3. **About / Skills** — skill chips grouped (Languages, UI, Architecture, Multiplatform, etc.) styled like Material chips.
4. **Experience** — timeline entries styled like Android notification-shade cards (DVL/Zebpay, Nickelfox: Vantero, Innoviti POS, IFSTA).
5. **Contact / Footer** — email, GitHub (PaPluckfii), LinkedIn, phone.

## Apps in drawer (from resume; data-driven)
Apps live as a JS array `{id, name, iconLetter/color, role, desc, stack[], metrics[]}` — adding a project = adding one object.
- Zebpay (crypto exchange, CMP migration, 70% shared code)
- Vantero (multi-module, Target Zero Bugs, animated features)
- Innoviti POS (enterprise payments)
- IFSTA Essentials 7th Ed (100K+ downloads)
- IFSTA Exam Prep / Audiobooks (13+ app SDK, GitHub Packages)
- Empty "+" slot(s) for future projects

## Animations (all CSS + IntersectionObserver, no libs)
- Scroll-reveal: rows/sections fade + translate-up on enter
- Drawer: slide-up with overshoot ease
- App launch: icon scale-morph to panel (transform-origin from icon position)
- Phone: subtle tilt/parallax on scroll; live clock
- `prefers-reduced-motion` respected

## Error handling / edge cases
- No JS: content still readable (drawer apps also rendered as plain list in page for SEO/no-JS)
- Mobile: phone frame scales down; drawer works via tap
- Accessibility: buttons for icons, focus states, aria-expanded on drawer

## Testing
Manual: open in browser, check drawer open/close, app launch, scroll reveals, mobile viewport, reduced-motion.

## Out of scope (YAGNI)
Frameworks, build tooling, CMS, blog, analytics, 3D, contact form backend.
