# Projects Phone Drawer Design

## Goal

When the page is on `#projects`, the phone mockup should show the swiped-up app drawer so visitors can see all projects at once.

## Behavior

- The left Projects section keeps the selected project detail card.
- The phone shows the existing app drawer while Projects is the active scroll section.
- Tapping a drawer icon updates the selected project detail and keeps the page on Projects.
- Leaving Projects closes the drawer so Skills, Experience, and Contact can show their current phone screens.

## Implementation Shape

Reuse the existing drawer DOM and `open` class. Do not add a second project grid or new data model.

## Check

Load `/#projects`, confirm the phone shows the drawer grid. Tap a project icon and confirm the left detail changes. Scroll to another section and confirm the drawer closes.
