# Experience Employer Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four flat Experience entries with two employer groups, nest the three Nickelfox projects, and show local Zebpay and Nickelfox logos in the phone preview.

**Architecture:** Keep the static site architecture. Restructure only the Experience HTML in `index.html`, add narrowly scoped presentation rules in `style.css`, and store the two supplied square logos under `assets/experience/`; no JavaScript or dependency is needed.

**Tech Stack:** HTML5, CSS, local JPEG/PNG assets, shell verification

## Global Constraints

- Keep `DVL Systems · Zebpay` as one standalone employer group with its existing dates, role, and summary.
- Add one `Nickelfox` employer group dated `Aug 2021 – Oct 2025` containing Vantero, Innoviti POS, and IFSTA as three project subsections.
- Preserve all existing project copy and metrics.
- Mirror the two-level employer/project hierarchy in the phone preview.
- Show the supplied Zebpay and Nickelfox logos only beside their employer headings in the phone preview.
- Store both images locally under `assets/experience/` and use empty `alt` text because adjacent headings provide the names.
- Reuse existing colors, spacing, typography, reveal behavior, and responsive layout.
- Add no JavaScript, dependency, or data abstraction.
- Preserve unrelated working-tree changes and stage only this task's hunks.

---

### Task 1: Group Experience by employer and add phone logos

**Files:**
- Create: `assets/experience/zebpay-logo.jpg`
- Create: `assets/experience/nickelfox-logo.png`
- Modify: `index.html:58-86`
- Modify: `index.html:127-135`
- Modify: `style.css:64-71`
- Modify: `style.css:176-181`

**Interfaces:**
- Consumes: existing `#experience .notif-stack`, phone `data-screen="experience"`, `.notif`, and `.pnotif` markup and styles
- Produces: `.notif-projects`, `.notif-project`, `.notif-project-head`, `.pnotif-title`, and `.pnotif-project` elements styled only by `style.css`

- [ ] **Step 1: Run the structural checks before implementation**

```bash
test "$(rg -o 'class="notif reveal"' index.html | wc -l | tr -d ' ')" = "2"
rg -q 'class="notif-projects"' index.html
rg -q 'assets/experience/zebpay-logo.jpg' index.html
rg -q 'assets/experience/nickelfox-logo.png' index.html
```

Expected: at least the first command fails because the current page has four primary Experience cards, and the local logo references do not exist.

- [ ] **Step 2: Download the two supplied logos as local assets**

```bash
mkdir -p assets/experience
curl -L --fail --silent --show-error 'https://image-ap1.moengage.com/zebpaymoengage/20240513111704682910X5T2DBAlphachannel70x70whitepngcompzebpaymoengage.png' -o assets/experience/zebpay-logo.jpg
curl -L --fail --silent --show-error 'https://www.nickelfox.com/wp-content/uploads/2024/09/Group-2085652110.png' -o assets/experience/nickelfox-logo.png
file assets/experience/zebpay-logo.jpg assets/experience/nickelfox-logo.png
```

Expected: `zebpay-logo.jpg` is a 70x70 JPEG and `nickelfox-logo.png` is a 512x512 PNG.

- [ ] **Step 3: Replace the main Experience stack with two employer cards**

Keep the existing DVL Systems article unchanged. Replace the three flat Nickelfox articles with this single article:

```html
<article class="notif reveal">
  <div class="notif-head"><span class="notif-app">Nickelfox</span><span class="notif-time">Aug 2021 – Oct 2025</span></div>
  <div class="notif-projects">
    <section class="notif-project">
      <div class="notif-project-head"><h3>Vantero</h3><span>SDE 2 — DM Ventures LLC</span></div>
      <p>Multi-module re-architecture prepping full CMP migration. Led 'Target Zero Bugs' — 90%+ defects
      eliminated via developer-driven testing. Managed a dev team; shipped custom animated features.</p>
    </section>
    <section class="notif-project">
      <div class="notif-project-head"><h3>Innoviti</h3><span>Enterprise Android POS</span></div>
      <p>Secure payment transaction apps for retail clients. Backend integration with Node.js and FreshDesk APIs.</p>
    </section>
    <section class="notif-project">
      <div class="notif-project-head"><h3>IFSTA</h3><span>Oklahoma State University</span></div>
      <p><strong>13+ Android apps, 100K+ downloads.</strong> Flagship Essentials 7th Edition hit 100K+ Play Store
      downloads. Multi-module SDK via GitHub Packages cut dev time 70% across 13+ projects. Led a cross-functional team.</p>
    </section>
  </div>
</article>
```

- [ ] **Step 4: Replace the phone Experience notifications with two employer cards**

```html
<div class="pnotif">
  <div class="pnotif-title"><img src="assets/experience/zebpay-logo.jpg" alt="" width="28" height="28"><b>DVL Systems · Zebpay</b></div>
  <span>SDE 2 — KMM → CMP migration, 70%+ shared code</span>
</div>
<div class="pnotif">
  <div class="pnotif-title"><img src="assets/experience/nickelfox-logo.png" alt="" width="28" height="28"><b>Nickelfox</b></div>
  <div class="pnotif-project"><b>Vantero</b><span>SDE 2 — multi-module re-architecture, 90%+ defects cut</span></div>
  <div class="pnotif-project"><b>Innoviti</b><span>Enterprise Android POS apps</span></div>
  <div class="pnotif-project"><b>IFSTA</b><span>13+ apps, 100K+ downloads</span></div>
</div>
```

- [ ] **Step 5: Add the minimum hierarchy and logo styles**

Add after the existing `.notif p` rule:

```css
.notif-projects { display: grid; gap: 16px; }
.notif-project { border-top: 1px solid var(--border); padding-top: 16px; }
.notif-project-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; margin-bottom: 6px; }
.notif-project-head h3 { margin: 0; }
.notif-project-head span { color: var(--muted); font-size: 13px; text-align: right; }
.notif-project strong { color: var(--text); }
```

Add after the existing `.pnotif span` rule:

```css
.pnotif-title { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.pnotif-title img { width: 28px; height: 28px; object-fit: contain; border-radius: 7px; flex: 0 0 auto; }
.pnotif-project { border-top: 1px solid #ffffff1f; padding-top: 6px; margin-top: 4px; display: flex; flex-direction: column; gap: 1px; }
.pnotif-project b { font-size: 11px; }
```

In the existing narrow-screen media query, add:

```css
.notif-project-head { align-items: flex-start; flex-direction: column; gap: 2px; }
.notif-project-head span { text-align: left; }
```

- [ ] **Step 6: Run structural and syntax verification**

```bash
test "$(rg -o 'class="notif reveal"' index.html | wc -l | tr -d ' ')" = "2"
test "$(rg -o 'class="notif-project"' index.html | wc -l | tr -d ' ')" = "3"
test "$(rg -o 'class="pnotif"' index.html | wc -l | tr -d ' ')" = "2"
test "$(rg -o 'class="pnotif-project"' index.html | wc -l | tr -d ' ')" = "3"
rg -q 'assets/experience/zebpay-logo.jpg' index.html
rg -q 'assets/experience/nickelfox-logo.png' index.html
file assets/experience/zebpay-logo.jpg | rg -q 'JPEG image data'
file assets/experience/nickelfox-logo.png | rg -q 'PNG image data'
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 7: Verify the rendered page**

Open `http://localhost:8080/#experience` at the current desktop viewport and a narrow viewport. Confirm exactly two primary cards, three visibly nested Nickelfox subsections, two employer logos in the phone screen, readable copy, and no overflow.

- [ ] **Step 8: Commit only the scoped implementation**

Use interactive staging because `index.html` and `style.css` already contain unrelated working-tree edits:

```bash
git add assets/experience/zebpay-logo.jpg assets/experience/nickelfox-logo.png
git add -p index.html style.css
git diff --cached --check
git diff --cached --stat
git commit -m "feat: group experience by employer"
```

Accept only the Experience and phone-notification hunks. Expected: the commit contains the two logo assets plus the scoped `index.html` and `style.css` changes, while unrelated working-tree edits remain unstaged.
