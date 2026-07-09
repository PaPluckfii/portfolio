# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single-page dark portfolio for Sumeet Das with a CSS-drawn Android phone whose app drawer showcases his apps.

**Architecture:** Three static files (`index.html`, `style.css`, `app.js`) in repo root. Projects are a JS data array rendered into the drawer and a no-JS fallback list. All animation is CSS transitions/keyframes driven by class toggles and one IntersectionObserver. No build step.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, transitions), vanilla ES6 JS, Google Fonts (Inter). Spec: `docs/superpowers/specs/2026-07-09-portfolio-design.md`.

**Design tokens (used everywhere):** bg `#181818`, surface `#262626`, text `#fafafa`, muted `#a3a3a3`, border `#ffffff14`, accent `#3ddc84`, radii 16/24px.

**Testing note:** static site — verification is loading the page in a browser (`python3 -m http.server`) and checking behavior per step. No unit-test framework (YAGNI).

---

### Task 1: HTML skeleton with all content

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write `index.html`**

Full semantic structure. All resume content lives here (SEO + no-JS readable). Phone markup included; drawer grid is empty (`#drawer-grid`) — JS fills it. `<noscript>`-independent fallback: projects also listed in `#projects-fallback` (hidden by JS, visible without it).

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sumeet Das — Kotlin/Android Developer</title>
<meta name="description" content="Senior Android/KMM developer. 4.8 years building fintech and ed-tech apps. Compose Multiplatform, Kotlin, 100K+ users.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<header class="nav">
  <span class="nav-brand">sumeet.das</span>
  <nav class="nav-links">
    <a href="#projects">Apps</a>
    <a href="#skills">Skills</a>
    <a href="#experience">Experience</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <section class="hero" id="top">
    <div class="hero-text reveal">
      <p class="eyebrow">Senior Android / KMM Developer</p>
      <h1>Sumeet<br>Das</h1>
      <p class="hero-sub">4.8 years building enterprise-grade apps across fintech and ed-tech.
      Compose Multiplatform at India's first crypto exchange. A multi-module SDK powering
      13+ apps and 100K+ users.</p>
      <a class="btn-accent" href="#projects">Open the app drawer ↓</a>
    </div>

    <div class="phone-wrap reveal">
      <div class="phone" id="phone">
        <div class="phone-camera"></div>
        <div class="phone-screen">
          <div class="statusbar"><span id="clock">12:00</span><span class="statusbar-icons">▲ ▮ ▰</span></div>
          <div class="homescreen" id="homescreen">
            <div class="home-clock" id="home-clock">12:00</div>
            <div class="home-date" id="home-date">Wed, Jul 9</div>
            <button class="drawer-handle" id="drawer-open" aria-expanded="false" aria-controls="drawer">
              <span class="drawer-chevron">⌃</span> swipe up
            </button>
          </div>
          <div class="drawer" id="drawer" role="dialog" aria-label="App drawer">
            <div class="drawer-search">Search apps…</div>
            <div class="drawer-grid" id="drawer-grid"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="projects">
    <h2 class="reveal">Apps</h2>
    <p class="section-sub reveal">Tap an icon in the drawer — or browse below.</p>
    <div class="app-detail" id="app-detail" hidden></div>
    <div id="projects-fallback" class="fallback-grid"></div>
  </section>

  <section class="section" id="skills">
    <h2 class="reveal">Skills</h2>
    <div class="skill-groups">
      <div class="skill-group reveal"><h3>Languages</h3><div class="chips"><span>Kotlin</span><span>Java</span><span>XML</span></div></div>
      <div class="skill-group reveal"><h3>UI</h3><div class="chips"><span>Jetpack Compose</span><span>Compose Multiplatform</span><span>Android SDK</span><span>XML Layouts</span></div></div>
      <div class="skill-group reveal"><h3>Architecture</h3><div class="chips"><span>MVVM</span><span>MVI</span><span>Clean Architecture</span><span>Multi-module</span></div></div>
      <div class="skill-group reveal"><h3>Multiplatform</h3><div class="chips"><span>KMM</span><span>CMP</span><span>Ktor</span></div></div>
      <div class="skill-group reveal"><h3>Data & Network</h3><div class="chips"><span>Room</span><span>SQLDelight</span><span>SQLite</span><span>MongoDB</span><span>Retrofit</span><span>Ktor Client</span><span>REST</span></div></div>
      <div class="skill-group reveal"><h3>Tools & Practice</h3><div class="chips"><span>Hilt / Koin</span><span>Coroutines</span><span>JUnit</span><span>Espresso</span><span>Git</span><span>GitHub Packages</span><span>Firebase</span><span>Agile</span></div></div>
      <div class="skill-group reveal"><h3>AI & Dev Tools</h3><div class="chips"><span>MCP</span><span>Figma Connect</span><span>GSD</span><span>Agentic Workflows</span></div></div>
    </div>
  </section>

  <section class="section" id="experience">
    <h2 class="reveal">Experience</h2>
    <div class="notif-stack">
      <article class="notif reveal">
        <div class="notif-head"><span class="notif-app">DVL Systems · Zebpay</span><span class="notif-time">Oct 2025 – Apr 2026</span></div>
        <h3>SDE 2 — India's first crypto exchange</h3>
        <p>End-to-end KMM → Compose Multiplatform migration sharing 70%+ of the codebase across Android/iOS.
        Pioneered agentic dev workflows (MCP, Figma Connect, GSD) cutting design-to-code handoff time by 30%.</p>
      </article>
      <article class="notif reveal">
        <div class="notif-head"><span class="notif-app">Nickelfox · Vantero</span><span class="notif-time">Aug 2021 – Oct 2025</span></div>
        <h3>SDE 2 — DM Ventures LLC</h3>
        <p>Multi-module re-architecture prepping full CMP migration. Led 'Target Zero Bugs' — 90%+ defects
        eliminated via developer-driven testing. Managed a dev team; shipped custom animated features.</p>
      </article>
      <article class="notif reveal">
        <div class="notif-head"><span class="notif-app">Nickelfox · Innoviti</span><span class="notif-time">POS Apps</span></div>
        <h3>Enterprise Android POS</h3>
        <p>Secure payment transaction apps for retail clients. Backend integration with Node.js and FreshDesk APIs.</p>
      </article>
      <article class="notif reveal">
        <div class="notif-head"><span class="notif-app">Nickelfox · IFSTA</span><span class="notif-time">Oklahoma State University</span></div>
        <h3>13+ Android apps, 100K+ downloads</h3>
        <p>Flagship Essentials 7th Edition hit 100K+ Play Store downloads. Multi-module SDK via GitHub Packages
        cut dev time 70% across 13+ projects. Led a cross-functional team.</p>
      </article>
    </div>
  </section>

  <section class="section" id="contact">
    <h2 class="reveal">Contact</h2>
    <div class="contact-links reveal">
      <a href="mailto:sumeet.ad.das@gmail.com">sumeet.ad.das@gmail.com</a>
      <a href="https://github.com/PaPluckfii" target="_blank" rel="noopener">github.com/PaPluckfii</a>
      <a href="https://linkedin.com/in/sumeetdas1996" target="_blank" rel="noopener">linkedin.com/in/sumeetdas1996</a>
    </div>
  </section>
</main>

<footer class="footer">Noida, India · Built with plain HTML, CSS & JS</footer>
<script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify it loads**

Run: `python3 -m http.server 8080 -d /Users/apple/AndroidStudioProjects/portfolio` then open `http://localhost:8080`.
Expected: unstyled but complete content, no console 404 except style.css/app.js (not written yet).

- [ ] **Step 3: Commit**

```bash
git add index.html && git commit -m "feat: portfolio HTML structure and content"
```

---

### Task 2: Design system + page layout CSS

**Files:**
- Create: `style.css` (tokens, base, nav, hero, sections, chips, notif cards, contact, footer, reveal animation)

- [ ] **Step 1: Write `style.css` part 1 — everything except the phone**

```css
:root {
  --bg: #181818; --surface: #262626; --text: #fafafa; --muted: #a3a3a3;
  --border: #ffffff14; --accent: #3ddc84;
  --r: 16px; --r-lg: 24px;
}
* { box-sizing: border-box; margin: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg); color: var(--text);
  font: 400 16px/1.6 Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--text); }
h1, h2, h3 { letter-spacing: -0.04em; font-weight: 600; }

/* nav */
.nav {
  position: sticky; top: 0; z-index: 10;
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 6vw; background: #181818e6; backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-brand { font-weight: 600; color: var(--accent); }
.nav-links a { margin-left: 24px; color: var(--muted); text-decoration: none; transition: color .2s; }
.nav-links a:hover, .nav-links a:focus-visible { color: var(--text); }

/* hero */
.hero {
  display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: center;
  min-height: calc(100vh - 65px); padding: 48px 6vw;
}
.eyebrow { color: var(--accent); font-weight: 500; margin-bottom: 16px; }
h1 { font-size: clamp(48px, 8vw, 96px); line-height: 1.02; }
.hero-sub { color: var(--muted); max-width: 46ch; margin: 24px 0 32px; }
.btn-accent {
  display: inline-block; background: var(--accent); color: #0a1f14;
  font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 40px;
  transition: transform .2s;
}
.btn-accent:hover { transform: translateY(-2px); }

/* sections */
.section { padding: 96px 6vw; border-top: 1px solid var(--border); }
.section h2 { font-size: clamp(28px, 4vw, 44px); margin-bottom: 8px; }
.section-sub { color: var(--muted); margin-bottom: 32px; }

/* skills */
.skill-groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.skill-group { background: var(--surface); border-radius: var(--r-lg); padding: 24px; }
.skill-group h3 { font-size: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chips span {
  border: 1px solid var(--border); border-radius: 40px; padding: 4px 14px;
  font-size: 14px; color: var(--text); transition: border-color .2s, color .2s;
}
.chips span:hover { border-color: var(--accent); color: var(--accent); }

/* experience — notification cards */
.notif-stack { display: grid; gap: 16px; max-width: 760px; }
.notif { background: var(--surface); border-radius: var(--r-lg); padding: 20px 24px; }
.notif-head { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin-bottom: 8px; }
.notif-app::before { content: "●"; color: var(--accent); margin-right: 8px; font-size: 10px; }
.notif h3 { font-size: 18px; margin-bottom: 6px; }
.notif p { color: var(--muted); font-size: 15px; }

/* contact + footer */
.contact-links { display: flex; flex-direction: column; gap: 12px; font-size: clamp(18px, 3vw, 28px); }
.contact-links a { text-decoration: none; color: var(--muted); transition: color .2s; }
.contact-links a:hover { color: var(--accent); }
.footer { padding: 32px 6vw; color: var(--muted); font-size: 13px; border-top: 1px solid var(--border); }

/* scroll reveal */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
.reveal.in { opacity: 1; transform: none; }
/* stagger rows inside grids */
.skill-group.reveal, .notif.reveal { transition-delay: var(--d, 0s); }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  html { scroll-behavior: auto; }
}
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .nav-links a { margin-left: 14px; font-size: 14px; }
}
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:8080`. Expected: dark themed page, hero grid, chips, notif cards styled. All `.reveal` elements invisible (JS not yet toggling `.in`) — fine for now.

- [ ] **Step 3: Commit**

```bash
git add style.css && git commit -m "feat: dark design system and page layout"
```

---

### Task 3: CSS phone with drawer

**Files:**
- Modify: `style.css` (append phone/drawer/app-detail styles)

- [ ] **Step 1: Append phone CSS to `style.css`**

```css
/* ---- phone ---- */
.phone-wrap { display: flex; justify-content: center; perspective: 1200px; }
.phone {
  width: min(320px, 80vw); aspect-ratio: 9 / 19; position: relative;
  background: #000; border-radius: 40px; padding: 10px;
  border: 1px solid #333;
  transition: transform .3s ease;
  transform: rotateY(calc(var(--tilt, 0) * -6deg)) rotateX(calc(var(--tilt, 0) * 3deg));
}
.phone-camera {
  position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
  width: 12px; height: 12px; background: #111; border-radius: 50%; z-index: 3;
  box-shadow: inset 0 0 2px 1px #2a2a2a;
}
.phone-screen {
  position: relative; width: 100%; height: 100%; overflow: hidden;
  border-radius: 32px;
  background: linear-gradient(160deg, #0f2027, #203a43 55%, #1b5e3f);
}
.statusbar {
  position: absolute; top: 0; left: 0; right: 0; z-index: 2;
  display: flex; justify-content: space-between; padding: 8px 16px;
  font-size: 11px; color: #fff9;
}
.homescreen {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px;
}
.home-clock { font-size: 56px; font-weight: 300; letter-spacing: -0.02em; }
.home-date { color: #fff9; font-size: 14px; }
.drawer-handle {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: none; border: none; color: #fffc; font: inherit; font-size: 13px;
  cursor: pointer; display: flex; flex-direction: column; align-items: center;
}
.drawer-chevron { animation: bob 1.6s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-5px); } }

/* drawer */
.drawer {
  position: absolute; inset: 0; z-index: 4;
  background: #121212f2; backdrop-filter: blur(8px);
  border-radius: 32px; padding: 44px 18px 18px;
  transform: translateY(100%);
  transition: transform .45s cubic-bezier(.2, .9, .3, 1.05);
}
.drawer.open { transform: translateY(0); }
.drawer-search {
  background: #ffffff14; border-radius: 40px; padding: 8px 16px;
  font-size: 13px; color: #fff8; margin-bottom: 20px;
}
.drawer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px 8px; }
.app-icon {
  background: none; border: none; cursor: pointer; color: #fffd;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  font: 500 11px/1.2 Inter, sans-serif;
  transition: transform .15s;
}
.app-icon:hover, .app-icon:focus-visible { transform: scale(1.08); }
.app-icon .glyph {
  width: 52px; height: 52px; border-radius: 26px;
  display: grid; place-items: center;
  font-size: 22px; font-weight: 600; color: #0a1f14;
}

/* app detail panel */
.app-detail {
  background: var(--surface); border-radius: var(--r-lg); padding: 32px;
  max-width: 760px; margin-bottom: 32px;
  transform-origin: top center; animation: launch .35s cubic-bezier(.2, .9, .3, 1.05);
}
@keyframes launch { from { opacity: 0; transform: scale(.85) translateY(16px); } }
.app-detail .detail-head { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.app-detail .glyph {
  width: 56px; height: 56px; border-radius: 28px; flex-shrink: 0;
  display: grid; place-items: center; font-size: 24px; font-weight: 600; color: #0a1f14;
}
.app-detail h3 { font-size: 24px; }
.app-detail .detail-role { color: var(--accent); font-size: 14px; }
.app-detail p { color: var(--muted); margin-bottom: 16px; }
.app-detail .metrics { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 16px; }
.app-detail .metric b { display: block; font-size: 22px; color: var(--text); }
.app-detail .metric span { font-size: 13px; color: var(--muted); }

/* no-JS fallback grid (hidden by JS) */
.fallback-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.fallback-grid .app-detail { animation: none; margin: 0; max-width: none; }
body.js .fallback-grid { display: none; }

@media (prefers-reduced-motion: reduce) {
  .drawer { transition: none; }
  .app-detail { animation: none; }
  .drawer-chevron { animation: none; }
}
```

- [ ] **Step 2: Verify in browser**

Reload. Expected: phone renders — black frame, gradient screen, big clock, "swipe up" handle bobbing. Drawer hidden (translated off-screen).

- [ ] **Step 3: Commit**

```bash
git add style.css && git commit -m "feat: CSS phone frame, app drawer, app detail styles"
```

---

### Task 4: app.js — data, drawer, launch, clock, reveal

**Files:**
- Create: `app.js`

- [ ] **Step 1: Write `app.js`**

```js
"use strict";
document.body.classList.add("js");

// ---- apps data: add a project = add one object ----
const APPS = [
  {
    id: "zebpay", name: "Zebpay", letter: "Z", color: "#3ddc84",
    role: "SDE 2 · DVL Systems", store: null,
    desc: "India's first crypto exchange. End-to-end migration from KMM to Compose Multiplatform, unifying Android and iOS into one codebase.",
    stack: ["Kotlin", "Compose Multiplatform", "KMM", "Ktor", "MVI"],
    metrics: [["70%+", "code shared across platforms"], ["30%", "faster design-to-code handoff"]],
  },
  {
    id: "vantero", name: "Vantero", letter: "V", color: "#82b1ff",
    role: "SDE 2 · Nickelfox / DM Ventures", store: null,
    desc: "Multi-module re-architecture prepping full CMP migration. Led the 'Target Zero Bugs' initiative and shipped custom animated features.",
    stack: ["Kotlin", "Jetpack Compose", "Multi-module", "MVVM", "Hilt"],
    metrics: [["90%+", "defects eliminated"], ["Team", "lead"]],
  },
  {
    id: "innoviti", name: "POS Suite", letter: "P", color: "#ffb74d",
    role: "Android Developer · Innoviti", store: null,
    desc: "Enterprise Android POS applications for secure retail payment transactions, with Node.js and FreshDesk backend integration.",
    stack: ["Kotlin", "Android SDK", "Node.js", "REST"],
    metrics: [["Enterprise", "retail clients"]],
  },
  {
    id: "ifsta-e7", name: "Essentials 7th Ed", letter: "E", color: "#e57373",
    role: "Lead Developer · IFSTA / Oklahoma State", store: null,
    desc: "Flagship IFSTA companion app: exam prep, audiobooks, identification modules, skill videos and course content for firefighter training.",
    stack: ["Kotlin", "Java", "Room", "Retrofit", "Multi-module SDK"],
    metrics: [["100K+", "Play Store downloads"]],
  },
  {
    id: "ifsta-sdk", name: "IFSTA Suite", letter: "13+", color: "#ba68c8",
    role: "Lead Developer · IFSTA / Oklahoma State", store: null,
    desc: "13+ companion apps built on a shared multi-module SDK distributed via GitHub Packages — one architecture, many books.",
    stack: ["Kotlin", "GitHub Packages", "Clean Architecture", "SQLite"],
    metrics: [["70%", "dev time saved per app"], ["13+", "apps shipped"]],
  },
];

const $ = (s) => document.querySelector(s);

// ---- clocks ----
function tick() {
  const now = new Date();
  const t = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  $("#clock").textContent = t;
  $("#home-clock").textContent = t;
  $("#home-date").textContent = now.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}
tick();
setInterval(tick, 30_000);

// ---- drawer ----
const drawer = $("#drawer");
const openBtn = $("#drawer-open");
openBtn.addEventListener("click", () => {
  const open = drawer.classList.toggle("open");
  openBtn.setAttribute("aria-expanded", open);
});

// ---- render app icons + detail ----
function detailHTML(app) {
  return `
    <div class="detail-head">
      <div class="glyph" style="background:${app.color}">${app.letter}</div>
      <div><h3>${app.name}</h3><div class="detail-role">${app.role}</div></div>
    </div>
    <p>${app.desc}</p>
    <div class="metrics">${app.metrics.map(([b, s]) => `<div class="metric"><b>${b}</b><span>${s}</span></div>`).join("")}</div>
    <div class="chips">${app.stack.map((s) => `<span>${s}</span>`).join("")}</div>`;
}

const grid = $("#drawer-grid");
const detail = $("#app-detail");
for (const app of APPS) {
  const btn = document.createElement("button");
  btn.className = "app-icon";
  btn.innerHTML = `<span class="glyph" style="background:${app.color}">${app.letter}</span>${app.name}`;
  btn.addEventListener("click", () => {
    detail.hidden = false;
    detail.innerHTML = detailHTML(app);
    // restart launch animation
    detail.style.animation = "none";
    void detail.offsetWidth;
    detail.style.animation = "";
    document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  grid.appendChild(btn);
}

// no-JS fallback also useful for SEO: render all details statically
$("#projects-fallback").innerHTML = APPS
  .map((a) => `<article class="app-detail">${detailHTML(a)}</article>`)
  .join("");

// show first app by default so #projects isn't empty
detail.hidden = false;
detail.innerHTML = detailHTML(APPS[0]);

// ---- scroll reveal (stagger siblings) ----
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.setProperty("--d", `${(i % 4) * 0.08}s`);
  io.observe(el);
});

// ---- phone tilt on scroll ----
const phone = $("#phone");
let raf = 0;
addEventListener("scroll", () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    phone.style.setProperty("--tilt", Math.min(scrollY / 600, 1).toFixed(3));
  });
}, { passive: true });
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:8080`. Check:
- clock in statusbar + homescreen shows current time
- "swipe up" opens drawer with 5 app icons; click again closes
- tapping an icon shows detail panel with launch scale-in, scrolls to Apps section
- sections fade in on scroll; phone tilts slightly while scrolling
- disable JS (DevTools) → fallback grid of all 5 project cards visible

- [ ] **Step 3: Commit**

```bash
git add app.js && git commit -m "feat: drawer interactions, app launch, clock, scroll reveal"
```

---

### Task 5: Final QA + deploy prep

**Files:**
- Modify: whatever QA surfaces (expect small CSS fixes)

- [ ] **Step 1: QA pass**

- Mobile viewport (DevTools 390px): hero stacks, phone scales, nav fits, drawer taps work
- Keyboard: tab reaches nav links, drawer handle, app icons; focus visible
- `prefers-reduced-motion` emulation: no animations, content all visible
- Lighthouse quick run: accessibility ≥ 90

- [ ] **Step 2: Fix anything found, commit**

```bash
git add -A && git commit -m "fix: QA polish"
```

- [ ] **Step 3: Deploy (needs user's GitHub)**

User creates repo + pushes; enable GitHub Pages on main branch root. Not automatable without credentials — hand off with exact commands:

```bash
git remote add origin git@github.com:PaPluckfii/portfolio.git
git push -u origin main
# then GitHub → Settings → Pages → Deploy from branch → main / root
```
