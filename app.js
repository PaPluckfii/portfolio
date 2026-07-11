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
    id: "ifsta-sdk", name: "IFSTA Suite", letter: "13+", color: "#ba68c8",
    role: "Lead Developer · IFSTA / Oklahoma State", store: null,
    desc: "13+ companion apps built on a shared multi-module SDK distributed via GitHub Packages. Flagship Essentials 7th Edition reached 100K+ downloads with exam prep, audiobooks, identification modules, skill videos and firefighter-training course content.",
    stack: ["Kotlin", "GitHub Packages", "Clean Architecture", "SQLite"],
    metrics: [["100K+", "Essentials 7th Ed downloads"], ["70%", "dev time saved per app"], ["13+", "apps shipped"]],
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

// ---- two-way sync: page section -> phone screen ----
const SCREEN_FOR = { top: "home", projects: "projects", skills: "skills", experience: "experience", contact: "contact" };

function setScreen(name) {
  document.querySelectorAll(".pscreen").forEach((s) =>
    s.classList.toggle("active", s.dataset.screen === name));
  const projectsOpen = name === "projects";
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
