"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

test("collage images enter scattered (translate + rotate vars), not fade-up", () => {
  assert.match(css, /body\.js \.collage img \{[^}]*translate\(var\(--sx\), var\(--sy\)\) rotate\(var\(--sr\)\) scale\(1\.05\)/);
  assert.doesNotMatch(css, /body\.js \.collage img \{[^}]*translateY\(28px\) scale\(\.96\)/);
});

test("scatter offsets are set per image, deterministically from index", () => {
  const collage = appJs.slice(appJs.indexOf("---- collage"));
  assert.match(collage, /--sx/);
  assert.match(collage, /--sy/);
  assert.match(collage, /--sr/);
  assert.match(collage, /Math\.(sin|cos)\(/);
  assert.doesNotMatch(collage, /Math\.random/);
});

test("reveal triggers on the untransformed slot, only when actually visible", () => {
  const collage = appJs.slice(appJs.indexOf("---- collage"));
  // observe the stable parent button: the img's own scatter transform shifts
  // its bounding box and would corrupt the trigger point
  assert.match(collage, /querySelectorAll\("\.collage-shot"\)/);
  assert.match(collage, /imgIO\.observe\(shot\)/);
  // no pre-trigger margin: the entrance must be seen, not pre-completed off-screen
  assert.doesNotMatch(collage, /rootMargin: "0px 0px 30% 0px"/);
  assert.match(collage, /threshold: 0\.15/);
});

test("reveal waits for lazy image pixels and paints the scatter state first", () => {
  const collage = appJs.slice(appJs.indexOf("---- collage"));
  const decode = collage.indexOf("await img.decode()");
  const reveal = collage.indexOf('img.classList.add("in")');
  assert.ok(decode !== -1 && decode < reveal);
  assert.match(collage, /requestAnimationFrame\(\(\) => requestAnimationFrame\(\(\) => img\.classList\.add\("in"\)\)\)/);
});

test("column drift transform includes velocity-driven skewY clamped to ±6deg", () => {
  const collage = appJs.slice(appJs.indexOf("---- collage"));
  assert.match(collage, /skewY\(/);
  assert.match(collage, /Math\.max\(-6, Math\.min\(6,/);
  // smoothed velocity, not raw delta
  assert.match(collage, /vel \+= \(.+- vel\) \* /);
  // columns rest upright when settled
  assert.match(collage, /skewY\(0deg\)/);
});

test("reduced motion keeps collage images visible and static", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*body\.js \.collage img \{ opacity: 1; transform: none; transition: none; \}/);
});
