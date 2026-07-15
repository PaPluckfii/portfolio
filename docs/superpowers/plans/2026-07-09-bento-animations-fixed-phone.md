# Bento Animations + Fixed Phone Column Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin the phone mockup to the right side of the desktop viewport for the whole scroll, make its screen mirror the section being read, and add bento.me-style animations (spring reveals, hover lift, glow border).

**Architecture:** Static site, 3 files (`index.html`, `style.css`, `app.js`), zero dependencies. Phone moves from the hero into a global `<aside>` inside a 2-column grid wrapper; `position: sticky` pins it. Phone "screens" are absolutely-positioned layers crossfaded by an IntersectionObserver keyed on section ids. Animations are pure CSS.

**Tech Stack:** Plain HTML/CSS/JS. No test framework exists or is warranted — each task ends with a concrete manual browser verification step instead of automated tests.

**Spec:** `docs/superpowers/specs/2026-07-09-bento-animations-fixed-phone-design.md`

**Verification setup (once):** serve the site so relative paths and JS behave normally:

```bash
cd /Users/apple/AndroidStudioProjects/portfolio && python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser (or use the browse skill for screenshots).

---

### Task 1: Git init

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Init repo and ignore scratch dirs**

```bash
cd /Users/apple/AndroidStudioProjects/portfolio
git init
printf '.superpowers/\n.DS_Store\n' > .gitignore
```

- [ ] **Step 2: Initial commit**

```bash
git add -A
git commit -m "chore: initial commit of portfolio site"
```

Expected: commit succeeds, `git status` clean.

---

### Task 2: Two-column layout with sticky phone

**Files:**
- Modify: `index.html` (body structure: lines 14–116)
- Modify: `style.css` (hero + phone-wrap + mobile media query)

- [ ] **Step 1: Restructure `index.html` body**

Wrap `<main>` in a `.layout` div and move the entire `.phone-wrap` block (currently inside `.hero`, lines 35–53) out of the hero into a new `<aside class="phone-col">` that is a sibling of `<main>`. Resulting structure:

```html
<header class="nav"> …unchanged… </header>

<div class="layout">
<main>
  <section class="hero" id="top">
    <div class="hero-text reveal">
      …unchanged hero text…
    </div>
    <!-- phone-wrap removed from here -->
  </section>
  …all other sections unchanged…
</main>

<aside class="phone-col">
  <div class="phone-wrap reveal">
    <div class="phone" id="phone">
      …entire existing phone markup, unchanged…
    </div>
  </div>
</aside>
</div>

<footer class="footer">…unchanged…</footer>
```

- [ ] **Step 2: Update layout CSS in `style.css`**

Replace the `.hero` rule:

```css
.hero {
  display: grid; grid-template-columns: 1fr; align-items: center;
  min-height: calc(100vh - 65px); padding: 48px 6vw;
}
```

Add after the `.nav` rules:

```css
/* two-column shell: content left, pinned phone right */
.layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; }
.layout > main { min-width: 0; }
.phone-col { padding: 48px 6vw 48px 0; }
```

Replace the `.phone-wrap` rule in the phone section:

```css
.phone-wrap {
  position: sticky; top: 96px;
  display: flex; justify-content: center; perspective: 1200px;
}
```

- [ ] **Step 3: Update the ≤860px media query**

In the existing `@media (max-width: 860px)` block, add `.layout { display: block; }` and change the phone override to `position: fixed` (sticky from Step 2 would otherwise win):

```css
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .nav-links { gap: 4px 14px; font-size: 14px; }
  .layout { display: block; }
  .phone-col { padding: 0; }
  .phone-wrap { position: fixed; top: auto; bottom: 16px; right: 16px; z-index: 5; pointer-events: none; }
  .phone-wrap .phone { width: min(140px, 32vw); pointer-events: auto; }
}
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:8080`. Expected: desktop — phone sits right of all content and stays pinned while scrolling hero→contact; no content passes under it; drawer still opens. Narrow window to <860px — phone becomes small fixed widget bottom-right; content full width.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: pin phone in dedicated sticky right column"
```

---

### Task 3: Phone screen layers (HTML + CSS)

**Files:**
- Modify: `index.html` (inside `.phone-screen`)
- Modify: `style.css` (phone section)

- [ ] **Step 1: Add screen layers to `index.html`**

Inside `.phone-screen`, add `pscreen` classes. The existing homescreen div becomes the "home" layer (keep its id and inner markup); add four new layers after the homescreen div, before the drawer:

```html
<div class="phone-screen">
  <div class="statusbar">…unchanged…</div>

  <div class="homescreen pscreen active" id="homescreen" data-screen="home">
    …unchanged inner markup…
  </div>

  <div class="pscreen" data-screen="projects" id="pscreen-projects"></div>

  <div class="pscreen" data-screen="skills">
    <div class="papp-bar">Skills</div>
    <div class="papp-body">
      <div class="pchips">
        <span>Kotlin</span><span>Java</span><span>Jetpack Compose</span><span>Compose Multiplatform</span>
        <span>KMM</span><span>Ktor</span><span>MVVM</span><span>MVI</span><span>Clean Architecture</span>
        <span>Multi-module</span><span>Room</span><span>SQLDelight</span><span>Retrofit</span>
        <span>Hilt / Koin</span><span>Coroutines</span><span>Firebase</span><span>MCP</span><span>Agentic Workflows</span>
      </div>
    </div>
  </div>

  <div class="pscreen" data-screen="experience">
    <div class="papp-bar">Notifications</div>
    <div class="papp-body">
      <div class="pnotif"><b>DVL Systems · Zebpay</b><span>SDE 2 — KMM → CMP migration, 70%+ shared code</span></div>
      <div class="pnotif"><b>Nickelfox · Vantero</b><span>SDE 2 — multi-module re-architecture, 90%+ defects cut</span></div>
      <div class="pnotif"><b>Nickelfox · Innoviti</b><span>Enterprise Android POS apps</span></div>
      <div class="pnotif"><b>Nickelfox · IFSTA</b><span>13+ apps, 100K+ downloads</span></div>
    </div>
  </div>

  <div class="pscreen" data-screen="contact">
    <div class="papp-bar">Contacts</div>
    <div class="papp-body">
      <a class="pcontact" href="mailto:sumeet.ad.das@gmail.com">✉&nbsp; sumeet.ad.das@gmail.com</a>
      <a class="pcontact" href="https://github.com/PaPluckfii" target="_blank" rel="noopener">⌥&nbsp; github.com/PaPluckfii</a>
      <a class="pcontact" href="https://linkedin.com/in/sumeetdas1996" target="_blank" rel="noopener">in&nbsp; linkedin.com/in/sumeetdas1996</a>
    </div>
  </div>

  <div class="drawer" id="drawer" …>…unchanged…</div>
</div>
```

- [ ] **Step 2: Add layer + mini-app CSS to `style.css`** (after the `.homescreen` rules)

```css
/* phone screen layers */
.pscreen {
  position: absolute; inset: 0; z-index: 1;
  opacity: 0; transform: translateY(12px); pointer-events: none;
  transition: opacity .35s ease, transform .35s ease;
}
.pscreen.active { opacity: 1; transform: none; pointer-events: auto; }

/* mini in-phone app chrome */
.papp-bar { padding: 36px 16px 10px; font-size: 13px; color: #fffc; border-bottom: 1px solid var(--border); }
.papp-body {
  padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
  font-size: 12px; overflow: hidden; height: calc(100% - 62px);
}
.pchips { display: flex; flex-wrap: wrap; gap: 6px; }
.pchips span { border: 1px solid #ffffff22; border-radius: 20px; padding: 2px 10px; font-size: 10px; color: #fffd; }
.pnotif { background: #ffffff14; border-radius: 12px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; }
.pnotif b { font-size: 12px; }
.pnotif span { color: #fff9; font-size: 10px; line-height: 1.4; }
.pcontact { background: #ffffff14; border-radius: 12px; padding: 10px 12px; color: #fff; text-decoration: none; font-size: 11px; }
.pcontact:hover { background: #ffffff22; }

/* projects mini screen */
#pscreen-projects .papp-body { align-items: flex-start; }
#pscreen-projects .glyph {
  width: 44px; height: 44px; border-radius: 22px; display: grid; place-items: center;
  font-size: 18px; font-weight: 600; color: #0a1f14;
}
#pscreen-projects .prole { color: #3ddc84cc; font-size: 10px; }
#pscreen-projects .pmetrics { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
#pscreen-projects .pmetrics b { display: block; font-size: 16px; }
#pscreen-projects .pmetrics span { color: #fff9; font-size: 10px; }
```

Note: `.homescreen` already has `position: absolute; inset: 0` — the added `pscreen` class only contributes the fade mechanics. The drawer's `z-index: 4` keeps it above all layers.

- [ ] **Step 3: Verify layers manually**

Open `http://localhost:8080`, in devtools console run:

```js
document.querySelector('[data-screen="skills"]').classList.add('active');
document.getElementById('homescreen').classList.remove('active');
```

Expected: phone crossfades from clock to a Skills chip screen. Repeat for `experience` and `contact` layers. Reset by reloading.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add phone screen layers for section mirroring"
```

---

### Task 4: Two-way scroll sync (JS)

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Extract `showApp` and fill the projects mini-screen**

Replace the icon-click handler block and the default-detail lines (currently lines 76–101) with:

```js
const grid = $("#drawer-grid");
const detail = $("#app-detail");
const pscreenProjects = $("#pscreen-projects");

function phoneAppHTML(app) {
  return `
    <div class="papp-bar">${app.name}</div>
    <div class="papp-body">
      <div class="glyph" style="background:${app.color}">${app.letter}</div>
      <b>${app.name}</b>
      <span class="prole">${app.role}</span>
      <div class="pmetrics">${app.metrics.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
    </div>`;
}

function showApp(app, scroll = false) {
  detail.hidden = false;
  detail.innerHTML = detailHTML(app);
  pscreenProjects.innerHTML = phoneAppHTML(app);
  // restart launch animation
  detail.style.animation = "none";
  void detail.offsetWidth;
  detail.style.animation = "";
  if (scroll) document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "start" });
}

for (const app of APPS) {
  const btn = document.createElement("button");
  btn.className = "app-icon";
  btn.innerHTML = `<span class="glyph" style="background:${app.color}">${app.letter}</span>${app.name}`;
  btn.addEventListener("click", () => showApp(app, true));
  grid.appendChild(btn);
}

// no-JS fallback also useful for SEO: render all details statically
$("#projects-fallback").innerHTML = APPS
  .map((a) => `<article class="app-detail">${detailHTML(a)}</article>`)
  .join("");

// show first app by default so #projects isn't empty
showApp(APPS[0]);
```

- [ ] **Step 2: Add the section→screen observer** (append at end of `app.js`)

```js
// ---- two-way sync: page section -> phone screen ----
const SCREEN_FOR = { top: "home", projects: "projects", skills: "skills", experience: "experience", contact: "contact" };

function setScreen(name) {
  document.querySelectorAll(".pscreen").forEach((s) =>
    s.classList.toggle("active", s.dataset.screen === name));
}

const sectionIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && SCREEN_FOR[e.target.id]) setScreen(SCREEN_FOR[e.target.id]);
  }
}, { rootMargin: "-45% 0px -45% 0px" }); // fires when section crosses viewport center

document.querySelectorAll("main section[id]").forEach((s) => sectionIO.observe(s));
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:8080`, scroll slowly top→bottom. Expected: phone shows clock at hero, Zebpay mini-card at Apps, chips at Skills, notifications at Experience, contacts at Contact — crossfading near viewport center. Open drawer, tap another app: page scrolls to Apps and both the page detail and phone mini-card update. Contact links inside phone open.

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: sync phone screen with scrolled section"
```

---

### Task 5: Bento animations (spring reveal, hover lift, glow border)

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Replace `.reveal` fade with spring keyframe**

Replace the scroll-reveal block:

```css
/* scroll reveal — springy */
.reveal { opacity: 0; }
.reveal.in { animation: springIn .6s cubic-bezier(.2, .9, .3, 1.15) both; animation-delay: var(--d, 0s); }
@keyframes springIn {
  from { opacity: 0; transform: translateY(28px) scale(.96); }
  60%  { opacity: 1; transform: translateY(-4px) scale(1.01); }
  to   { opacity: 1; transform: none; }
}
```

Delete the old `.reveal`/`.reveal.in` transition rules and the `.skill-group.reveal, .notif.reveal { transition-delay: … }` rule (delay now rides on `animation-delay`; JS `--d` stagger is unchanged).

- [ ] **Step 2: Add hover lift + tilt**

```css
/* bento hover lift */
.skill-group, .notif, .app-detail {
  transition: transform .25s cubic-bezier(.2, .9, .3, 1.2), box-shadow .25s ease;
}
.skill-group:hover, .notif:hover { transform: translateY(-6px) rotate(-1deg) scale(1.02); box-shadow: 0 16px 32px #0008; }
.app-detail:hover { transform: translateY(-4px); box-shadow: 0 16px 32px #0008; }
.contact-links a { transition: color .2s, transform .25s cubic-bezier(.2, .9, .3, 1.2); }
.contact-links a:hover { transform: translateX(8px); }
```

(The `.contact-links a` rule replaces its existing `transition: color .2s`.)

- [ ] **Step 3: Add rotating glow border on the active app detail**

```css
/* rotating glow border on active app card */
@property --ga { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
#app-detail { position: relative; }
#app-detail::before {
  content: ""; position: absolute; inset: 0; border-radius: var(--r-lg); padding: 1px;
  background: conic-gradient(from var(--ga), var(--accent), transparent 25%, transparent 75%, var(--accent));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  animation: glowspin 3s linear infinite;
  pointer-events: none;
}
@keyframes glowspin { to { --ga: 360deg; } }
```

Targets only `#app-detail` (the live panel), not the no-JS fallback cards. Browsers without `@property` show a static gradient edge — acceptable degradation per spec.

- [ ] **Step 4: Extend reduced-motion blocks**

In the first `@media (prefers-reduced-motion: reduce)` block, replace the `.reveal` line with `animation: none` form and add the new effects:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal.in { opacity: 1; transform: none; animation: none; }
  html { scroll-behavior: auto; }
  .skill-group, .notif, .app-detail, .contact-links a { transition: none; }
  .skill-group:hover, .notif:hover, .app-detail:hover, .contact-links a:hover { transform: none; box-shadow: none; }
  #app-detail::before { animation: none; }
  .pscreen { transition: none; }
}
```

- [ ] **Step 5: Verify in browser**

Open `http://localhost:8080`. Expected: sections pop in with slight overshoot and stagger while scrolling; skill/experience cards lift-tilt on hover; contact links nudge right; active app card has a slowly rotating green border glow. In devtools, emulate `prefers-reduced-motion: reduce` (Rendering tab): everything static, page fully readable.

- [ ] **Step 6: Commit**

```bash
git add style.css
git commit -m "feat: spring reveals, hover lift, glow border"
```

---

### Task 6: Final cross-check

**Files:** none (verification only)

- [ ] **Step 1: Full pass, desktop**

Scroll `http://localhost:8080` top→bottom at ~1440px width. Checklist: phone pinned entire scroll; screens sync per section; drawer opens/navigates; nav links scroll correctly; no horizontal scrollbar.

- [ ] **Step 2: Full pass, mobile width**

Narrow to 400px. Checklist: mini phone widget bottom-right, still syncing screens; content full width; nothing overlaps unusably.

- [ ] **Step 3: No-JS pass**

Disable JS in devtools, reload. Expected: fallback project grid visible, phone shows homescreen, all content readable.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: polish from final cross-check"
```

(Skip if nothing changed.)
