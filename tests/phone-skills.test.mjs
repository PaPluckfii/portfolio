import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
const skillsScreen = html.match(
  /<div class="pscreen" data-screen="skills">([\s\S]*?)<!-- keep in sync with #experience/
)?.[1] ?? "";

const labels = [
  "Kotlin",
  "Java",
  "Jetpack Compose",
  "Compose Multiplatform",
  "KMM",
  "Ktor",
  "MVVM",
  "MVI",
  "Clean Architecture",
  "Multi-module",
  "Room",
  "SQLDelight",
  "Retrofit",
  "Hilt / Koin",
  "Coroutines",
  "Firebase",
  "MCP",
  "Agentic Workflows",
];

const logoFiles = ["kotlin", "java", "compose", "ktor", "sqldelight", "firebase"];

test("phone Skills screen renders the complete local icon grid", () => {
  assert.match(skillsScreen, /class="pskills-grid"/);
  assert.equal(skillsScreen.match(/class="pskill"/g)?.length, labels.length);
  for (const label of labels) assert.ok(skillsScreen.includes(`>${label}</span>`), label);
  assert.doesNotMatch(skillsScreen, /https?:\/\//);
  for (const name of logoFiles) {
    assert.ok(existsSync(new URL(`../assets/skills/${name}.svg`, import.meta.url)), name);
  }
});

test("phone skill grid declares animation, fallback, and narrow layout hooks", () => {
  assert.match(css, /\.pskills-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.pskill-icon::after\s*\{[^}]*background-image:\s*var\(--skill-logo,\s*none\)/s);
  assert.match(css, /@keyframes pskillFloat/);
  assert.match(css, /@keyframes pskillSpotlight/);
  assert.match(css, /@media \(max-width:\s*860px\)[\s\S]*\.pscreen\[data-screen="skills"\] \.pskill-icon/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.pskill-label[\s\S]*animation:\s*none/);
});

test("narrow phone Skills screen reserves float clearance above the first row", () => {
  const topPadding = css.match(
    /@media \(max-width:\s*860px\)[\s\S]*?\.pscreen\[data-screen="skills"\] \.papp-body\s*\{\s*padding:\s*([\d.]+)px/s
  )?.[1];

  assert.ok(topPadding, "narrow Skills body top padding");
  assert.ok(Number(topPadding) >= 8, "narrow Skills body has at least 8px top clearance");
});
