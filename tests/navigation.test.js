"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

test("brand links home without changing its appearance", () => {
  assert.match(html, /<a class="nav-brand" href="#top">sumeet\.das<\/a>/);
  assert.match(css, /\.nav-brand\s*\{[^}]*text-decoration:\s*none;/);
});
