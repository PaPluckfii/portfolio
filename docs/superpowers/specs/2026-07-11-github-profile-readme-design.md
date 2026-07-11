# GitHub Profile README Design

## Goal

Create a visually distinctive, recruiter-friendly GitHub profile README for Sumeet Das. The profile should feel like an Android product dashboard rather than a résumé template or an unstructured collection of badges.

## Approved Direction: Android Control Center

Translate the composition principles seen in polished Refero product interfaces into GitHub-compatible Markdown:

- Strong visual hierarchy instead of uniform sections.
- A restrained graphite, white, and Android-green palette.
- Clear cards and grouped information instead of long icon walls.
- Large identity statement followed immediately by proof.
- Consistent visual language across banners, badges, and statistics.

GitHub does not support arbitrary CSS in a profile README. The design will therefore use Markdown, limited HTML, tables, and hosted SVG services rather than pretending to reproduce a full web interface.

## Positioning

Present Sumeet as a Senior Android and Kotlin Multiplatform developer who builds scalable mobile products and reusable architecture.

Supporting proof:

- 4.8+ years of Android development experience.
- A KMM-to-Compose-Multiplatform migration with 70%+ shared code across Android and iOS.
- A shared multi-module SDK used across 13+ Android applications.
- 100K+ downloads for the flagship education application.
- A 70% reduction in development time across related applications.

## Page Composition

### 1. Cinematic Hero

A wide, dark visual header introduces `SUMEET DAS` and `ANDROID × KMP`. A restrained animated typing line communicates the role and current focus. Contact actions sit directly below it.

### 2. Impact Console

Three immediately visible metrics communicate scale:

- `100K+` downloads.
- `13+` Android applications.
- `70%+` shared cross-platform code.

Use a compact three-column table so the metrics read like dashboard cards while remaining responsive enough for GitHub.

### 3. Developer Signal

A short narrative explains the kind of problems Sumeet solves: Android architecture, multiplatform migration, reusable SDKs, and reliable product delivery. This replaces the generic “about me” bullet list.

### 4. Selected Releases

Show four compact product cards:

- Crypto exchange KMM-to-Compose-Multiplatform migration.
- Vantero multi-module Android application.
- Enterprise Android POS applications.
- Shared education SDK powering 13+ applications.

Each card contains the role, one-sentence outcome, and a focused technology line. Do not invent repository or product links.

### 5. Technology System

Group badges into intentional rows:

- Mobile: Kotlin, Java, Jetpack Compose, Compose Multiplatform, Android.
- Architecture: MVI, MVVM, Clean Architecture, multi-module systems.
- Platform and data: Ktor, Retrofit, Room, Firebase.
- Delivery and quality: GitHub Actions, JUnit, Espresso, Git.

Avoid outdated or weakly relevant tools from the existing profile.

### 6. Current Focus

A small status panel covers Compose Multiplatform, scalable architecture, performance, and agentic development workflows.

### 7. GitHub Activity

Use two theme-matched cards: overall statistics and top languages. These support the story and remain below the experience and project proof.

### 8. Contact Dock

Close with clear actions for email, GitHub, LinkedIn, Stack Overflow, and résumé. Correct the malformed LinkedIn URL and preserve the supplied Google Drive résumé URL. Omit a portfolio action because no verified public portfolio URL is present in the repository.

## Visual Rules

- Palette: dark graphite, off-white, and Android green `#3DDC84`.
- Use one coordinated badge style and one coordinated stats-card theme.
- Keep animation to the hero typing line and optional header treatment.
- Avoid visitor counters, trophy walls, motivational quotes, snake graphs, and decorative widgets without information value.
- Keep the document readable when third-party SVG services fail to load.
- Keep the result copy-ready as one Markdown file; do not require local image assets.

## Deliverable

Create `/Users/apple/AndroidStudioProjects/portfolio/GITHUB_PROFILE_README.md`. Do not overwrite the portfolio website or create links whose destinations are unknown.

## Acceptance Criteria

- The opening is visually distinctive and clearly identifies Android/KMP specialization.
- Three measurable outcomes appear directly below the hero.
- The layout resembles a cohesive product dashboard within GitHub Markdown constraints.
- The selected work and technology groups match evidence in the portfolio.
- Supplied contact destinations are valid and the LinkedIn URL is corrected.
- The README remains useful if dynamic images are unavailable.
- No placeholders, invented links, or unsupported styling remain.
