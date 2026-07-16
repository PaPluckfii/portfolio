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
  assert.doesNotMatch(appJs, /#app-detail/);
  assert.match(appJs, /<article class="app-detail project-detail">/);
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
