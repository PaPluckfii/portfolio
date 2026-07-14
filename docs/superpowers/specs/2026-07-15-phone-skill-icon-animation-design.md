# Phone Skill Icon Animation — Design

Date: 2026-07-15

## Goal

Replace the static text-chip cloud on the phone's Skills screen with a compact,
animated icon grid. Preserve the complete skill inventory and make the phone
feel active without changing the full-size skill cards beside it.

## Scope

### In scope

- The phone screen identified by `.pscreen[data-screen="skills"]`.
- All 18 skills currently shown in that phone screen.
- Local SVG marks for technologies with recognizable logos.
- Branded monogram tiles for concepts without an official logo.
- CSS-only floating and rotating-spotlight motion.
- Static, readable reduced-motion behavior.

### Out of scope

- The full-size skill groups in `#skills`.
- Changes to the phone's section-sync or crossfade behavior.
- New JavaScript, animation libraries, icon packages, or runtime CDN requests.
- New skills, reordered portfolio sections, or unrelated visual refactoring.

## Visual Structure

The current `.pchips` cloud becomes a three-column grid of 18 skill tiles. Each
tile contains:

1. A rounded icon surface.
2. A decorative local SVG logo when a recognizable mark exists.
3. A short text monogram retained beneath the decorative background so the tile
   remains identifiable if the asset is unavailable.
4. A concise visible skill label below the icon surface.

Use local recognizable SVG marks for Kotlin, Java, Jetpack Compose, Compose
Multiplatform, KMM, Ktor, SQLDelight, and Firebase. Compose Multiplatform may
reuse the Compose mark, and KMM may reuse the Kotlin mark. Use visually
consistent monogram icons for MVVM, MVI, Clean Architecture, Multi-module,
Room, Retrofit, Hilt / Koin, Coroutines, MCP, and Agentic Workflows. The visible
labels must remain distinct even when related skills share a mark.

The grid must preserve this existing inventory:

- Kotlin
- Java
- Jetpack Compose
- Compose Multiplatform
- KMM
- Ktor
- MVVM
- MVI
- Clean Architecture
- Multi-module
- Room
- SQLDelight
- Retrofit
- Hilt / Koin
- Coroutines
- Firebase
- MCP
- Agentic Workflows

## Motion

Every tile uses the same gentle vertical float keyframe with staggered negative
delays, creating unsynchronized movement as soon as the Skills screen becomes
visible. The motion must stay within each tile's layout footprint so it does not
change grid measurements or cause phone-screen overflow.

Labels participate in a repeating spotlight cycle. Small groups brighten in
sequence while the remaining labels stay visible at reduced emphasis. The cycle
must not hide labels, require interaction, or prevent the user from identifying
any skill.

No JavaScript controls either loop. Existing phone-screen crossfades continue to
control whether the Skills screen is visible.

## Responsive Behavior

The standard desktop phone uses three columns. Existing narrow-phone media rules
may reduce tile, gap, logo, and label sizes, but must retain three columns and all
18 items without horizontal scrolling. The phone screen remains clipped by its
existing rounded frame.

## Accessibility and Fallbacks

- Visible labels carry the semantic skill names.
- Decorative SVG marks are not announced separately by assistive technology.
- The text monogram remains visible when a decorative background image is absent.
- `prefers-reduced-motion: reduce` disables floating and spotlight animations.
- In reduced-motion mode, all labels use equal, fully readable emphasis.
- Color contrast must remain readable against the existing teal phone wallpaper.

## Files

- `index.html`: replace only the phone Skills screen's `.pchips` markup with the
  semantic 18-tile grid.
- `style.css`: add the grid, icon surfaces, float animation, spotlight sequence,
  narrow-phone sizing, and reduced-motion overrides.
- `assets/skills/`: store compact local SVG logo assets.
- `app.js`: no change.

## Verification

1. Open `#skills` at a desktop viewport and confirm the phone shows all 18 tiles
   in a floating three-column grid.
2. Confirm spotlight emphasis cycles through labels without hiding any label.
3. Scroll between page sections and confirm existing phone-screen crossfades and
   project drawer behavior remain unchanged.
4. Test the narrow-phone media query and confirm no horizontal overflow, clipped
   labels, or unreachable skills.
5. Temporarily remove one decorative logo reference and confirm the monogram
   remains useful without a broken-image indicator.
6. Enable reduced motion and confirm the grid is static and every label has equal
   emphasis.
