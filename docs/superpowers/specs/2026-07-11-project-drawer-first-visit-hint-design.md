# Project Drawer First-Visit Hint

## Goal

Help first-time visitors discover that each phone drawer icon selects a different showcased project, without repeating the hint on later visits.

## Design

- Add a compact message inside the open app drawer: `Tap an app to explore a project`.
- When the Apps section first becomes active, show the message only if `localStorage` does not contain the hint-seen flag.
- Record the flag when the hint is shown, then fade and remove the message after a short delay.
- Keep every app icon's current click behavior unchanged.
- If storage is unavailable, fail quietly; the portfolio and project selection must continue working.

## Scope

Use the existing drawer markup, CSS, and section observer. Add no dependency, tooltip framework, onboarding system, or reusable abstraction.

## Verification

1. Clear the hint-seen flag and visit `#projects`: the hint appears and disappears automatically.
2. Reload or revisit `#projects`: the hint does not appear again.
3. Click multiple app icons: each project detail still updates.
