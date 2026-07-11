# GitHub Profile README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a copy-ready GitHub profile README that presents Sumeet Das through a cohesive Android Control Center visual identity.

**Architecture:** Build one standalone GitHub-flavored Markdown document using limited alignment HTML, hosted SVG header components, shields.io badges, and themed GitHub statistics. Preserve meaningful text outside dynamic images so the profile remains useful if third-party image services are unavailable.

**Tech Stack:** GitHub Flavored Markdown, HTML, SVG image services, shields.io, GitHub Readme Stats

## Global Constraints

- Create `/Users/apple/AndroidStudioProjects/portfolio/GITHUB_PROFILE_README.md` only.
- Use dark graphite, off-white, and Android green `#3DDC84` consistently.
- Do not require local image assets.
- Do not invent repository, product, or portfolio links.
- Preserve the supplied Google Drive résumé destination.
- Use `https://linkedin.com/in/sumeetdas1996` as the corrected LinkedIn destination.
- Keep all career claims consistent with the approved design specification.
- Avoid visitor counters, trophy walls, motivational quotes, snake graphs, and decorative widgets without information value.

---

### Task 1: Build and Validate the Android Control Center README

**Files:**
- Create: `/Users/apple/AndroidStudioProjects/portfolio/GITHUB_PROFILE_README.md`
- Reference: `/Users/apple/AndroidStudioProjects/portfolio/docs/superpowers/specs/2026-07-11-github-profile-readme-design.md`

**Interfaces:**
- Consumes: Approved profile claims and public contact destinations from the design specification.
- Produces: A standalone README that can be copied to the `PaPluckfii/PaPluckfii` profile repository.

- [ ] **Step 1: Create the complete Markdown profile**

Create the file with these sections and exact content requirements:

1. A centered Capsule Render hero labeled `SUMEET DAS` and `ANDROID × KOTLIN MULTIPLATFORM`, using `101418`, `17211D`, and `3DDC84`.
2. A centered typing SVG with these lines: “Building mobile products that scale.”, “Turning complex Android systems into clean architecture.”, and “Sharing experiences across Android × iOS.”
3. Email, LinkedIn, and résumé call-to-action badges.
4. `impact.console`: a centered three-column table for `100K+`, `13+`, and `70%+`.
5. `developer.signal`: the approved senior Android/KMP summary plus a small Kotlin `MobileEngineer` identity snippet.
6. `selected.releases`: four rows for the crypto exchange migration, Vantero, enterprise POS, and the education platform.
7. `technology.system`: graphite-and-green shields.io badges grouped into Mobile, Architecture & Data, and Delivery & Quality.
8. `current.focus`: a monospace NOW/NEXT/ALSO block covering Compose Multiplatform, delivery automation, agentic workflows, MCP, and developer tooling.
9. `github.telemetry`: matched dark GitHub stats and top-languages cards for `PaPluckfii`.
10. A contact footer linking email, LinkedIn, Stack Overflow, and the supplied résumé.

Use the exact claims and URLs from the approved design specification. Do not add a public portfolio button because no verified public portfolio URL exists in the repository.

- [ ] **Step 2: Verify the document has no placeholders or malformed destinations**

Run:

```bash
rg -n 'TBD|TODO|your-username|example\.com|www\.linkedin\.com/in/www' GITHUB_PROFILE_README.md
```

Expected: no output and exit status `1`.

- [ ] **Step 3: Verify required identity, proof, and links are present**

Run:

```bash
for term in 'SUMEET%20DAS' '100K+' '13+' '70%+' 'PaPluckfii' 'sumeetdas1996' '15420804/sumeet-das' '1k2j5Pd_lu4rKK5k8Kx-tWNMldzEtZMZ1'; do rg -Fq "$term" GITHUB_PROFILE_README.md || exit 1; done
```

Expected: no output and exit status `0`.

- [ ] **Step 4: Verify Markdown fences and HTML divs are balanced**

Run:

```bash
test "$(rg -c '^\`\`\`' GITHUB_PROFILE_README.md)" -eq 4
test "$(rg -o '<div' GITHUB_PROFILE_README.md | wc -l | tr -d ' ')" -eq "$(rg -o '</div>' GITHUB_PROFILE_README.md | wc -l | tr -d ' ')"
```

Expected: no output and exit status `0`.

- [ ] **Step 5: Review the final diff and commit only the deliverable**

Run:

```bash
git diff --check -- GITHUB_PROFILE_README.md
git diff -- GITHUB_PROFILE_README.md
git add GITHUB_PROFILE_README.md
git commit -m "feat: add Android Control Center profile README"
```

Expected: `git diff --check` emits no output; the diff contains only the new profile Markdown; the commit succeeds.

