"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");
const skoolos = appJs.match(/\{\n\s+id: "skoolos"[\s\S]*?\n\s+\},/)?.[0];

test("defines the SkoolOS app with verified portfolio content", () => {
  assert.ok(skoolos, "missing SkoolOS app data");
  assert.match(skoolos, /name: "SkoolOS"/);
  assert.match(skoolos, /role: "Independent Product · Kotlin Multiplatform"/);
  assert.match(skoolos, /stack: \["Kotlin", "Compose Multiplatform", "Ktor", "PostgreSQL", "whisper\.cpp"\]/);
});

test("stores the official SkoolOS icon locally", () => {
  const icon = skoolos.match(/icon: "([^"]+)"/)?.[1];
  assert.equal(icon, "assets/skoolos/icon.png");
  assert.equal(fs.existsSync(path.join(root, icon)), true, `missing ${icon}`);
  assert.doesNotMatch(icon, /^https?:\/\//);
});

test("uses three or four local SkoolOS wireframe screenshots", () => {
  const configured = skoolos.match(/screenshots: \[([^\]]+)\]/)?.[1] ?? "";
  const screenshots = [...configured.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  assert.ok(screenshots.length >= 3 && screenshots.length <= 4, `expected 3–4 screenshots, found ${screenshots.length}`);

  for (const screenshot of screenshots) {
    assert.doesNotMatch(screenshot, /^https?:\/\//, `${screenshot} must be local`);
    assert.equal(screenshot.includes("/"), false, `${screenshot} must not point at another project's directory`);

    const localPath = path.join("assets", "skoolos", screenshot);
    assert.equal(fs.existsSync(path.join(root, localPath)), true, `missing ${localPath}`);
    assert.equal(localPath.startsWith(path.join("assets", "skoolos") + path.sep), true);
  }
});

test("does not configure external SkoolOS images", () => {
  assert.doesNotMatch(skoolos, /(?:icon|screenshots):[^\n]*https?:\/\//);
});
