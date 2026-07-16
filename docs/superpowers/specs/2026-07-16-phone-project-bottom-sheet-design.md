# Phone Project Bottom Sheet Design

Date: 2026-07-16. Status: approved.

## Goal

Remove the project detail card from the left side of the Apps section. Show the existing mixed screenshot collage directly, and open the matching project's details in a dismissible bottom sheet inside the phone when a visitor selects either an app icon or one of its screenshots.

## Behavior

- The Apps section contains its heading, supporting copy, and the existing mixed screenshot collage; it no longer shows the live `#app-detail` card.
- Selecting an app icon opens that project's detail sheet inside `.phone-screen`.
- Selecting a screenshot opens the detail sheet for the project that owns that screenshot.
- The sheet contains the existing app icon, name, role, description, metrics, and stack.
- The sheet is internally scrollable when its content exceeds the available phone height.
- Visitors can dismiss it with the close button, backdrop, Escape key, or a downward swipe.
- Dismissing the sheet reveals the app drawer again.
- Projects without screenshots remain accessible through their app drawer icons.

## Implementation Shape

Reuse `APPS`, `glyphHTML()`, and `detailHTML()` as the only project data and rendering path. Add one project-sheet element inside `.phone-screen`, above the existing drawer. Update `showApp()` to populate and open that sheet instead of updating the removed page detail.

Render every collage screenshot inside a semantic button carrying its owning app ID. Preserve the existing interleaved ordering, four-column layout, image reveal, and column drift. Both screenshot buttons and drawer icons resolve an existing `APPS` entry and call the same `showApp()` function.

Use one `closeProjectSheet()` function for every dismissal path. Implement downward swipe dismissal with native pointer events and a small distance threshold. Add no dependency, gesture abstraction, second project model, or separate screenshot-detail renderer.

Keep the generated no-JavaScript project fallback so project information remains readable without JavaScript. The fallback stays hidden during normal JavaScript operation.

## Accessibility and Failure Handling

- Give the sheet dialog semantics and a project-specific accessible label.
- Give every screenshot button an accessible name that identifies the app and screenshot.
- Move focus to the close button when the sheet opens and restore focus to the launching icon or screenshot when it closes.
- Ignore unknown app IDs instead of opening empty content.
- Disable sheet motion when reduced motion is requested.

## Verification

- Add one focused automated regression check proving that drawer icons and screenshot buttons carry project identity and route to the same phone sheet.
- Confirm the Apps section no longer renders the live left-side project card.
- Confirm icon clicks and screenshot clicks open the correct project details.
- Confirm close button, backdrop, Escape, and downward swipe dismiss the sheet and reveal the drawer.
- Confirm long content scrolls inside the phone without escaping its frame.
- Confirm keyboard focus enters and returns correctly.
- Confirm desktop, narrow mobile, and reduced-motion behavior in the browser.

## Out of Scope

Screenshot lightboxes, filtering or grouping the mixed collage, new project data structures, new dependencies, and unrelated phone-screen refactoring.
