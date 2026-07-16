# Phone Project Bottom Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the left-side live project card with the existing mixed screenshot collage and open each project's details in a dismissible bottom sheet inside the phone.

**Architecture:** Keep `APPS`, `glyphHTML()`, and `detailHTML()` as the single project model and renderer. Add one hidden sheet layer inside `.phone-screen`; both drawer icons and screenshot buttons call `showApp(app, trigger)`, while one `closeProjectSheet()` handles all dismissal paths and focus restoration.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Work on the existing `main` branch because the user explicitly approved it.
- Preserve all pre-existing uncommitted SkoolOS asset, `app.js`, and test changes; stage only bottom-sheet feature hunks.
- Reuse `APPS`, `glyphHTML()`, and `detailHTML()` as the only project data and rendering path.
- Preserve the existing interleaved screenshot ordering, four-column layout, image reveal, and column drift.
- Keep the generated no-JavaScript project fallback readable and hidden only during normal JavaScript operation.
- Support close button, backdrop, Escape key, and downward swipe dismissal.
- Restore focus to the drawer icon or screenshot that opened the sheet.
- Add no dependency, gesture framework, second project model, screenshot filtering, grouping, or lightbox.
- Projects without screenshots must remain accessible through drawer icons.

---

### Task 1: Add the in-phone sheet shell and remove the left live card

**Files:**
- Create: `tests/project-bottom-sheet.test.js`
- Modify: `index.html:38-43,179-184`
- Modify: `style.css:102-129,278-360`

**Interfaces:**
- Consumes: existing `.phone-screen`, `#drawer`, `.app-detail`, and `detailHTML()` output classes.
- Produces: `#project-sheet-layer`, `#project-sheet-backdrop`, `#project-sheet`, `#project-sheet-close`, and `#project-sheet-content` for Task 2.

- [ ] **Step 1: Write the failing structural and style tests**

Create `tests/project-bottom-sheet.test.js`:

```js
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

test("Apps starts with screenshots instead of a live page detail card", () => {
  const projects = html.match(/<section class="section" id="projects">([\s\S]*?)<section class="section" id="skills">/)?.[1] ?? "";
  assert.doesNotMatch(projects, /id="app-detail"/);
  assert.match(projects, /id="projects-fallback"[\s\S]*id="collage"/);
});

test("phone contains one accessible project bottom sheet", () => {
  assert.match(html, /id="project-sheet-layer"[^>]*hidden/);
  assert.match(html, /id="project-sheet-backdrop"[^>]*aria-label="Close project details"/);
  assert.match(html, /id="project-sheet"[^>]*role="dialog"[^>]*aria-modal="true"/);
  assert.match(html, /id="project-sheet-close"[^>]*aria-label="Close project details"/);
  assert.match(html, /id="project-sheet-content"[^>]*class="project-sheet-content project-detail"/);
});

test("sheet stays inside the phone and supports scroll and reduced motion", () => {
  assert.match(css, /\.project-sheet-layer\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*z-index:\s*5;/s);
  assert.match(css, /\.project-sheet\s*\{[^}]*max-height:\s*82%;[^}]*transform:\s*translateY\(100%\);/s);
  assert.match(css, /\.project-sheet-content\s*\{[^}]*overflow-y:\s*auto;/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.project-sheet/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/project-bottom-sheet.test.js`

Expected: FAIL because `#app-detail` still exists and the sheet markup/CSS do not.

- [ ] **Step 3: Replace the left live card with the existing fallback and collage**

In `index.html`, remove only:

```html
<div class="app-detail" id="app-detail" hidden></div>
```

Keep `#projects-fallback` before `#collage` so no-JavaScript project content remains available.

- [ ] **Step 4: Add the hidden project sheet after the drawer inside `.phone-screen`**

Insert immediately after `#drawer` and before the closing `.phone-screen` tag:

```html
<div class="project-sheet-layer" id="project-sheet-layer" hidden>
  <button class="project-sheet-backdrop" id="project-sheet-backdrop" type="button" aria-label="Close project details"></button>
  <section class="project-sheet" id="project-sheet" role="dialog" aria-modal="true" aria-label="Project details">
    <div class="project-sheet-handle" aria-hidden="true"></div>
    <button class="project-sheet-close" id="project-sheet-close" type="button" aria-label="Close project details">×</button>
    <div class="project-sheet-content project-detail" id="project-sheet-content"></div>
  </section>
</div>
```

- [ ] **Step 5: Replace obsolete active-card styling with shared detail and sheet styling**

Delete the `@property --ga`, `#app-detail`, `#app-detail::before`, and `@keyframes glowspin` rules. Remove `#app-detail::before` from reduced-motion rules. Retain `.app-detail` as the fallback card shell, but rename its descendant selectors to `.project-detail` so both the fallback and sheet use the same rendered content styles:

```css
.project-detail .detail-head { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.project-detail .glyph {
  width: 56px; height: 56px; border-radius: 28px; flex-shrink: 0;
  display: grid; place-items: center; font-size: 24px; font-weight: 600; color: #0a1f14;
}
.project-detail h3 { font-size: 24px; }
.project-detail .detail-role { color: var(--accent); font-size: 14px; }
.project-detail p { color: var(--muted); margin-bottom: 16px; }
.project-detail .metrics { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 16px; }
.project-detail .metric b { display: block; font-size: 22px; color: var(--text); }
.project-detail .metric span { font-size: 13px; color: var(--muted); }

.project-sheet-layer {
  position: absolute; inset: 0; z-index: 5; display: grid; align-items: end;
  border-radius: 32px; overflow: hidden;
}
.project-sheet-layer[hidden] { display: none; }
.project-sheet-backdrop {
  position: absolute; inset: 0; border: 0; background: #0008; opacity: 0;
  transition: opacity .3s ease;
}
.project-sheet {
  position: relative; z-index: 1; max-height: 82%; display: flex; flex-direction: column;
  background: #202020; border-radius: 24px 24px 0 0;
  transform: translateY(100%); transition: transform .3s cubic-bezier(.2, .9, .3, 1);
  box-shadow: 0 -16px 36px #0008;
}
.project-sheet-layer.open .project-sheet { transform: translateY(0); }
.project-sheet-layer.open .project-sheet-backdrop { opacity: 1; }
.project-sheet.dragging { transition: none; }
.project-sheet-handle { width: 36px; height: 4px; margin: 8px auto 0; border-radius: 4px; background: #fff5; }
.project-sheet-close {
  position: absolute; top: 10px; right: 12px; z-index: 1; width: 28px; height: 28px;
  border: 0; border-radius: 50%; background: #ffffff14; color: #fff; font-size: 20px; cursor: pointer;
}
.project-sheet-content { overflow-y: auto; overscroll-behavior: contain; padding: 24px 20px 22px; }
.project-sheet-content .detail-head { padding-right: 28px; }
.project-sheet-content .glyph { width: 44px; height: 44px; }
.project-sheet-content h3 { font-size: 20px; }
.project-sheet-content p { font-size: 12px; line-height: 1.5; }
.project-sheet-content .metrics { gap: 12px; }
.project-sheet-content .metric b { font-size: 16px; }
.project-sheet-content .metric span { font-size: 10px; }
.project-sheet-content .chips { gap: 6px; }
.project-sheet-content .chips span { padding: 5px 8px; font-size: 9px; }
```

Add to the existing reduced-motion block:

```css
.project-sheet, .project-sheet-backdrop { transition: none; }
```

Change the generated fallback wrapper in `app.js` from `class="app-detail"` to `class="app-detail project-detail"` so it retains its existing appearance through the shared descendant rules.

- [ ] **Step 6: Run the focused test and full suite**

Run: `node --test tests/project-bottom-sheet.test.js`

Expected: 3 tests PASS.

Run: `node --test tests/*.js tests/*.mjs`

Expected: all tests PASS with no warnings.

- [ ] **Step 7: Commit only Task 1 files and the specific fallback-class hunk**

Stage `index.html`, `style.css`, and `tests/project-bottom-sheet.test.js`. Stage only the `projects-fallback` class-name hunk from `app.js`; do not stage the pre-existing SkoolOS screenshot-array hunk. Verify with `git diff --cached`, then commit:

```bash
git commit -m "feat: add phone project sheet shell"
```

### Task 2: Route icons and screenshots through the sheet and add dismissal behavior

**Files:**
- Modify: `app.js:103-166,215-228`
- Modify: `style.css:295-318`
- Modify: `tests/project-bottom-sheet.test.js`

**Interfaces:**
- Consumes: Task 1's `#project-sheet-layer`, `#project-sheet`, `#project-sheet-close`, `#project-sheet-backdrop`, and `#project-sheet-content` elements.
- Produces: `showApp(app, trigger)`, `closeProjectSheet({ restoreFocus })`, app-aware `.collage-shot` buttons, and all four dismissal paths.

- [ ] **Step 1: Extend the regression test for shared routing and dismissal hooks**

Append to `tests/project-bottom-sheet.test.js`:

```js
test("drawer icons and screenshots route project identity to the same sheet", () => {
  assert.match(appJs, /btn\.addEventListener\("click", \(\) => showApp\(app, btn\)\)/);
  assert.match(appJs, /class="collage-shot" data-app-id="\$\{a\.id\}"/);
  assert.match(appJs, /collage\.addEventListener\("click", \(event\) =>/);
  assert.match(appJs, /showApp\(APPS\.find\(\(app\) => app\.id === button\.dataset\.appId\), button\)/);
  assert.match(appJs, /sheetContent\.innerHTML = detailHTML\(app\)/);
});

test("one close function owns every dismissal path and focus restoration", () => {
  assert.match(appJs, /function closeProjectSheet\(\{ restoreFocus = true \} = \{\}\)/);
  assert.match(appJs, /sheetClose\.addEventListener\("click", closeProjectSheet\)/);
  assert.match(appJs, /sheetBackdrop\.addEventListener\("click", closeProjectSheet\)/);
  assert.match(appJs, /event\.key === "Escape".*closeProjectSheet\(\)/s);
  assert.match(appJs, /dragDistance > 72.*closeProjectSheet\(\)/s);
  assert.match(appJs, /sheetTrigger\?\.focus\(\)/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/project-bottom-sheet.test.js`

Expected: the first three Task 1 tests PASS and the two new interaction tests FAIL.

- [ ] **Step 3: Replace the page-detail `showApp` flow with the phone sheet flow**

Replace `const detail = $("#app-detail")`, the old `showApp(app, scroll)` implementation, drawer click wiring, and default `showApp(APPS[0])` call with:

```js
const sheetLayer = $("#project-sheet-layer");
const sheet = $("#project-sheet");
const sheetContent = $("#project-sheet-content");
const sheetClose = $("#project-sheet-close");
const sheetBackdrop = $("#project-sheet-backdrop");
let sheetTrigger = null;
let sheetCloseTimer = 0;

function showApp(app, trigger) {
  if (!app) return;
  clearTimeout(sheetCloseTimer);
  sheetTrigger = trigger ?? document.activeElement;
  sheetContent.innerHTML = detailHTML(app);
  sheet.setAttribute("aria-label", `${app.name} project details`);
  sheetLayer.hidden = false;
  requestAnimationFrame(() => sheetLayer.classList.add("open"));
  sheetClose.focus();
}

function closeProjectSheet({ restoreFocus = true } = {}) {
  if (sheetLayer.hidden) return;
  sheetLayer.classList.remove("open");
  sheet.classList.remove("dragging");
  sheet.style.transform = "";
  sheetCloseTimer = setTimeout(() => { sheetLayer.hidden = true; }, 300);
  if (restoreFocus) sheetTrigger?.focus();
}

for (const app of APPS) {
  const btn = document.createElement("button");
  btn.className = "app-icon";
  btn.innerHTML = `${glyphHTML(app)}${app.name}`;
  btn.addEventListener("click", () => showApp(app, btn));
  grid.appendChild(btn);
}
```

Keep `#projects-fallback` generation unchanged apart from Task 1's `project-detail` class.

- [ ] **Step 4: Render semantic app-aware screenshot buttons and preserve collage behavior**

Change only screenshot HTML creation to:

```js
imgs.push(`
  <button class="collage-shot" data-app-id="${a.id}" type="button" aria-label="Open ${a.name} project details">
    <img src="assets/${a.id}/${a.screenshots[i]}" alt="${a.name} app screen" loading="lazy">
  </button>`);
```

After populating the four columns, add one delegated handler:

```js
collage.addEventListener("click", (event) => {
  const button = event.target.closest(".collage-shot");
  if (!button) return;
  showApp(APPS.find((app) => app.id === button.dataset.appId), button);
});
```

Update the collage selectors that currently target direct `img` children so crop ratios apply to `.collage-shot` and reveal styles continue to apply to its `img`. Add:

```css
.collage-shot { padding: 0; border: 0; border-radius: 18px; background: none; cursor: pointer; }
.collage-shot:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.collage-shot:nth-child(3n) img { aspect-ratio: 9 / 16; }
.collage-shot:nth-child(3n + 1) img { aspect-ratio: 925 / 2048; }
.collage-shot:nth-child(3n + 2) img { aspect-ratio: 9 / 17; }
```

Remove the old `.collage-col img:nth-child(...)` rules.

- [ ] **Step 5: Add close, Escape, and swipe-down behavior**

Add after the collage block:

```js
sheetClose.addEventListener("click", closeProjectSheet);
sheetBackdrop.addEventListener("click", closeProjectSheet);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !sheetLayer.hidden) closeProjectSheet();
});

let dragStartY = 0;
let dragDistance = 0;
sheet.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || sheetContent.scrollTop > 0) return;
  dragStartY = event.clientY;
  dragDistance = 0;
  sheet.setPointerCapture(event.pointerId);
});
sheet.addEventListener("pointermove", (event) => {
  if (!sheet.hasPointerCapture(event.pointerId)) return;
  dragDistance = Math.max(0, event.clientY - dragStartY);
  if (!dragDistance) return;
  sheet.classList.add("dragging");
  sheet.style.transform = `translateY(${dragDistance}px)`;
});
sheet.addEventListener("pointerup", (event) => {
  if (!sheet.hasPointerCapture(event.pointerId)) return;
  sheet.releasePointerCapture(event.pointerId);
  if (dragDistance > 72) closeProjectSheet();
  else {
    sheet.classList.remove("dragging");
    sheet.style.transform = "";
  }
});
```

In `setScreen(name)`, close the sheet without moving focus when leaving Projects:

```js
if (!projectsOpen) closeProjectSheet({ restoreFocus: false });
```

- [ ] **Step 6: Run focused and full automated verification**

Run: `node --test tests/project-bottom-sheet.test.js`

Expected: 5 tests PASS.

Run: `node --test tests/*.js tests/*.mjs`

Expected: all tests PASS with no warnings.

- [ ] **Step 7: Verify behavior in the live browser**

Open `http://localhost:8000/#projects` and verify:

1. The left Apps area begins with the mixed screenshots and has no live detail card.
2. Each tested drawer icon opens the correct sheet inside the phone.
3. Screenshots from at least two different projects open their matching sheets.
4. Long sheet content scrolls inside the phone.
5. Close button, backdrop, Escape, and a downward swipe each dismiss and reveal the drawer.
6. Keyboard focus moves to close and returns to the launching control.
7. Leaving Apps closes the sheet and allows Skills/Experience/Contact phone screens to appear.
8. At a narrow viewport, the sheet remains clipped to the scaled phone.

- [ ] **Step 8: Commit only Task 2 feature hunks**

Stage `style.css` and `tests/project-bottom-sheet.test.js`. Stage only Task 2 bottom-sheet/collage hunks from `app.js`; do not stage the pre-existing SkoolOS screenshot-array hunk. Verify with `git diff --cached`, then commit:

```bash
git commit -m "feat: open project details in phone sheet"
```
