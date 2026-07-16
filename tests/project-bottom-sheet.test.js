"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

function readApps() {
  const source = appJs.match(/const APPS = (\[[\s\S]*?\n\]);/)?.[1];
  assert.ok(source, "APPS array should remain extractable for the static fallback");
  return vm.runInNewContext(source);
}

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

test("drawer icons and screenshots route project identity to the same sheet", () => {
  assert.match(appJs, /btn\.addEventListener\("click", \(\) => showApp\(app, btn\)\)/);
  assert.match(appJs, /class="collage-shot" data-app-id="\$\{a\.id\}"/);
  assert.match(appJs, /collage\.addEventListener\("click", \(event\) =>/);
  assert.match(appJs, /showApp\(APPS\.find\(\(app\) => app\.id === button\.dataset\.appId\), button\)/);
  assert.match(appJs, /sheetContent\.innerHTML = detailHTML\(app\)/);
});

test("one close function owns every dismissal path and focus restoration", () => {
  assert.match(appJs, /function closeProjectSheet\(\{ restoreFocus = true \} = \{\}\)/);
  assert.match(appJs, /sheetClose\.addEventListener\("click", closeProjectSheet\)/);
  assert.match(appJs, /sheetBackdrop\.addEventListener\("click", closeProjectSheet\)/);
  assert.match(appJs, /event\.key === "Escape".*closeProjectSheet\(\)/s);
  assert.match(appJs, /dragDistance > 72.*closeProjectSheet\(\)/s);
  assert.match(appJs, /sheetTrigger\?\.focus\(\)/);
  assert.match(appJs, /setTimeout\(\(\) => \{\s*sheetLayer\.hidden = true;[\s\S]*?if \(restoreFocus\) sheetTrigger\?\.focus\(\);\s*\}, closeDelay\)/s);
});

test("repeated dismissal cancels the previous close completion", () => {
  assert.match(appJs, /function closeProjectSheet[\s\S]*?clearTimeout\(sheetCloseTimer\);[\s\S]*?sheetCloseTimer = setTimeout/);
});

test("pointer interruption paths share drag cleanup without dismissing", () => {
  assert.match(appJs, /function resetSheetDrag\(\)[\s\S]*?dragStartY = 0;[\s\S]*?dragDistance = 0;/);
  assert.match(appJs, /function finishSheetDrag\(event, \{ allowDismiss = false \} = \{\}\)/);
  assert.match(appJs, /pointerup[\s\S]*?finishSheetDrag\(event, \{ allowDismiss: true \}\)/);
  assert.match(appJs, /pointercancel[\s\S]*?finishSheetDrag\(event\)/);
  assert.match(appJs, /lostpointercapture[\s\S]*?finishSheetDrag\(event\)/);
  assert.match(appJs, /const shouldDismiss = allowDismiss && dragDistance > 72;/);
});

test("reduced motion skips the closing delay", () => {
  assert.match(appJs, /const closeDelay = matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches \? 0 : 300;/);
  assert.match(appJs, /\}, closeDelay\);/);
});

test("pending open frames are cancelled and cannot leave stale open state", () => {
  assert.match(appJs, /let sheetOpenFrame = 0;/);
  assert.match(appJs, /function showApp[\s\S]*?cancelAnimationFrame\(sheetOpenFrame\);[\s\S]*?sheetOpenFrame = requestAnimationFrame\(\(\) => \{\s*sheetOpenFrame = 0;\s*sheetLayer\.classList\.add\("open"\);\s*\}\)/);
  assert.match(appJs, /function closeProjectSheet[\s\S]*?cancelAnimationFrame\(sheetOpenFrame\);\s*sheetOpenFrame = 0;[\s\S]*?clearTimeout\(sheetCloseTimer\);/);
  assert.match(appJs, /sheetLayer\.hidden = true;\s*sheetLayer\.classList\.remove\("open"\);/);
});

test("project names, roles, and descriptions exist in HTML without running JavaScript", () => {
  const fallback = html.match(/<!-- generated by scripts\/generate-project-fallback\.js; do not edit -->([\s\S]*?)\n    <\/div>\n    <div class="collage[^\"]*"/)?.[1] ?? "";
  for (const app of readApps()) {
    assert.match(fallback, new RegExp(`<h3>${app.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/h3>`));
    assert.ok(fallback.includes(app.role), `missing static role for ${app.name}`);
    assert.ok(fallback.includes(app.desc), `missing static description for ${app.name}`);
  }
});

test("checked-in project fallback is synchronized with APPS and detailHTML", () => {
  assert.doesNotThrow(() => execFileSync(process.execPath, [path.join(root, "scripts/generate-project-fallback.js"), "--check"], {
    cwd: root,
    stdio: "pipe",
  }));
});

test("opening the modal isolates phone siblings and closing restores their inert state", () => {
  assert.match(appJs, /const sheetInertStates = new Map\(\);/);
  assert.match(appJs, /function setPhoneLayersInert\(inert\)[\s\S]*?sheetLayer\.parentElement\.children/);
  assert.match(appJs, /sheetInertStates\.set\(layer, layer\.inert\)[\s\S]*?layer\.inert = true/);
  assert.match(appJs, /layer\.inert = sheetInertStates\.get\(layer\)[\s\S]*?sheetInertStates\.clear\(\)/);
  assert.match(appJs, /function showApp[\s\S]*?setPhoneLayersInert\(true\)/);
  assert.match(appJs, /sheetLayer\.hidden = true;[\s\S]*?setPhoneLayersInert\(false\)/);
});

test("Tab and Shift+Tab remain inside the open project dialog", () => {
  assert.match(appJs, /const sheetFocusable = \[\.\.\.sheet\.querySelectorAll/);
  assert.match(appJs, /document\.addEventListener\("keydown"[\s\S]*?if \(sheetLayer\.hidden\) return;[\s\S]*?event\.key !== "Tab"/);
  assert.match(appJs, /event\.shiftKey[\s\S]*?last\.focus\(\)/);
  assert.match(appJs, /!event\.shiftKey[\s\S]*?first\.focus\(\)/);
  assert.match(appJs, /event\.preventDefault\(\)/);
});

test("swipe dismissal starts only from a touch-sized dedicated handle", () => {
  assert.match(html, /id="project-sheet-handle"[^>]*aria-hidden="true"/);
  assert.match(css, /\.project-sheet-handle\s*\{[^}]*width:\s*64px;[^}]*height:\s*44px;[^}]*touch-action:\s*none;/s);
  assert.match(appJs, /const sheetHandle = \$\("#project-sheet-handle"\)/);
  assert.match(appJs, /sheetHandle\.addEventListener\("pointerdown"/);
  assert.match(appJs, /sheetHandle\.setPointerCapture\(event\.pointerId\)/);
  assert.doesNotMatch(appJs, /sheet\.addEventListener\("pointerdown"/);
  assert.match(appJs, /dragDistance > 72/);
});

test("screenshot controls identify their app and stable ordinal", () => {
  assert.match(appJs, /screenshot \$\{i \+ 1\} of \$\{a\.screenshots\.length\}/);
  for (const app of readApps().filter((item) => item.screenshots?.length)) {
    assert.ok(app.screenshots.length > 0);
  }
});
