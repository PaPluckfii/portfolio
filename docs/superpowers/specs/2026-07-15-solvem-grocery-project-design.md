# Solvem Grocery Project Entry

## Goal

Add Solvem Grocery to the portfolio's Apps category as an independent Flutter and Supabase product, using its real app icon and production Flutter history.

## Content

- Name: `Solvem Grocery`
- Role: `Independent Product · Flutter & Supabase`
- Description: Present the product as an end-to-end grocery operations platform connecting customer ordering, store administration, delivery workflows, and platform oversight through role-based realtime data.
- Stack: Flutter, Dart, Supabase, PostgreSQL, and Google Sign-In.
- Highlights: four role-based experiences, realtime order operations, and the COD-to-settlement workflow.

Do not mention the separate native Compose rebuild or claim unverified download, delivery-time, or transaction metrics.

## App Icon

Copy the existing yellow-and-charcoal Solvem launcher artwork into `assets/solvem/`. Extend the current glyph rendering with one optional icon-image field. Solvem uses the image in the app drawer and project detail; existing projects retain their current letter glyphs without data changes.

## Implementation Boundary

Add one object to the existing `APPS` array, one local icon asset, and the minimum renderer/CSS support for an optional icon image. Do not add screenshots, a website CTA, a component abstraction, or a dependency.

## Behavior and Fallback

The Solvem icon must have meaningful alternative text. If an app has no icon-image field, rendering must continue to use its existing letter and background color. The JavaScript-generated project fallback must render the same Solvem content and icon for SEO and secondary presentation.

## Verification

- Confirm Solvem appears in the app drawer and opens its matching detail card.
- Confirm the icon renders in both locations without distortion.
- Confirm every existing app still renders its letter glyph.
- Confirm the generated project fallback includes Solvem.
- Confirm all site and icon paths remain relative so the static site works on GitHub Pages.
- Check desktop and narrow-phone layouts for clipping or overflow.
