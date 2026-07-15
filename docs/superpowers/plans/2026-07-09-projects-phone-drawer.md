# Projects Phone Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the phone mockup's swiped-up app drawer whenever the Projects section is active.

**Architecture:** Reuse the existing drawer DOM, app icon rendering, and `open` class. Keep project detail rendering exactly where it is; only centralize drawer state inside the existing `setScreen(name)` scroll-sync function.

**Tech Stack:** Plain HTML, CSS, JavaScript.

## Global Constraints

- Reuse the existing drawer DOM and `open` class.
- Do not add a second project grid or new data model.
- The left Projects section keeps the selected project detail card.
- Leaving Projects closes the drawer so Skills, Experience, and Contact can show their current phone screens.
- Keep the change in `app.js` unless a browser check proves CSS or markup must change.

---

## File Structure

- Modify: `app.js`
  - Responsibility: section-to-phone sync, drawer open/close state, project detail updates.

No new files, dependencies, or abstractions.

### Task 1: Open Drawer For Projects Section

**Files:**
- Modify: `app.js`
- Test: browser console on `http://localhost:8080/#projects`

**Interfaces:**
- Consumes: existing `drawer` constant from `const drawer = $("#drawer");`
- Consumes: existing `openBtn` constant from `const openBtn = $("#drawer-open");`
- Consumes: existing `setScreen(name: string): void`
- Produces: updated `setScreen(name: string): void` that opens the drawer only for `name === "projects"`

- [ ] **Step 1: Write the browser check before editing**

Open `http://localhost:8080/#projects`, then run this in DevTools:

```javascript
document.getElementById("drawer").classList.contains("open")
```

Expected: `false`, because the current phone shows project app details instead of the swiped-up drawer.

- [ ] **Step 2: Update drawer state in `setScreen`**

Replace the current function:

```javascript
function setScreen(name) {
  document.querySelectorAll(".pscreen").forEach((s) =>
    s.classList.toggle("active", s.dataset.screen === name));
}
```

with:

```javascript
function setScreen(name) {
  document.querySelectorAll(".pscreen").forEach((s) =>
    s.classList.toggle("active", s.dataset.screen === name));
  const projectsOpen = name === "projects";
  drawer.classList.toggle("open", projectsOpen);
  openBtn.setAttribute("aria-expanded", projectsOpen);
}
```

- [ ] **Step 3: Run syntax check**

Run:

```bash
node --check app.js
```

Expected output:

```text
```

Expected exit code: `0`.

- [ ] **Step 4: Verify Projects opens the drawer**

Open `http://localhost:8080/#projects`, then run:

```javascript
document.getElementById("drawer").classList.contains("open")
```

Expected: `true`.

- [ ] **Step 5: Verify leaving Projects closes the drawer**

Click the Skills nav link or visit `http://localhost:8080/#skills`, wait for the scroll position to settle, then run:

```javascript
document.getElementById("drawer").classList.contains("open")
```

Expected: `false`.

- [ ] **Step 6: Verify icon taps still update left detail**

Open `http://localhost:8080/#projects`, click the `Vantero` icon in the phone drawer, then run:

```javascript
document.querySelector("#app-detail h3").textContent
```

Expected:

```text
Vantero
```

- [ ] **Step 7: Commit**

```bash
git add app.js
git commit -m "fix: show app drawer on projects"
```

## Self-Review

- Spec coverage: Task 1 covers showing the drawer on Projects, preserving left detail updates, reusing existing DOM/class, and closing the drawer outside Projects.
- Placeholder scan: no `TBD`, `TODO`, or deferred implementation language.
- Type consistency: `setScreen(name)` remains the only changed interface and keeps the same signature.
