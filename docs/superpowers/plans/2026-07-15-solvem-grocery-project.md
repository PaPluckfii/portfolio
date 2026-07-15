# Solvem Grocery Project Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Solvem Grocery to the portfolio Apps drawer with accurate production Flutter content and its real branded launcher icon.

**Architecture:** Extend the existing `APPS` data array with one project object and route all glyph rendering through one small `glyphHTML(app)` helper. The helper renders an optional local icon image and preserves the existing letter-glyph markup for every app without an icon.

**Tech Stack:** Plain HTML, CSS, JavaScript, SVG, and Node.js built-in test runner.

## Global Constraints

- Name: `Solvem Grocery`.
- Role: `Independent Product · Flutter & Supabase`.
- Describe the production Flutter product only; do not mention the separate native Compose rebuild.
- Stack chips must be Flutter, Dart, Supabase, PostgreSQL, and Google Sign-In.
- Highlights must communicate four role-based experiences, realtime order operations, and the COD-to-settlement workflow without unverified download, delivery-time, or transaction metrics.
- Use the existing yellow-and-charcoal Solvem launcher artwork from `/Users/apple/AndroidStudioProjects/Grocery app /docs/stitch_grocery_app_ui_overhaul/premium_harvest/solvem_launcher_icon.svg` as a local asset under `assets/solvem/`.
- Existing apps must retain their current letter glyphs without data changes.
- The JavaScript detail view, app drawer, and no-JavaScript fallback must all use the same icon-rendering path.
- Do not add screenshots, a website CTA, a component abstraction, or a dependency.

---

### Task 1: Add the Solvem project and optional branded icon rendering

**Files:**
- Create: `assets/solvem/icon.svg`
- Create: `tests/solvem-project.test.js`
- Modify: `app.js` in the `APPS` array and app-icon rendering section
- Modify: `style.css` beside the existing `.glyph` rules

**Interfaces:**
- Consumes: existing `APPS` objects with `letter: string` and `color: string`.
- Produces: optional `icon: string` on an app object and `glyphHTML(app): string`, used by `detailHTML` and the drawer button renderer. Apps without `icon` receive the unchanged letter-glyph markup.

- [ ] **Step 1: Write the failing source-contract tests**

Create `tests/solvem-project.test.js`:

```js
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

test("defines the approved Solvem Grocery portfolio content", () => {
  assert.match(appJs, /id: "solvem", name: "Solvem Grocery"/);
  assert.match(appJs, /role: "Independent Product · Flutter & Supabase"/);
  assert.match(appJs, /icon: "assets\/solvem\/icon\.svg"/);
  assert.match(appJs, /stack: \["Flutter", "Dart", "Supabase", "PostgreSQL", "Google Sign-In"\]/);
  assert.match(appJs, /metrics: \[\["4", "role-based experiences"\], \["Realtime", "order operations"\], \["COD", "settlement flow"\]\]/);
});

test("uses one optional icon renderer while preserving letter glyphs", () => {
  assert.match(appJs, /function glyphHTML\(app\)/);
  assert.match(appJs, /if \(!app\.icon\) return `<span class="glyph" style="background:\$\{app\.color\}">\$\{app\.letter\}<\/span>`/);
  assert.equal((appJs.match(/glyphHTML\(app\)/g) || []).length, 3);
  assert.match(css, /\.glyph-image\s*\{/);
  assert.match(css, /\.glyph-image img\s*\{/);
});

test("stores the Solvem icon locally", () => {
  assert.equal(fs.existsSync(path.join(root, "assets", "solvem", "icon.svg")), true);
});
```

- [ ] **Step 2: Run the tests and verify the RED state**

Run:

```bash
node --test tests/solvem-project.test.js
```

Expected: all three tests fail because the Solvem object, `glyphHTML`, icon CSS, and local SVG do not exist.

- [ ] **Step 3: Add the local Solvem launcher asset**

Create `assets/solvem/icon.svg` with the approved artwork:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-label="Solvem launcher icon">
  <rect width="1024" height="1024" rx="224" fill="#191c1d"/>
  <rect x="86" y="86" width="852" height="852" rx="188" fill="#2e3132" opacity="0.34"/>
  <rect x="86" y="86" width="852" height="852" rx="188" fill="none" stroke="#807660" stroke-width="14" opacity="0.78"/>
  <g opacity="0.22" stroke="#d1c5ab" stroke-width="4" fill="none">
    <path d="M228 512H796"/><path d="M512 228V796"/><path d="M282 282L742 742"/><path d="M742 282L282 742"/>
  </g>
  <g fill="#f5c400">
    <path d="M351 328H657V263L810 412L657 561V496H408L324 412Z"/>
    <path d="M408 496H569L700 625L618 708L487 579H326Z" fill="#f1c100"/>
    <path d="M326 708H618L700 625L785 708L661 832H242Z"/>
    <path d="M324 412L408 328H505L421 412L505 496H408Z" fill="#ffe08b" opacity="0.52"/>
    <path d="M569 496H657L700 625L618 708L618 581Z" fill="#006d3a" opacity="0.3"/>
  </g>
  <g fill="#f5c400" opacity="0.82">
    <rect x="214" y="505" width="74" height="16" rx="8"/><rect x="302" y="505" width="70" height="16" rx="8"/>
    <rect x="166" y="568" width="118" height="16" rx="8"/><rect x="302" y="568" width="86" height="16" rx="8"/>
    <rect x="236" y="631" width="126" height="16" rx="8"/>
  </g>
</svg>
```

- [ ] **Step 4: Add the Solvem app data**

Append this object to `APPS` after the IFSTA Suite object:

```js
  {
    id: "solvem", name: "Solvem Grocery", letter: "S", color: "#f5c400",
    icon: "assets/solvem/icon.svg",
    role: "Independent Product · Flutter & Supabase", store: null,
    desc: "An end-to-end grocery operations platform connecting customer ordering, store administration, delivery workflows, and platform oversight through role-based realtime data.",
    stack: ["Flutter", "Dart", "Supabase", "PostgreSQL", "Google Sign-In"],
    metrics: [["4", "role-based experiences"], ["Realtime", "order operations"], ["COD", "settlement flow"]],
  },
```

- [ ] **Step 5: Route all existing glyph call sites through one optional-image helper**

Add this helper immediately above `detailHTML(app)`:

```js
function glyphHTML(app) {
  if (!app.icon) return `<span class="glyph" style="background:${app.color}">${app.letter}</span>`;
  return `<span class="glyph glyph-image"><img src="${app.icon}" alt="${app.name} app icon"></span>`;
}
```

Replace the glyph markup in `detailHTML(app)` with:

```js
      ${glyphHTML(app)}
```

Replace the drawer button assignment with:

```js
  btn.innerHTML = `${glyphHTML(app)}${app.name}`;
```

The existing no-JavaScript fallback already calls `detailHTML(a)`, so it receives the same icon behavior without another rendering path.

- [ ] **Step 6: Style image glyphs without changing letter glyphs**

Add beside the shared glyph rules in `style.css`:

```css
.glyph-image { overflow: hidden; border-radius: 14px !important; background: none !important; }
.glyph-image img { width: 100%; height: 100%; display: block; object-fit: cover; }
```

- [ ] **Step 7: Run focused and syntax verification**

Run:

```bash
node --test tests/solvem-project.test.js
node --check app.js
```

Expected: three tests pass, and `node --check` exits successfully with no output.

- [ ] **Step 8: Verify the rendered static site at desktop and narrow-phone widths**

Run a local server:

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000`, then verify:

- the drawer contains Solvem Grocery with the yellow-and-charcoal icon;
- selecting it shows the approved role, description, highlights, and stack;
- existing app drawer items still use letter glyphs;
- at a narrow viewport near 360px, the new item and detail card do not clip or overflow;
- with JavaScript disabled, the fallback contains the Solvem content and icon.

Stop the local server after verification.

- [ ] **Step 9: Commit the implementation**

```bash
git add app.js style.css assets/solvem/icon.svg tests/solvem-project.test.js
git commit -m "feat: add Solvem Grocery project"
```
