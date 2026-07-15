# Screenshot Collage — Design

Date: 2026-07-12. Status: approved.

## Goal
Replace per-project screenshot carousels with one collage of all screenshots, shown once inside the Apps section. More screenshots will be added later — adding a filename to a project's `screenshots` array must be the only step.

## Design
- **app.js**: `detailHTML` no longer renders a screenshot strip. Auto-scroll timer code deleted. New render step flattens all `APPS[].screenshots` (interleaved across projects so apps mix visually) into `#collage`.
- **index.html**: `<div class="collage reveal" id="collage">` added at bottom of `#projects`.
- **style.css**: `.screenshots` rules replaced by `.collage`: CSS `columns: 160px`, small `column-gap`, images `width:100%`, rounded corners, `object-fit: cover` with cycling `aspect-ratio` (nth-child 9/19, 9/16, 9/17) to give uniform phone shots staggered masonry heights (Visual Electric / Pinterest reference).
- No lightbox, no interaction, no JS animation. Static grid.

## Out of scope
Lightbox, project highlighting, marquee motion, image optimization.
