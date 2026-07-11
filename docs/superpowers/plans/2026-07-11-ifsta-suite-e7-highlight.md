# IFSTA Suite E7 Highlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the standalone Essentials 7th Edition app and highlight it inside IFSTA Suite.

**Architecture:** Edit only the `APPS` data array. Existing rendering automatically updates the drawer and project detail.

**Tech Stack:** Plain JavaScript

## Global Constraints

- Keep the combined entry named `IFSTA Suite` with its `13+` icon, role, suite-focused stack, and existing suite metrics.
- Make Essentials 7th Edition the flagship highlight.
- Do not change rendering logic, markup, CSS, or interactions.

---

### Task 1: Merge Essentials 7th Edition into IFSTA Suite

**Files:**
- Modify: `app.js:27-42`

**Interfaces:**
- Consumes: existing `APPS` array and data-driven renderer.
- Produces: four app entries with one combined `ifsta-sdk` entry.

- [ ] **Step 1: Confirm the current duplication**

Run:

```bash
rg -n 'ifsta-e7|ifsta-sdk|Essentials 7th Ed' app.js
```

Expected: separate `ifsta-e7` and `ifsta-sdk` objects are present.

- [ ] **Step 2: Replace both IFSTA objects with the combined entry**

Use this single object:

```js
{
  id: "ifsta-sdk", name: "IFSTA Suite", letter: "13+", color: "#ba68c8",
  role: "Lead Developer · IFSTA / Oklahoma State", store: null,
  desc: "13+ companion apps built on a shared multi-module SDK distributed via GitHub Packages. Flagship Essentials 7th Edition reached 100K+ downloads with exam prep, audiobooks, identification modules, skill videos and firefighter-training course content.",
  stack: ["Kotlin", "GitHub Packages", "Clean Architecture", "SQLite"],
  metrics: [["100K+", "Essentials 7th Ed downloads"], ["70%", "dev time saved per app"], ["13+", "apps shipped"]],
},
```

- [ ] **Step 3: Run static checks**

Run:

```bash
node --check app.js
git diff --check
```

Expected: both commands exit successfully with no output.

- [ ] **Step 4: Verify the generated data and live UI**

Reload `http://localhost:8080/#projects`. Expected: four app icons, no standalone Essentials 7th Ed icon, and IFSTA Suite shows the E7 description plus `100K+`, `70%`, and `13+` metrics.

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: highlight E7 in IFSTA Suite"
```
