# Project Drawer First-Visit Hint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a brief app-selection hint once when a visitor first reaches the Apps section.

**Architecture:** Add one hidden status message to the existing drawer. The existing `setScreen` flow reveals it once, records a `localStorage` flag, and lets a CSS animation fade it before JavaScript hides it.

**Tech Stack:** Plain HTML, CSS, JavaScript, browser `localStorage`

## Global Constraints

- Copy: `Tap an app to explore a project`.
- Do not change existing app-icon selection behavior.
- Storage failures must not break the portfolio.
- Add no dependency, tooltip framework, onboarding system, or reusable abstraction.

---

### Task 1: Add and verify the first-visit hint

**Files:**
- Modify: `index.html:146-149`
- Modify: `style.css:201-218`
- Modify: `app.js:56-62,117-125`

**Interfaces:**
- Consumes: existing `setScreen(name: string): void` and `#drawer` markup.
- Produces: `#project-hint`, `.drawer-hint`, and local-storage key `projectHintSeen`.

- [ ] **Step 1: Verify the behavior is currently absent**

Open `http://localhost:8080/#projects`, then run in the browser console:

```js
console.assert(document.getElementById("project-hint"), "Expected the project hint to exist");
```

Expected: assertion fails because `#project-hint` does not exist.

- [ ] **Step 2: Add the hidden accessible hint markup**

In `index.html`, place the hint between the search label and icon grid:

```html
<div class="drawer-search">Search apps…</div>
<p class="drawer-hint" id="project-hint" role="status" hidden>Tap an app to explore a project</p>
<div class="drawer-grid" id="drawer-grid"></div>
```

- [ ] **Step 3: Add the compact fade animation**

In `style.css`, add:

```css
.drawer-hint {
  margin: -10px 0 16px; color: var(--accent); text-align: center; font-size: 12px;
  animation: hintFade 4s ease forwards;
}
@keyframes hintFade { 0%, 70% { opacity: 1; } 100% { opacity: 0; } }
```

Inside the existing `@media (prefers-reduced-motion: reduce)` block, add:

```css
.drawer-hint { animation: none; }
```

- [ ] **Step 4: Show and remember the hint through the existing screen flow**

After the existing drawer constants in `app.js`, add:

```js
const projectHint = $("#project-hint");
let projectHintShown = false;

function showProjectHint() {
  if (projectHintShown) return;
  projectHintShown = true;
  try {
    if (localStorage.getItem("projectHintSeen")) return;
    localStorage.setItem("projectHintSeen", "1");
  } catch {}
  projectHint.hidden = false;
  setTimeout(() => { projectHint.hidden = true; }, 4_000);
}
```

Then update the end of `setScreen`:

```js
drawer.classList.toggle("open", projectsOpen);
openBtn.setAttribute("aria-expanded", projectsOpen);
if (projectsOpen) showProjectHint();
```

- [ ] **Step 5: Run static checks**

Run:

```bash
node --check app.js
git diff --check
```

Expected: both commands exit successfully with no output.

- [ ] **Step 6: Verify first and repeat visits in the browser**

Run before loading `#projects`:

```js
localStorage.removeItem("projectHintSeen");
```

Reload `http://localhost:8080/#projects`. Expected: the hint appears once, fades, and becomes hidden after four seconds. Reload again. Expected: the hint remains hidden. Click at least two app icons. Expected: the left project detail updates each time.

- [ ] **Step 7: Commit the implementation**

```bash
git add index.html style.css app.js
git commit -m "feat: add first-visit project hint"
```
