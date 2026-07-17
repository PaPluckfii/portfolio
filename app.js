"use strict";
document.body.classList.add("js");

// ---- apps data: add a project = add one object ----
const APPS = [
  {
    id: "zebpay", name: "Zebpay", letter: "Z", color: "#3ddc84",
    icon: "assets/experience/zebpay-logo.jpg",
    role: "SDE 2 · DVL Systems", store: null,
    desc: "India's first crypto exchange. End-to-end migration from KMP to Compose Multiplatform, unifying Android and iOS into one codebase.",
    stack: ["Kotlin", "Compose Multiplatform", "KMP", "Ktor", "MVI"],
    metrics: [["70%+", "code shared across platforms"], ["30%", "faster design-to-code handoff"]],
    screenshots: ["home.png", "home-loaded.png", "coin-detail.png", "futures.png", "exchange.png"],
  },
  {
    id: "vantero", name: "Vantero", letter: "V", color: "#82b1ff",
    icon: "assets/vantero/icon.webp",
    role: "SDE 2 · Nickelfox / DM Ventures", store: null,
    desc: "Multi-module re-architecture prepping full CMP migration. Led the 'Target Zero Bugs' initiative and shipped custom animated features.",
    stack: ["Kotlin", "Jetpack Compose", "Multi-module", "MVVM", "Hilt"],
    metrics: [["90%+", "Defects Eliminated"], ["Mobile", "Team Lead"]],
    screenshots: ["restaurants.png", "home.png", "weekly-training.png", "knowledge-check.png", "briefs.png", "menu.png", "leaderboard.png", "dish-training.png"],
  },
  {
    id: "innoviti", name: "POS Suite", letter: "P", color: "#ffb74d",
    icon: "assets/innoviti/icon.webp",
    role: "Android Developer · Innoviti", store: null,
    desc: "Enterprise Android POS applications for secure retail payment transactions, with Node.js and FreshDesk backend integration.",
    stack: ["Kotlin", "Android SDK", "Node.js", "REST"],
    metrics: [["Enterprise", "retail clients"]],
  },
  {
    id: "ifsta-sdk", name: "IFSTA Suite", letter: "13+", color: "#ba68c8",
    icon: "assets/ifsta-sdk/icon.webp",
    role: "Lead Developer · IFSTA / Oklahoma State", store: null,
    desc: "13+ companion apps built on a shared multi-module SDK distributed via GitHub Packages. Flagship Essentials 7th Edition reached 100K+ downloads with exam prep, audiobooks, identification modules, skill videos and firefighter-training course content.",
    stack: ["Kotlin", "GitHub Packages", "Clean Architecture", "SQLite"],
    metrics: [["100K+", "Essentials 7th Edition downloads"], ["70%", "dev time saved per app"], ["13+", "apps shipped"]],
    screenshots: ["home.png", "practice-exams.png", "exam-question.png", "key-terms.png", "audiobook.png", "tool-identification.png", "skill-video.png"],
  },
  {
    id: "solvem", name: "Solvem Grocery", letter: "S", color: "#f5c400",
    icon: "assets/solvem/icon.svg",
    role: "Independent Product · Flutter & Supabase", store: null,
    desc: "An end-to-end grocery operations platform connecting customer ordering, store administration, delivery workflows, and platform oversight through role-based realtime data.",
    stack: ["Flutter", "Dart", "Supabase", "PostgreSQL", "Google Sign-In"],
    metrics: [["4", "role-based experiences"], ["Realtime", "order operations"], ["COD", "settlement flow"]],
  },
  {
    id: "skoolos", name: "SkoolOS", letter: "S", color: "#4385ee",
    icon: "assets/skoolos/icon.png",
    role: "Independent Product · Kotlin Multiplatform", store: null,
    desc: "A teacher-focused education platform for grouped classes and subjects, review-first lecture recording, processing tracking, local transcription, and structured notes.",
    stack: ["Kotlin", "Compose Multiplatform", "Ktor", "PostgreSQL", "whisper.cpp"],
    metrics: [["KMP", "shared app foundation"], ["Local AI", "lecture transcription"], ["Review-first", "recording workflow"]],
    screenshots: ["teacher-capture-recording.png", "teacher-analytics.png", "teacher-lectures.png", "teacher-assistant.png", "teacher-lecture-notes.png"],
  },
  {
    id: "mandir-yatra", name: "Mandir Yaatra", letter: "M", color: "#ff5722",
    icon: "assets/mandir-yatra/icon.png",
    role: "Full-stack Developer · Independent", store: null,
    desc: "A full-stack pilgrimage platform for discovering sacred destinations, comparing curated tours, managing travellers, and processing bookings and payments.",
    stack: ["TypeScript", "Next.js", "Supabase", "Prisma", "Razorpay"],
    metrics: [["100+", "daily visits"], ["6", "role-based workflows"], ["2", "payment gateways"]],
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

openBtn.addEventListener("click", () => {
  const open = drawer.classList.toggle("open");
  openBtn.setAttribute("aria-expanded", open);
});

// ---- render app icons + detail ----
function glyphHTML(app) {
  if (!app.icon) return `<span class="glyph" style="background:${app.color}">${app.letter}</span>`;
  return `<span class="glyph glyph-image"><img src="${app.icon}" alt="${app.name} app icon"></span>`;
}

function detailHTML(app) {
  return `
    <div class="detail-head">
      ${glyphHTML(app)}
      <div><h3>${app.name}</h3><div class="detail-role">${app.role}</div></div>
    </div>
    <p>${app.desc}</p>
    <div class="metrics">${app.metrics.map(([b, s]) => `<div class="metric"><b>${b}</b><span>${s}</span></div>`).join("")}</div>
    <div class="chips">${app.stack.map((s) => `<span>${s}</span>`).join("")}</div>`;
}

const grid = $("#drawer-grid");
const sheetLayer = $("#project-sheet-layer");
const sheet = $("#project-sheet");
const sheetContent = $("#project-sheet-content");
const sheetClose = $("#project-sheet-close");
const sheetBackdrop = $("#project-sheet-backdrop");
const sheetHandle = $("#project-sheet-handle");
const sheetInertStates = new Map();
let sheetTrigger = null;
let sheetCloseTimer = 0;
let sheetOpenFrame = 0;

function setPhoneLayersInert(inert) {
  for (const layer of sheetLayer.parentElement.children) {
    if (layer === sheetLayer) continue;
    if (inert) {
      if (!sheetInertStates.has(layer)) sheetInertStates.set(layer, layer.inert);
      layer.inert = true;
    } else if (sheetInertStates.has(layer)) {
      layer.inert = sheetInertStates.get(layer);
    }
  }
  if (!inert) sheetInertStates.clear();
}

function showApp(app, trigger) {
  if (!app) return;
  cancelAnimationFrame(sheetOpenFrame);
  sheetOpenFrame = 0;
  clearTimeout(sheetCloseTimer);
  sheetTrigger = trigger ?? document.activeElement;
  sheetContent.innerHTML = detailHTML(app);
  sheet.setAttribute("aria-label", `${app.name} project details`);
  setPhoneLayersInert(true);
  sheetLayer.hidden = false;
  sheetOpenFrame = requestAnimationFrame(() => {
    sheetOpenFrame = 0;
    sheetLayer.classList.add("open");
  });
  sheetClose.focus();
}

function closeProjectSheet({ restoreFocus = true } = {}) {
  cancelAnimationFrame(sheetOpenFrame);
  sheetOpenFrame = 0;
  clearTimeout(sheetCloseTimer);
  if (sheetLayer.hidden) {
    setPhoneLayersInert(false);
    return;
  }
  sheetLayer.classList.remove("open");
  resetSheetDrag();
  const closeDelay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
  sheetCloseTimer = setTimeout(() => {
    sheetLayer.hidden = true;
    sheetLayer.classList.remove("open");
    setPhoneLayersInert(false);
    if (restoreFocus) sheetTrigger?.focus();
  }, closeDelay);
}

for (const app of APPS) {
  const btn = document.createElement("button");
  btn.className = "app-icon";
  btn.innerHTML = `${glyphHTML(app)}${app.name}`;
  btn.addEventListener("click", () => showApp(app, btn));
  grid.appendChild(btn);
}

// no-JS fallback also useful for SEO: render all details statically
$("#projects-fallback").innerHTML = APPS
  .map((a) => `<article class="app-detail project-detail">${detailHTML(a)}</article>`)
  .join("");

// ---- collage: all screenshots, interleaved across apps so projects mix ----
// 4 columns that drift at different speeds on scroll (Lummi-style)
{
  const withShots = APPS.filter((a) => a.screenshots?.length);
  const max = Math.max(...withShots.map((a) => a.screenshots.length));
  const imgs = [];
  for (let i = 0; i < max; i++)
    for (const a of withShots)
      if (a.screenshots[i])
        imgs.push(`
  <button class="collage-shot" data-app-id="${a.id}" type="button" aria-label="Open ${a.name} project details, screenshot ${i + 1} of ${a.screenshots.length}">
    <img src="assets/${a.id}/${a.screenshots[i]}" alt="${a.name} screenshot ${i + 1} of ${a.screenshots.length}" loading="lazy">
  </button>`);

  const collage = $("#collage");
  const N = 4;
  const cols = Array.from({ length: N }, () => {
    const c = document.createElement("div");
    c.className = "collage-col";
    collage.appendChild(c);
    return c;
  });
  imgs.forEach((html, i) => cols[i % N].insertAdjacentHTML("beforeend", html));

  collage.addEventListener("click", (event) => {
    const button = event.target.closest(".collage-shot");
    if (!button) return;
    showApp(APPS.find((app) => app.id === button.dataset.appId), button);
  });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // staggered scatter->sort as each image enters the viewport.
    // Observe the untransformed .collage-shot button, not the img: the img's
    // scatter transform displaces its bounding box, which would shift the
    // trigger point by the scatter offset itself. And no pre-trigger
    // rootMargin: the entrance must start in view, not finish off-screen.
    const revealShot = async (shot) => {
      const img = shot.querySelector("img");
      // A lazy image can intersect before its pixels are decoded. Starting the
      // transition then makes it finish invisibly and pop in already sorted.
      try { await img.decode(); } catch {}
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add("in")));
    };
    const imgIO = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { revealShot(e.target); imgIO.unobserve(e.target); }
    }, { threshold: 0.15 });
    collage.querySelectorAll(".collage-shot").forEach((shot, i) => {
      const img = shot.querySelector("img");
      // deterministic pseudo-random scatter: stable across loads
      img.style.setProperty("--sx", `${(Math.sin(i * 91) * 42).toFixed(1)}%`);
      img.style.setProperty("--sy", `${(Math.cos(i * 53) * 60 - 20).toFixed(1)}%`);
      img.style.setProperty("--sr", `${(Math.sin(i * 37) * 24).toFixed(1)}deg`);
      img.style.transitionDelay = `${(i % N) * 60}ms`;
      imgIO.observe(shot);
    });

    // drifting columns with inertia: lerp toward scroll-derived target
    const speeds = [-90, 60, -50, 80]; // max px drift per column, alternating direction
    const cur = [0, 0, 0, 0];
    let raf = 0;
    let lastY = scrollY;
    let vel = 0;
    const step = () => {
      vel += (scrollY - lastY - vel) * 0.12; // smoothed scroll velocity, px/frame
      lastY = scrollY;
      const skew = Math.max(-6, Math.min(6, vel * 0.06));
      const r = collage.getBoundingClientRect();
      // 0 when collage enters viewport bottom, 1 when it leaves the top
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      let settled = Math.abs(vel) < 0.05;
      cols.forEach((c, i) => {
        const target = (p - 0.5) * 2 * speeds[i];
        cur[i] += (target - cur[i]) * 0.07;
        if (Math.abs(target - cur[i]) > 0.1) settled = false;
        c.style.transform = `translateY(${cur[i]}px) skewY(${skew}deg)`;
      });
      raf = settled ? 0 : requestAnimationFrame(step);
      // rest upright once the loop stops
      if (!raf) cols.forEach((c, i) => { c.style.transform = `translateY(${cur[i]}px) skewY(0deg)`; });
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(step); };
    addEventListener("scroll", wake, { passive: true });
    wake();
  }
}

sheetClose.addEventListener("click", closeProjectSheet);
sheetBackdrop.addEventListener("click", closeProjectSheet);
document.addEventListener("keydown", (event) => {
  if (sheetLayer.hidden) return;
  if (event.key === "Escape") {
    closeProjectSheet();
    return;
  }
  if (event.key !== "Tab") return;
  const sheetFocusable = [...sheet.querySelectorAll("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])")]
    .filter((element) => !element.hidden);
  const first = sheetFocusable[0];
  const last = sheetFocusable.at(-1);
  if (!first) return;
  if (event.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
});

let dragStartY = 0;
let dragDistance = 0;
let dragPointerId = null;

function resetSheetDrag() {
  sheet.classList.remove("dragging");
  sheet.style.transform = "";
  dragStartY = 0;
  dragDistance = 0;
  dragPointerId = null;
}

function finishSheetDrag(event, { allowDismiss = false } = {}) {
  if (event.pointerId !== dragPointerId) return;
  const shouldDismiss = allowDismiss && dragDistance > 72;
  if (sheetHandle.hasPointerCapture(event.pointerId)) sheetHandle.releasePointerCapture(event.pointerId);
  resetSheetDrag();
  if (shouldDismiss) closeProjectSheet();
}

sheetHandle.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary) return;
  dragPointerId = event.pointerId;
  dragStartY = event.clientY;
  dragDistance = 0;
  sheetHandle.setPointerCapture(event.pointerId);
});
sheetHandle.addEventListener("pointermove", (event) => {
  if (event.pointerId !== dragPointerId || !sheetHandle.hasPointerCapture(event.pointerId)) return;
  dragDistance = Math.max(0, event.clientY - dragStartY);
  if (!dragDistance) return;
  sheet.classList.add("dragging");
  sheet.style.transform = `translateY(${dragDistance}px)`;
});
sheetHandle.addEventListener("pointerup", (event) => {
  finishSheetDrag(event, { allowDismiss: true });
});
sheetHandle.addEventListener("pointercancel", (event) => finishSheetDrag(event));
sheetHandle.addEventListener("lostpointercapture", (event) => finishSheetDrag(event));

// ---- scroll reveal (stagger siblings) ----
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.setProperty("--d", `${(i % 4) * 0.08}s`);
  io.observe(el);
});

// ---- two-way sync: page section -> phone screen ----
const SCREEN_FOR = { top: "home", projects: "projects", skills: "skills", experience: "experience", contact: "contact" };

function setScreen(name) {
  const projectsOpen = name === "projects";
  if (!projectsOpen) closeProjectSheet({ restoreFocus: false });
  if (!projectsOpen) {
    document.querySelectorAll(".pscreen").forEach((s) =>
      s.classList.toggle("active", s.dataset.screen === name));
  }
  drawer.classList.toggle("open", projectsOpen);
  openBtn.setAttribute("aria-expanded", projectsOpen);
  if (projectsOpen) showProjectHint();
}

const sectionIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && SCREEN_FOR[e.target.id]) setScreen(SCREEN_FOR[e.target.id]);
  }
}, { rootMargin: "-45% 0px -45% 0px" }); // fires when section crosses viewport center

document.querySelectorAll("main section[id]").forEach((s) => sectionIO.observe(s));
