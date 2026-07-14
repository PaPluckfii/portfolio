# Experience Employer Hierarchy

## Goal

Make the Experience section communicate two employers instead of four equal entries.

## Structure

- Keep `DVL Systems · Zebpay` as one standalone employer group with its existing dates, role, and summary.
- Add one `Nickelfox` employer group dated `Aug 2021 – Oct 2025`.
- Nest three project subsections inside Nickelfox: Vantero, Innoviti POS, and IFSTA.
- Preserve the existing project copy and metrics; this change only reorganizes hierarchy.

## Presentation

Use the existing notification-card visual language. The two employer groups remain the primary cards; the three Nickelfox projects use a smaller, visually subordinate treatment inside the Nickelfox card. Mirror the same two-level hierarchy in the phone preview.

## Phone Logos

- Show the supplied Zebpay logo beside the `DVL Systems · Zebpay` employer heading in the phone preview.
- Show the supplied Nickelfox logo beside the `Nickelfox` employer heading in the phone preview.
- Store both images locally under `assets/experience/` instead of hotlinking them.
- Treat the logos as decorative because the adjacent headings already name each employer.

## Implementation Boundary

Change only the Experience markup, the minimum CSS needed for nested project rows and phone logos, and the two local logo assets. Reuse existing colors, spacing, typography, reveal behavior, and responsive layout. Add no JavaScript, dependency, or new data abstraction.

## Verification

At desktop and narrow widths, confirm that:

- exactly two primary employer groups are visible;
- Vantero, Innoviti POS, and IFSTA appear inside Nickelfox;
- all existing dates, descriptions, and metrics remain readable;
- the phone preview reflects the same hierarchy without overflow;
- both local employer logos load and remain legible in the phone preview.
