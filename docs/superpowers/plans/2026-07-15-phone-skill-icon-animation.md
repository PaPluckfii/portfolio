# Phone Skill Icon Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the phone Skills screen's static text chips with an animated, accessible three-column grid covering all 18 existing skills.

**Architecture:** Keep the feature entirely in the existing static HTML/CSS surface. `index.html` owns the semantic skill inventory, `style.css` owns the floating and spotlight loops, and six local SVG files provide recognizable brand marks while every tile retains a text monogram fallback. A dependency-free Node test checks inventory, asset locality, layout hooks, animation hooks, and reduced-motion coverage.

**Tech Stack:** HTML5, CSS animations, local SVG assets, Node.js built-in `node:test` and `node:assert`.

## Global Constraints

- Modify only the phone screen identified by `.pscreen[data-screen="skills"]`; the full-size `#skills` groups remain unchanged.
- Preserve exactly these 18 visible labels: Kotlin, Java, Jetpack Compose, Compose Multiplatform, KMM, Ktor, MVVM, MVI, Clean Architecture, Multi-module, Room, SQLDelight, Retrofit, Hilt / Koin, Coroutines, Firebase, MCP, Agentic Workflows.
- Use local recognizable SVG marks for Kotlin, Java, Jetpack Compose, Compose Multiplatform, KMM, Ktor, SQLDelight, and Firebase; Compose Multiplatform reuses the Compose mark and KMM reuses the Kotlin mark.
- Use monogram icons for MVVM, MVI, Clean Architecture, Multi-module, Room, Retrofit, Hilt / Koin, Coroutines, MCP, and Agentic Workflows.
- Use CSS-only floating and rotating-label spotlight motion; do not modify `app.js` or add an animation library.
- Keep three columns at desktop and narrow-phone sizes with no horizontal scrolling.
- Keep every label visible throughout the spotlight loop.
- A missing decorative logo must reveal the existing monogram without a broken-image indicator.
- Under `prefers-reduced-motion: reduce`, the grid is static and every label has equal readable emphasis.
- Preserve the existing phone-screen crossfade and project drawer behavior.
- Do not add runtime CDN requests or new package dependencies.

---

### Task 1: Build and verify the animated phone skill grid

**Files:**
- Create: `tests/phone-skills.test.mjs`
- Create: `assets/skills/kotlin.svg`
- Create: `assets/skills/java.svg`
- Create: `assets/skills/compose.svg`
- Create: `assets/skills/ktor.svg`
- Create: `assets/skills/sqldelight.svg`
- Create: `assets/skills/firebase.svg`
- Modify: `index.html:115-126`
- Modify: `style.css:175-183`
- Modify: `style.css:289-316`
- Do not modify: `app.js`

**Interfaces:**
- Consumes: the existing `.pscreen[data-screen="skills"]`, `.papp-bar`, `.papp-body`, phone crossfade, and narrow-phone `@media (max-width: 860px)` rules.
- Produces: `.pskills-grid`, 18 `.pskill` items, `.pskill-icon`, `.pskill-mark`, `.pskill-label`, `--skill-logo`, `--float-delay`, and `--spot-delay` for CSS styling and static verification.

- [ ] **Step 1: Write the failing dependency-free structure test**

Create `tests/phone-skills.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test and verify the RED state**

Run:

```bash
node --test tests/phone-skills.test.mjs
```

Expected: both tests fail because `.pskills-grid`, `.pskill`, the SVG assets, and the new animation rules do not exist yet.

- [ ] **Step 3: Download the six local SVG assets from their upstream repositories**

Run:

```bash
mkdir -p assets/skills
curl --fail --location --silent --show-error https://raw.githubusercontent.com/devicons/devicon/master/icons/kotlin/kotlin-original.svg --output assets/skills/kotlin.svg
curl --fail --location --silent --show-error https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg --output assets/skills/java.svg
curl --fail --location --silent --show-error https://raw.githubusercontent.com/devicons/devicon/master/icons/jetpackcompose/jetpackcompose-original.svg --output assets/skills/compose.svg
curl --fail --location --silent --show-error https://raw.githubusercontent.com/devicons/devicon/master/icons/ktor/ktor-original.svg --output assets/skills/ktor.svg
curl --fail --location --silent --show-error https://raw.githubusercontent.com/cashapp/sqldelight/master/docs/images/icon-sqldelight.svg --output assets/skills/sqldelight.svg
curl --fail --location --silent --show-error https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-original.svg --output assets/skills/firebase.svg
```

Expected: all commands exit 0 and `find assets/skills -name '*.svg' | wc -l` prints `6`.

- [ ] **Step 4: Replace only the phone Skills chip cloud with the semantic 18-tile grid**

Replace `index.html:119-124` with:

```html
            <div class="pskills-grid" aria-label="Technology skills">
              <div class="pskill" style="--skill-logo:url('assets/skills/kotlin.svg');--float-delay:-.18s;--spot-delay:0s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">K</span></span><span class="pskill-label">Kotlin</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/java.svg');--float-delay:-.71s;--spot-delay:0s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">J</span></span><span class="pskill-label">Java</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/compose.svg');--float-delay:-1.34s;--spot-delay:0s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">JC</span></span><span class="pskill-label">Jetpack Compose</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/compose.svg');--float-delay:-1.89s;--spot-delay:-1.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">CMP</span></span><span class="pskill-label">Compose Multiplatform</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/kotlin.svg');--float-delay:-2.43s;--spot-delay:-1.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">KMM</span></span><span class="pskill-label">KMM</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/ktor.svg');--float-delay:-2.91s;--spot-delay:-1.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">KT</span></span><span class="pskill-label">Ktor</span></div>
              <div class="pskill" style="--float-delay:-.42s;--spot-delay:-3s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">MVVM</span></span><span class="pskill-label">MVVM</span></div>
              <div class="pskill" style="--float-delay:-1.02s;--spot-delay:-3s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">MVI</span></span><span class="pskill-label">MVI</span></div>
              <div class="pskill" style="--float-delay:-1.62s;--spot-delay:-3s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">CA</span></span><span class="pskill-label">Clean Architecture</span></div>
              <div class="pskill" style="--float-delay:-2.22s;--spot-delay:-4.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">MM</span></span><span class="pskill-label">Multi-module</span></div>
              <div class="pskill" style="--float-delay:-2.76s;--spot-delay:-4.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">DB</span></span><span class="pskill-label">Room</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/sqldelight.svg');--float-delay:-.27s;--spot-delay:-4.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">SQLD</span></span><span class="pskill-label">SQLDelight</span></div>
              <div class="pskill" style="--float-delay:-.86s;--spot-delay:-6s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">RF</span></span><span class="pskill-label">Retrofit</span></div>
              <div class="pskill" style="--float-delay:-1.48s;--spot-delay:-6s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">H/K</span></span><span class="pskill-label">Hilt / Koin</span></div>
              <div class="pskill" style="--float-delay:-2.04s;--spot-delay:-6s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">CO</span></span><span class="pskill-label">Coroutines</span></div>
              <div class="pskill" style="--skill-logo:url('assets/skills/firebase.svg');--float-delay:-2.58s;--spot-delay:-7.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">FB</span></span><span class="pskill-label">Firebase</span></div>
              <div class="pskill" style="--float-delay:-3.08s;--spot-delay:-7.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">MCP</span></span><span class="pskill-label">MCP</span></div>
              <div class="pskill" style="--float-delay:-1.17s;--spot-delay:-7.5s"><span class="pskill-icon" aria-hidden="true"><span class="pskill-mark">AI</span></span><span class="pskill-label">Agentic Workflows</span></div>
            </div>
```

- [ ] **Step 5: Add the grid, fallback, float, spotlight, responsive, and reduced-motion CSS**

Replace the two `.pchips` rules at `style.css:181-182` with:

```css
.pskills-grid {
  width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  align-content: start; gap: 12px 6px;
}
.pskill {
  min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px;
  text-align: center; animation: pskillFloat 3.4s ease-in-out infinite;
  animation-delay: var(--float-delay, 0s);
}
.pskill-icon {
  position: relative; width: 46px; height: 46px; display: grid; place-items: center;
  overflow: hidden; border: 1px solid #ffffff24; border-radius: 14px;
  background: #101b24cc; box-shadow: 0 7px 16px #0005;
}
.pskill-icon::after {
  content: ""; position: absolute; inset: 8px; background-image: var(--skill-logo, none);
  background-position: center; background-repeat: no-repeat; background-size: contain;
}
.pskill-mark { color: #8de8b8; font-size: 9px; font-weight: 700; letter-spacing: -.02em; }
.pskill-label {
  min-height: 18px; display: grid; place-items: start center; color: #ffffff80;
  font-size: 8px; line-height: 1.1; animation: pskillSpotlight 9s linear infinite;
  animation-delay: var(--spot-delay, 0s);
}
@keyframes pskillFloat {
  0%, 100% { transform: translateY(0) rotate(-1.5deg); }
  50% { transform: translateY(-7px) rotate(1.5deg); }
}
@keyframes pskillSpotlight {
  0%, 14% { color: #8de8b8; opacity: 1; }
  20%, 100% { color: #fff; opacity: .42; }
}
```

Add these declarations to the existing `@media (prefers-reduced-motion: reduce)` block at `style.css:289-294`:

```css
  .pskill { animation: none; transform: none; }
  .pskill-label { animation: none; color: #fffe; opacity: 1; }
```

Add these declarations inside the existing `@media (max-width: 860px)` block after `.phone-wrap .phone`:

```css
  .pscreen[data-screen="skills"] .papp-body { padding: 6px 7px; }
  .pscreen[data-screen="skills"] .pskills-grid { gap: 4px 2px; }
  .pscreen[data-screen="skills"] .pskill { gap: 1px; }
  .pscreen[data-screen="skills"] .pskill-icon { width: 24px; height: 24px; border-radius: 7px; box-shadow: none; }
  .pscreen[data-screen="skills"] .pskill-icon::after { inset: 4px; }
  .pscreen[data-screen="skills"] .pskill-mark { font-size: 5px; }
  .pscreen[data-screen="skills"] .pskill-label { min-height: 10px; font-size: 5px; line-height: 1; }
```

- [ ] **Step 6: Run the focused test and verify the GREEN state**

Run:

```bash
node --test tests/phone-skills.test.mjs
```

Expected: `2` tests pass, `0` fail, with no warnings.

- [ ] **Step 7: Run static verification**

Run:

```bash
git diff --check
test "$(rg -o 'class="pskill"' index.html | wc -l | tr -d ' ')" = 18
test "$(find assets/skills -maxdepth 1 -name '*.svg' | wc -l | tr -d ' ')" = 6
git diff --name-only | rg '^app\.js$' && exit 1 || true
```

Expected: every command exits 0; the final command prints nothing because `app.js` was not changed by this task.

- [ ] **Step 8: Verify the live layout and motion**

Run:

```bash
python3 -m http.server 8081
```

Open `http://localhost:8081/#skills` and verify:

- At `953x998`, all 18 tiles fit in three columns and the full-size left skill cards are unchanged.
- Each tile floats without clipping; spotlight emphasis rotates by three-skill rows while every label remains visible.
- At `390x844`, the mini phone still shows three columns without horizontal overflow.
- With reduced motion enabled, tiles and labels remain static and equally emphasized.
- Scrolling away from and back to `#skills` preserves the existing phone crossfade.

Stop the server with `Ctrl-C` after verification.

- [ ] **Step 9: Commit the implementation**

```bash
git add tests/phone-skills.test.mjs assets/skills
git add -p index.html style.css
git diff --cached --check
git diff --cached -- index.html style.css
git commit -m "feat: animate phone skill icons"
```

At each `git add -p` prompt, stage only hunks containing `.pskills-grid`,
`.pskill`, `.pskill-icon`, `.pskill-mark`, `.pskill-label`, `pskillFloat`, or
`pskillSpotlight`. Leave every pre-existing unrelated hunk unstaged. Before
committing, the cached diff must contain the phone Skills markup and its CSS,
but none of the pre-existing collage, project drawer, contact, footer, tilt, or
experience edits.
