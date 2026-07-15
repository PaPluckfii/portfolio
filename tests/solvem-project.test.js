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
