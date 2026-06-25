# Installation & Deployment

This is the living install / deploy runbook for the Crayhill rebrand. It grows with the project — every change that adds a dependency, env var, build step, or system requirement updates this file in the same commit.

> **Status (current):** Frontend scaffold (React + Vite + TS + Tailwind v4 + React Router + brand type scale with both fonts live — Montserrat self-hosted via `@fontsource`, New Science via Adobe Fonts / Typekit + global `TopNav`) + PHP API (`GET /api/v1/health`, `GET /api/v1/news`, `GET /api/v1/careers`) + MariaDB schema `crayhill` with least-privilege app user `crayhill_app` and seeded `news` / `careers` tables on RDS + designer-delivered brand assets staged in `assets/` and served via Vite's `publicDir`. **News & Insights** and **Careers** are DB-backed via TanStack Query + the typed client in `frontend/src/api/`. The static frontend `dist/` is deployed to an Amazon Linux 2023 EC2 instance and served over plain HTTP by Apache (see "EC2 deployment"). **PHP-FPM + `/api` routing is scripted** (`scripts/setup-api-ec2.sh`) but must be run once on the box — until then Apache's SPA `FallbackResource` serves `index.html` for `/api/v1/*` and those pages show no data. HTTPS (certbot) is still pending.

---

## Overview

The project is a **rebrand of crayhill.com** for Crayhill Capital Management. Architecture:

```
React SPA (frontend/)  ──HTTPS / JSON──▶  PHP API (api/)  ──PDO──▶  MariaDB on RDS
```

The React app is a single-page app. News, Careers, and future CMS-backed content load from the PHP API at `/api/v1/*`. Static marketing copy lives inline in page components until it moves to the DB.

---

## System requirements

### Local development

| Tool                  | Version            | Notes                                                                                       |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| Node                  | **22 LTS** (or 20 LTS) | The project also runs on Node 25, but EC2 deploys target LTS — develop on LTS to match. |
| npm                   | 10.x or newer      | Ships with Node.                                                                            |
| **PHP**               | **8.3.x**          | Match Amazon Linux 2023's bundled PHP. Required: `pdo`, `pdo_mysql`, `json`, `mbstring`, `openssl` (all ship with the standard build). |
| git                   | any recent version | For version control.                                                                        |

#### Installing PHP on macOS via Homebrew

```sh
brew install php@8.3
```

`php@8.3` is keg-only in brew (it isn't the default `php`), so the binary lives at `/opt/homebrew/opt/php@8.3/bin/php`. Either reference the full path or add it to your shell's PATH:

```sh
echo 'export PATH="/opt/homebrew/opt/php@8.3/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
php --version   # should report PHP 8.3.x
```

### Production (planned: AWS EC2)

To be filled in when the EC2 setup is provisioned. Will cover OS (Amazon Linux 2023 or Ubuntu LTS), Nginx/Apache, PHP-FPM, certbot, and the MariaDB client. Until then, do not assume any production runtime exists.

---

## Local development setup

### 1. Clone

```sh
git clone <repo-url> crayhillRebrand
cd crayhillRebrand
```

### 2. Set up secrets

All secrets (DB credentials, API keys, etc.) live in `.config/secrets.env`, which is gitignored. Copy the committed template and fill in real values:

```sh
cp .config/secrets.env.example .config/secrets.env
# then open .config/secrets.env and fill in real values
```

> **Note:** The secrets file is required by the PHP API. The frontend does not read from it. For a frontend-only checkout you can skip this step.

### 3. Install and run the frontend

```sh
cd frontend
npm install
npm run dev
```

Vite will print a URL, typically `http://localhost:5173/` (occasionally `5174` if 5173 is held by a stale process). Open it in a browser.

### 4. Run the PHP API (separate terminal)

```sh
# from the repo root
php -S 127.0.0.1:8000 -t api
# or with the full brew path if PHP isn't on your PATH:
/opt/homebrew/opt/php@8.3/bin/php -S 127.0.0.1:8000 -t api
```

Then verify the chain:

```sh
curl -s http://127.0.0.1:8000/v1/health.php | jq
```

Expected response (DB connectivity may vary depending on your network — see Troubleshooting):

```json
{
  "data": {
    "status": "ok",
    "app_env": "development",
    "php_version": "8.3.30",
    "database": { "connected": true, "selected_schema": null, "error": null }
  },
  "error": null,
  "meta": null
}
```

> **URL note for local vs. production:** PHP's built-in dev server serves files directly from `api/`, so the local URL is `/v1/health.php`. In production behind Nginx/Apache, the path will be rewritten to the canonical `/api/v1/health` form (no `.php` extension, with `/api` prefix). The frontend's API client targets the canonical `/api/v1/...` form and relies on `VITE_API_BASE_URL` to differentiate environments.

> **Frontend ↔ API in dev:** the Vite dev server proxies `/api` to the local PHP server (`http://127.0.0.1:8000`), rewriting the clean URL `/api/v1/<name>` to the file it serves (`/v1/<name>.php`) — see `server.proxy` in `frontend/vite.config.ts`. **Both processes must be running** for News & Insights and Careers to load data:
>
> ```sh
> # Terminal 1 — frontend (from frontend/)
> npm run dev
>
> # Terminal 2 — PHP API (from frontend/, or repo root)
> npm run dev:api
> ```
>
> `npm run dev:api` runs `scripts/dev-api.sh`, which starts `php -S 127.0.0.1:8000 -t api`. RDS must be reachable from your machine (see "AWS RDS access for local development"). If only `npm run dev` is running, Vite logs `[vite] http proxy error: /v1/news.php ECONNREFUSED` and those pages show loading/error states.

### Frontend scripts

| Command          | What it does                                                         |
| ---------------- | -------------------------------------------------------------------- |
| `npm run dev`    | Starts Vite dev server with HMR (hot module replacement).            |
| `npm run dev:api`| Starts the local PHP API on `127.0.0.1:8000` (run alongside `dev`). |
| `npm run build`  | Type-checks (`tsc -b`) then produces a production bundle in `dist/`. |
| `npm run preview`| Serves the production `dist/` locally for a sanity check.            |
| `npm run lint`   | Runs ESLint over the project.                                        |

### Frontend stack as installed

| Package                       | Version (lockfile) | Purpose                                  |
| ----------------------------- | ------------------ | ---------------------------------------- |
| `react`                       | 19.2.x             | UI runtime                               |
| `react-dom`                   | 19.2.x             | DOM renderer                             |
| `vite`                        | 8.0.x              | Dev server + bundler                     |
| `@vitejs/plugin-react`        | 6.0.x              | React plugin for Vite                    |
| `tailwindcss`                 | 4.2.x              | Styling (utility-first, CSS-first config) |
| `@tailwindcss/vite`           | 4.2.x              | Tailwind's Vite plugin                   |
| `react-router-dom`            | 7.14.x             | Client-side routing                      |
| `@tanstack/react-query`       | 5.101.x            | Server-state fetching/caching for API data (News & Insights and future endpoints). Provider in `frontend/src/App.tsx`. |
| `react-markdown`              | 10.1.x             | Renders Markdown article bodies on the news detail page. |
| `remark-gfm`                  | 4.0.x              | GitHub-flavored-Markdown plugin for `react-markdown` (tables, autolinks). |
| `@fontsource/montserrat`      | latest             | Self-hosted Montserrat woff2 (regular + semi-bold + italics). See **Typography / Fonts** below. |
| `typescript`                  | 6.0.x              | Type checking                            |
| `eslint` + plugins            | 10.x               | Linting                                  |
| `@types/node`, `@types/react` | latest             | Type definitions                         |

Versions reflect what was installed at scaffold time. Check `frontend/package-lock.json` for exact resolved versions.

### Path alias

The frontend uses an `@/` alias for `src/`. Imports look like:

```ts
import { App } from '@/App'
import '@/styles/global.css'
```

Configured in `frontend/vite.config.ts` and `frontend/tsconfig.app.json`. Don't use deep relative imports (`../../../...`) — use the alias.

### Styling: Tailwind CSS v4

Tailwind v4 uses a **CSS-first config** — there is no `tailwind.config.js`/`.ts` file. Theme tokens live in a `@theme {}` block at the top of `frontend/src/styles/global.css`:

```css
@import 'tailwindcss';

@theme {
  --color-ink: #111;
  --color-paper: #fafaf7;
  --font-sans: 'Montserrat', system-ui, sans-serif;
  --font-display: 'new-science', 'Montserrat', system-ui, sans-serif;
  /* ... */
}
```

Tokens defined in `@theme` are auto-exposed as utility classes by name:
- `--color-paper` → `bg-paper`, `text-paper`, `border-paper`, etc.
- `--font-sans` → `font-sans` (body / UI text — Montserrat, self-hosted via `@fontsource`).
- `--font-display` → `font-display` (headlines, H1-H4 — New Science via Adobe Fonts / Typekit, with Montserrat fallback).

Spacing, sizing, gap, max-w, etc. utilities come from Tailwind's defaults; we'll add custom theme values when the design system calls for them. Color tokens are still **placeholders** — they will be replaced with real values from the designer's spec in a follow-up phase.

Base typography (heading fonts, body color, link styles) is set via `@layer base { ... }` in the same file rather than inline classes, since those are global concerns. JSX should use Tailwind utilities for everything else.

### Typography / Fonts

The site uses two type roles:

| Role | Token | Used by | Source |
| --- | --- | --- | --- |
| Body / UI | `--font-sans` (`font-sans`) | `body`, paragraphs, buttons, navigation, `h5` | **Self-hosted** via `@fontsource/montserrat`. Montserrat 400 + 600 + 400/600 italics. Open-source SIL OFL. |
| Display / headline | `--font-display` (`font-display`) | `h1`, `h2`, `h3`, `h4` | **Adobe Fonts / Typekit** (kit `snm7qqk`). New Science weights 100, 300, 400, 500, 600, 700 — upright only, no italics. Commercially licensed. |

#### Montserrat — self-hosted via `@fontsource`

Loaded via `@fontsource/montserrat`, served from our own origin — there is no third-party CDN call (no Google Fonts request, no privacy/GDPR concern, no DNS dependency for the visitor). This is the right channel for Montserrat because it's open-source (SIL OFL) and `@fontsource` packages it cleanly for npm consumption. Each weight + style is imported explicitly from `frontend/src/main.tsx`:

```ts
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/400-italic.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/600-italic.css'
```

Each `*.css` file declares one `@font-face` per Unicode subset (latin, latin-ext, cyrillic, vietnamese, …), each tagged with `unicode-range`. Browsers fetch only the subsets the rendered page actually uses — for an English-only site, that's the `latin` slice (≈19 KB woff2 per weight). All variants ship with `font-display: swap` so text is never invisible while a font loads.

**Adding a new Montserrat weight** is a two-step change in the same commit:
1. Add the import line in `frontend/src/main.tsx` (e.g. `import '@fontsource/montserrat/500.css'`).
2. If the new weight should be globally referenced (not just opt-in via inline class), update `@layer base` in `frontend/src/styles/global.css`.

Don't import a weight you aren't using — every import is bytes shipped to the visitor.

#### New Science — Adobe Fonts / Typekit

New Science is a commercially licensed display face. Adobe Fonts (Typekit) is the licensed distribution channel — the project's Creative Cloud subscription covers webfont serving, and Adobe hosts/serves the files from `use.typekit.net`.

**How it's wired:**

The kit is referenced by a single `<link>` in `frontend/index.html`, alongside two `preconnect` hints that warm the TCP+TLS handshake to Adobe's font CDN before the stylesheet is even requested:

```html
<link rel="preconnect" href="https://use.typekit.net" crossorigin />
<link rel="preconnect" href="https://p.typekit.net" crossorigin />
<link rel="stylesheet" href="https://use.typekit.net/snm7qqk.css" />
```

That stylesheet declares one `@font-face` per New Science weight, family name `new-science` (lowercase, kebab-case — Adobe's convention). The `--font-display` token in `frontend/src/styles/global.css` puts `'new-science'` at the head of the stack, with Montserrat next so headlines stay visually coherent if the Typekit CDN is slow or unreachable.

**Adobe Fonts dashboard — important settings for kit `snm7qqk`:**

1. **Montserrat must be excluded from this kit.** We self-host Montserrat via `@fontsource`; if Adobe also serves it, the browser ends up with two competing `@font-face` declarations for the same family and load order becomes non-deterministic. Sign in at <https://fonts.adobe.com/my_fonts#web_projects>, edit the project, uncheck Montserrat, save.
2. **Font display setting → `swap`.** Adobe defaults this to `auto`, which can FOIT (flash of invisible text) for up to 3 seconds on slow connections. `swap` matches what `@fontsource` ships for Montserrat and is the right default for a content site.
3. **Weights included**: 100, 300, 400, 500, 600, 700 upright (no italics). The brand type scale only uses 400 (H2/H4) and 500 (H1/H3). Trimming the kit to just those two weights is a worthwhile optional optimization — Adobe ships every checked weight to every page that loads the kit.

**Why the split (Adobe for NS, `@fontsource` for Montserrat):**

- Adobe Fonts is the only legitimate channel for New Science; self-hosting the `.woff2` files would require a separate webfont license from the foundry. The CC subscription bundles that for us.
- Montserrat is open-source and self-hosting it is straightforward, faster (no CDN round-trip, no DNS dependency), and privacy-cleaner (no third-party request for body text on every page).
- The two paths are independent: changing one font never forces a change to the other.

**If the Adobe Fonts subscription lapses or the kit is deleted**, headlines fall back through the stack — Montserrat at the matching numeric weight (`@fontsource/montserrat/500.css` would need to be re-imported in `main.tsx` to fully cover the fallback for H1/H3). The page stays legible; it just loses the display-font intent.

**Do not commit licensed `.woff2` files** to the repo. Adobe's terms forbid self-hosting kit files; doing so would also leak them in git history.

#### Type scale (per-element specs)

Canonical record of the brand type scale, taken from the designer's hand-off. The corresponding `@theme` tokens in `frontend/src/styles/global.css` are the single source of truth in code; `@layer base` rules and Tailwind v4's auto-generated utility classes both consume those tokens. Any change to a row in this table is an edit to the matching tokens and `@layer base` rule in the same commit.

| Scale | Element / utility | Typeface (token) | Weight | Size | Line-height | Case |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | `<h1>` / `text-h1` | New Science via `--font-display` | Medium / 500 | 72px desktop, fluid down to 40px on mobile (`clamp(2.5rem, 1.25rem + 6vw, 4.5rem)`) | 76px (ratio 76/72) | Title Case |
| H2 | `<h2>` / `text-h2` | New Science via `--font-display` | Regular / 400 | 48px desktop, fluid down to 30px on mobile (`clamp(1.875rem, 1.1rem + 3.8vw, 3rem)`) | 52px (ratio 52/48) | Title Case |
| H3 | `<h3>` / `text-h3` | New Science via `--font-display` | Medium / 500 | 28px | 36px | Title Case |
| H4 | `<h4>` / `text-h4` | New Science via `--font-display` | Regular / 400 | 22px | 28px | Title Case |
| H5 | `<h5>` / `text-h5` | Montserrat via `--font-sans` (immune to NS swap) | SemiBold / 600 | 18px | 22px | UPPERCASE, 0.02em tracking |
| Body 1 | `<body>` / `<p>` default / `text-body-1` | Montserrat via `--font-sans` | Regular / 400 | 18px | 24px | Sentence case |
| Body 2 | `text-body-2` utility | Montserrat via `--font-sans` | Regular / 400 | 16px | 19px | Sentence case |
| Body 3 | `text-body-3` utility | Montserrat via `--font-sans` | Regular / 400 | 12px | 15px | Sentence case |

Notes on this scale:

- **H1 and H2 are fluid (responsive).** They hold the designer's px size at roughly tablet-landscape and up, then scale down via `clamp()` toward a legible mobile floor (40px / 30px) so long headlines don't dominate a 320px phone. The line-height tokens are unitless ratios, so they track the fluid size automatically. H3–H5 stay fixed (already small enough for mobile). To restore a fixed size, replace the `clamp(...)` value on `--text-h1` / `--text-h2` with the px size.
- **Title Case and Sentence case are author conventions, not CSS rules.** CSS only ships `capitalize` (which capitalizes *every* word, including small words like "of", "the" — wrong by AP/Chicago) and `uppercase`. Authors are expected to write headings/copy in correct case directly in JSX. Only H5 has a true CSS transform (`uppercase`).
- **Tracking conversion.** "20pt tracking" in the design hand-off is the Figma/Adobe convention of 1/1000 em — i.e. `letter-spacing: 0.02em` in CSS. Apply the same ratio when future hand-offs include tracking values.
- **H1–H4 use `--font-display`**, which resolves to New Science via Adobe Fonts (see "New Science — Adobe Fonts / Typekit" above). If the Typekit CDN is slow or unreachable, the stack falls back through Montserrat at the same numeric weight so headlines stay legible.
- **H5 uses `--font-sans`** by design — it is an eyebrow/label treatment that should stay Montserrat regardless of any `--font-display` change.
- **`<h6>` is not in the spec** and currently inherits body styles. Define it here if it ever gets a brand role.
- **Body 1 is the document default**, applied via the `body` element. `<p>` and other text inherit it. Body 2 and Body 3 require an explicit utility class (`text-body-2`, `text-body-3`).
- Tailwind v4 also generates `text-h1` … `text-h5` utilities from the same tokens, for the rare case where a non-semantic element needs a typographic role (e.g. a styled `<a>` link inside a card that should look like an H3 but isn't a heading).

### Layout system

Canonical record of the brand layout system (grid + vertical rhythm), taken from the designer's hand-off. Lives in `@theme` in `frontend/src/styles/global.css`; consumed via Tailwind v4 utilities (`max-w-7xl`, `gap-x-10`, `py-module`, `mt-element`). The full convention — including when to deviate — is in `.cursor/rules/30-brand-and-content.mdc` → "Layout system".

| Concern | Value | Token / utility | Usage |
| --- | --- | --- | --- |
| Max content width | 1280px (80rem) | `max-w-7xl` (Tailwind default) | `<div className="mx-auto max-w-7xl">` inside the section. Section background fills viewport edge-to-edge. |
| Column gutter | 40px (2.5rem) | `gap-x-10` (Tailwind default 10 × 0.25rem) | Horizontal gap between columns in every multi-column grid. |
| Side padding (below 1280px) | 24px → 40px | `px-6 sm:px-10` | Outer section padding so content doesn't kiss the viewport edge on small screens. |
| Module top/bottom padding | 120px (7.5rem) desktop; 60px (3.75rem) below `md` (≤767px) | `--spacing-module` → `py-module`, `pt-module`, `pb-module` | Standard padding on the outer `<section>` of a major page module. The mobile value comes from a `@media (max-width: 767px)` override of the CSS variable in `global.css`, so every `*-module` utility tightens on phones without per-page edits. |
| Internal element spacing | 90px (5.625rem) desktop; 50px (3.125rem) below `md` (≤767px) | `--spacing-element` → `mt-element`, `mb-element` | Vertical gap inside a module. Same media-query override as module padding. |

The mobile rhythm (60px module / 50px element below `md`) is the designer's spec, read from the mobile mockups (`docs/Crayhill Web Assets/Page Mockups/Crayhill_Website_Mockups_MOBILE.pdf`), where every content module annotates "Module top/bottom padding: 60px" and internal element spacing (image top/bottom, image↔text, padding below a section headline) annotates 50px. Two deliberate mobile exceptions the designer called out separately are handled as per-component responsive overrides rather than the token: the homepage Asset Focus block keeps **90px** under its headline, and the team-roster pages use **30px** under the intro paragraph.
| Tight text/CTA spacing | 40px (2.5rem) | `mt-10` / `gap-y-10` (no custom token; default scale) | Between body copy and an inline CTA, between an article title and a date line, etc. |

Designer-supplied per-section overrides (e.g. the ABF Credit Opportunities page's 90px module top/bottom padding instead of the standard 120px) are written as **arbitrary values** (`py-[90px]`), not as `py-element`, even when the number matches a token. The arbitrary value signals "intentional deviation from the standard rhythm"; the token signals "this is the standard rhythm". Same number, different semantic intent.

### Static assets

Production brand assets (logos, icons, photography) live at the **repo root** in `assets/`, NOT under `frontend/`. The folder is committed to git:

```
assets/
├── crayhill-r-logo-svg/       # 6 SVGs (logo + logomark in black/color/white)
├── icons/                     # SVG icons (content + email/linkedin)
└── images/                    # JPG/PNG (heroes, headshots, articles, sectors)
```

All folder and file names are **kebab-case** — lowercase, hyphen-separated, URL-clean (no spaces, no underscores, no PascalCase). New assets follow the same convention.

Note: this folder intentionally contains **no `README.md` or other documentation files**. Vite's `publicDir` copies everything to `dist/` verbatim, so any non-asset file would ship to production at a public URL. Documentation about this folder lives here in `INSTALL.md` and in `.cursor/rules/30-brand-and-content.mdc`.

#### How they're served

Vite's `publicDir` is configured to point at this folder (`frontend/vite.config.ts` → `publicDir: '../assets'`). That gives:

| Mode | Behavior |
| --- | --- |
| `npm run dev` | Files served at root URLs in dev. `assets/images/homepage-hero.jpg` → `http://localhost:5173/images/homepage-hero.jpg`. |
| `npm run build` | Folder copied verbatim into `dist/` — no hashing, no transformation. `dist/images/homepage-hero.jpg` ships as-is. |
| Production | Whatever serves `dist/` (Nginx in the planned EC2 setup) serves the assets at the same root URLs by virtue of being inside `dist/`. |

#### How to reference them in JSX

Always use **root-relative URLs** as plain strings:

```tsx
<img src="/images/headshot-joe.jpg" alt="Joe Smith" />
<img src="/icons/icon-email.svg" alt="" aria-hidden="true" />
<img
  src="/crayhill-r-logo-svg/crayhill-r-logo-black.svg"
  alt="Crayhill Capital Management"
/>
```

Do **not** import them as ES modules (`import logo from '@/assets/...'`). ES-module imports trigger Vite's hashed-output pipeline, defeating the stable-URL convention the future admin dashboard will rely on, and won't work for files outside the Vite project root anyway.

#### Why repo root, not `frontend/public/` or `frontend/src/assets/`

1. **Shared with the API tier.** The future PHP-side admin dashboard for image management needs read/write access to the same files. Placing them under `frontend/` would imply they're a frontend-only concern.
2. **Stable URLs.** Files served from `publicDir` are not hashed; the URL `/images/headshot-joe.jpg` is permanent. The admin dashboard can swap that file (eventually via S3 or a non-tracked EC2 directory; see "Future" below) without code changes.
3. **Build-time copy is acceptable.** For a marketing site of ~50 images, the cost of Vite copying the folder into `dist/` on every build is trivial.

#### Naming convention

All folder and file names under `assets/` are **kebab-case**: lowercase, hyphen-separated, no spaces, no underscores, no PascalCase. Concretely:

| If the designer hands you... | The asset is named... |
| --- | --- |
| `Headshot_Joe.jpg` | `headshot-joe.jpg` |
| `Sectors_COMMRealEstate_Grid1.jpg` | `sectors-comm-real-estate-grid-1.jpg` |
| `Strategies_InvGrade_Hero.jpg` | `strategies-inv-grade-hero.jpg` |
| `Icon-LinkedIn.svg` | `icon-linkedin.svg` (brand single-word, not `linked-in`) |

Word boundaries follow the obvious rules: PascalCase splits (`RealEstate` → `real-estate`), uppercase initialisms split from the next word (`COMMReal` → `comm-real`), letter-to-digit splits (`Grid1` → `grid-1`). Brand-name initialisms stay together when the brand intends them as one word (`LinkedIn` → `linkedin`, not `linked-in`).

Don't rename existing assets unilaterally — references break everywhere. Coordinate with the designer if a name needs to change.

#### Adding a new asset

1. Drop the file into the appropriate subfolder (`Icons/`, `Images/`, or a new category subfolder if warranted).
2. Reference it in JSX with a root-relative URL.
3. Provide meaningful `alt` text (decorative-only icons: `alt="" aria-hidden="true"`).
4. Don't add anything not delivered by the designer — no stock photography, no third-party-domain references.

#### Designer source files (separate concern)

`.psd`, `.ai`, `.fig`, `.sketch`, page-mockup PDFs, and other large source files belong under `docs/`, not `assets/`. The `docs/Crayhill Web Assets/Page Mockups/` directory is gitignored (`.gitignore` line 51). Anything that isn't a final, ship-ready brand asset stays out of `assets/`.

#### Future: admin-managed swaps

The longer-term plan is an internal dashboard that lets non-developers replace images (`headshot-joe.jpg`, etc.) without a code commit. When that lands, the runtime upload location moves out of git — likely to S3 or a non-tracked EC2 directory — and the JSX references become data-driven (loaded from the DB / API). Until then, every asset swap is a git commit. See `docs/data-flow.md` (when written) for the migration path.

### Routing

Client-side routing uses **React Router v7**. The route table is declared in one place (`frontend/src/routes.tsx`) and pages are lazy-loaded so each becomes its own JS chunk:

```
frontend/src/
├── routes.tsx                  # single route table, mounts <RootLayout>
├── components/
│   ├── RootLayout.tsx          # shared shell (header/footer come with brand work)
│   └── PageHead.tsx            # per-page <title>/<meta> via React 19's native head support
└── pages/
    ├── home/
    │   ├── index.tsx           # default-exported route component
    │   └── meta.ts             # title + description constants
    └── not-found/
        ├── index.tsx           # eagerly loaded — bad URLs render instantly
        └── meta.ts
```

Adding a new page is a four-file pattern: `pages/<slug>/index.tsx` + `pages/<slug>/meta.ts`, then add a `lazy()` import and route entry in `routes.tsx`. The 404 catch-all (`path: '*'`) handles unknown URLs.

`<PageHead title="…" description="…" />` should appear at the top of every page component. It uses React 19's built-in `<title>`/`<meta>` hoisting — no helmet provider needed.

---

## API: PHP + PDO + MariaDB

### Layout

```
api/
├── certs/
│   └── aws-rds-ca-bundle.pem    # AWS-published RDS root CAs (public, committed)
├── lib/
│   ├── env.php                  # single env loader; reads .config/secrets.env
│   ├── response.php             # respond_ok / respond_error / respond_no_content
│   ├── db.php                   # PDO factory, utf8mb4, TLS-only, prepared statements
│   ├── migrate.php              # admin-credential DDL runner
│   ├── session.php              # CMS PHP session cookie helpers
│   ├── auth.php                 # CMS credential check + auth guard
│   └── request.php              # JSON body reader for POST endpoints
├── migrations/                  # numbered, dated schema migrations
├── seeds/
│   ├── news_seed.sql            # committed reproducible seed for the news table
│   ├── careers_seed.sql         # committed reproducible seed for the careers table
│   └── site_pages_seed.sql      # legal notice + privacy policy copy
└── v1/
    ├── health.php               # GET /api/v1/health — smoke check
    ├── news.php                 # GET /api/v1/news (list) + ?slug=<x> (detail)
    ├── pages.php                # GET /api/v1/pages?slug=<x> (static page)
    ├── careers.php              # GET /api/v1/careers (list, full body inline)
    └── admin/
        ├── login.php            # POST /api/v1/admin/login
        ├── session.php          # GET /api/v1/admin/session
        ├── logout.php           # POST /api/v1/admin/logout
        ├── news.php             # GET/POST/PATCH/DELETE /api/v1/admin/news
        ├── careers.php          # GET/POST/PATCH/DELETE /api/v1/admin/careers
        └── pages.php            # GET/PATCH /api/v1/admin/pages
```

### Endpoints

| Method + path | File | Returns |
| --- | --- | --- |
| `GET /api/v1/health` | `api/v1/health.php` | Env + DB connectivity smoke check. |
| `GET /api/v1/news` | `api/v1/news.php` | Published posts, newest first: `{ id, slug, title, author, date, image, excerpt }[]` with `meta.count`. |
| `GET /api/v1/news?slug=<x>` | `api/v1/news.php` | One published post with full Markdown `content`; `404 NOT_FOUND` if missing/draft. |
| `GET /api/v1/careers` | `api/v1/careers.php` | Published job postings, in `sort_order`: `{ id, slug, title, location, content }[]` (full Markdown body inline) with `meta.count`. No detail route — the Careers page renders accordions. |
| `GET /api/v1/pages?slug=<x>` | `api/v1/pages.php` | One published static page: `{ slug, title, subtitle, meta_description, content }`. Used for Legal Notice and Privacy Policy. |
| `POST /api/v1/admin/login` | `api/v1/admin/login.php` | Body `{ username, password }`. Validates against `CMS_USERNAME` / `CMS_PASS` in `secrets.env`. Sets HttpOnly session cookie on success. |
| `GET /api/v1/admin/session` | `api/v1/admin/session.php` | Current CMS session: `{ authenticated, username }`. |
| `POST /api/v1/admin/logout` | `api/v1/admin/logout.php` | Destroys CMS session; returns `{ authenticated: false, username: null }`. |
| `GET /api/v1/admin/news` | `api/v1/admin/news.php` | All non-deleted posts (draft + published), newest first: `{ id, slug, title, author, date, image, status, updated_at }[]` with `meta.count`. Requires CMS session. |
| `GET /api/v1/admin/news?id=<id>` | `api/v1/admin/news.php` | Single post for editing, including Markdown `content` and `status`. |
| `POST /api/v1/admin/news` | `api/v1/admin/news.php` | Create a post. Body `{ title, slug, author?, date, status, image?, content }`. Returns the created row (`201`). |
| `PATCH /api/v1/admin/news` | `api/v1/admin/news.php` | Update a post. Body must include `id`; other fields are partial. Used for full saves and inline status changes from the list. |
| `DELETE /api/v1/admin/news?id=<id>` | `api/v1/admin/news.php` | Permanently deletes a post (`{ deleted: true, id }`). |
| `GET /api/v1/admin/careers` | `api/v1/admin/careers.php` | All non-deleted postings (draft + published), in `sort_order`: `{ id, slug, title, location, sort_order, status, updated_at }[]` with `meta.count`. Requires CMS session. |
| `GET /api/v1/admin/careers?id=<id>` | `api/v1/admin/careers.php` | Single posting for editing, including Markdown `content`. |
| `POST /api/v1/admin/careers` | `api/v1/admin/careers.php` | Create a posting. Body `{ title, slug, location?, sort_order, status, content }`. Returns the created row (`201`). |
| `PATCH /api/v1/admin/careers` | `api/v1/admin/careers.php` | Update a posting. Body must include `id`; other fields are partial. |
| `DELETE /api/v1/admin/careers?id=<id>` | `api/v1/admin/careers.php` | Permanently deletes a posting (`{ deleted: true, id }`). |
| `GET /api/v1/admin/pages` | `api/v1/admin/pages.php` | All provisioned site pages: `{ id, slug, title, subtitle, status, updated_at }[]`. Requires CMS session. |
| `GET /api/v1/admin/pages?slug=<slug>` | `api/v1/admin/pages.php` | Single page for editing, including Markdown `content` and `meta_description`. |
| `PATCH /api/v1/admin/pages` | `api/v1/admin/pages.php` | Update a page. Body must include `id`; other fields are partial. No create/delete — pages are seeded. |

Full response shapes and curl examples live in `docs/data-flow.md` → "News & Insights" and "Careers".

### Conventions

- `declare(strict_types=1);` at the top of every file.
- All endpoints return the standard envelope: `{ "data": ..., "error": null, "meta": ... }` on success, `{ "data": null, "error": { "code", "message", "fields"? }, "meta": null }` on failure.
- All DB access goes through PDO with prepared statements. `PDO::ATTR_EMULATE_PREPARES = false`. `PDO::ATTR_ERRMODE = ERRMODE_EXCEPTION`.
- **All RDS connections use TLS** with verified server certificates: `PDO::MYSQL_ATTR_SSL_CA` points at `api/certs/aws-rds-ca-bundle.pem` and `PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT = true`. No bypass for local debugging — use a local docker MySQL if you need plaintext.
- All secrets read via `env()` / `env_required()` from `api/lib/env.php`. Nothing else reads `.config/secrets.env`.
- Error responses sent to the client never include SQL, stack traces, or hostnames. Underlying details go to `error_log` only.

### AWS RDS CA bundle

`api/certs/aws-rds-ca-bundle.pem` is the AWS-published combined root CA bundle. It is **public** (anyone can download it) so it is committed to the repo for deterministic deploys. Refresh it whenever AWS rotates the bundle (every few years):

```sh
curl --fail -o api/certs/aws-rds-ca-bundle.pem \
  https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

Don't put this file under `.config/` — that folder is for secrets and this isn't a secret.

### Running locally

```sh
php -S 127.0.0.1:8000 -t api
```

Endpoints map directly: `api/v1/health.php` → `http://127.0.0.1:8000/v1/health.php`. The canonical `/api/v1/health` URL form (no `.php` extension, with `/api` prefix) is enforced by Nginx/Apache rewrites in production — see the EC2 deployment section when it's written.

---

## Environment variables

Single source of truth: **`.config/secrets.env`** at the repo root. Format is `KEY=VALUE`, one per line, no quotes. The committed template `.config/secrets.env.example` lists every key the project expects.

| Key               | Required by | Secret? | Notes                                                                                  |
| ----------------- | ----------- | ------- | -------------------------------------------------------------------------------------- |
| `APP_ENV`         | API (planned) | No      | One of `development`, `staging`, `production`.                                         |
| `APP_DEBUG`       | API (planned) | No      | `true` locally; **must be `false` in production**.                                     |
| `DB_HOST`            | API + migrations | Yes  | RDS endpoint, e.g. `<name>.<id>.<region>.rds.amazonaws.com`.                            |
| `DB_PORT`            | API + migrations | No   | `3306` for MariaDB/MySQL on RDS.                                                        |
| `DB_NAME`            | API + migrations | No   | App schema name. Set to `crayhill` after migration `001` has run.                       |
| `DB_USER`            | API runtime      | Yes  | **Least-privilege app user** (`crayhill_app`). Created by migration `002`.              |
| `DB_PASSWORD`        | API runtime      | Yes  | App user password. Used by the API at runtime AND substituted into migration `002`.     |
| `DB_ADMIN_USER`      | Migrations only  | Yes  | RDS admin user (e.g. `admin`). **Never** read by runtime code paths.                   |
| `DB_ADMIN_PASSWORD`  | Migrations only  | Yes  | RDS admin password. In production, prefer to inject via the deploy environment.        |
| `ALLOWED_ORIGINS`    | API              | No   | Comma-separated list of origins allowed by CORS. Local dev: `http://localhost:5173`.    |
| `CMS_USERNAME`       | API (CMS login)  | Yes  | Operator username for `/admin` sign-in (phase 1; checked by `POST /api/v1/admin/login`). |
| `CMS_PASS`           | API (CMS login)  | Yes  | Operator password for `/admin` sign-in. Must match the value in `secrets.env` on each environment. |

### Frontend public variables (`frontend/.env`)

The frontend reads **only** `VITE_*`-prefixed variables, which ship to the browser as plaintext — so they must never hold a secret. `frontend/.env` is gitignored; the committed template is `frontend/.env.example`. Copy it for local dev (`cp frontend/.env.example frontend/.env`).

| Key | Required? | Secret? | Example | Notes |
| --- | --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No (defaults to `/api/v1`) | No | `/api/v1` | Base URL the SPA uses to reach the PHP API. Relative by default so the same value works in dev (Vite proxies `/api` → local PHP server) and prod (Apache serves `/api` same-origin). Set to a full origin only for a cross-origin API host. |

### When adding a new variable

1. Add it to `.config/secrets.env` (real value) **and** `.config/secrets.env.example` (placeholder + comment).
2. Add a row to the table above.
3. Update the env loader so the missing-key error message is helpful.

---

## Database setup

### Schema and users

The application schema is **`crayhill`** on the RDS instance. Two users access it:

- **`crayhill_app`** (least-privilege runtime user): only `SELECT, INSERT, UPDATE, DELETE` on `crayhill.*`, with `REQUIRE SSL`. Used by every HTTP request via `api/lib/db.php`.
- **`admin`** (RDS master): used **only** by `api/lib/migrate.php` for DDL and permission changes. The runtime code never touches admin credentials.

Both users and the schema are created by migrations:

```
api/migrations/
├── 2026_04_28_001_create_database.sql       # creates the crayhill schema
├── 2026_04_28_002_create_app_user.sql       # creates crayhill_app, REQUIRE SSL, least privileges
├── 2026_06_24_003_create_news.sql           # creates the news table (News & Insights)
└── 2026_06_24_004_create_careers.sql        # creates the careers table (Careers)
```

Charset/collation: `utf8mb4 / utf8mb4_unicode_ci`.

### Migrations

Naming convention: `YYYY_MM_DD_NNN_description.sql`. One logical change per file. Once a migration has been applied to **any** environment, never edit it — write a new migration instead.

#### Applying migrations

Use the bundled runner:

```sh
# from the repo root
php api/lib/migrate.php <migration-filename.sql>
```

The runner connects with **admin credentials** (`DB_ADMIN_USER` / `DB_ADMIN_PASSWORD`) — separate from the runtime app credentials. It supports a tiny amount of safe placeholder substitution so passwords don't have to be hardcoded in committed migration files; the only allowed placeholders are `${DB_USER}` and `${DB_PASSWORD}`, validated to contain only `[A-Za-z0-9_-]` before being spliced into the SQL. See the comment block at the top of `api/lib/migrate.php` for full details.

There is currently **no tracking table** for "which migrations have run." Filename order is the canonical sequence, and each migration uses `IF NOT EXISTS` / `IF EXISTS` clauses (or explicit `DROP ... IF EXISTS` resets) so it's safe to re-run. We'll add a `schema_migrations` tracking table when the count grows past a handful or multiple environments need to stay in sync.

#### Bootstrap order on a fresh environment

1. RDS instance must be reachable (see "AWS RDS access for local development" or, in production, the EC2 → RDS path once it exists).
2. `.config/secrets.env` filled in. For the very first run, leave `DB_NAME` empty (the schema doesn't exist yet, so PDO can't `USE` it). `DB_USER` and `DB_PASSWORD` should already hold the **future** app credentials — migration `002` reads those values and creates the user with that exact password.
3. Run migration `001` to create the schema:
   ```sh
   php api/lib/migrate.php 2026_04_28_001_create_database.sql
   ```
4. Set `DB_NAME=crayhill` in `.config/secrets.env`.
5. Run migration `002` to create the app user with the password from `secrets.env`:
   ```sh
   php api/lib/migrate.php 2026_04_28_002_create_app_user.sql
   ```
6. Run all subsequent migrations in filename order (e.g. `php api/lib/migrate.php 2026_06_24_003_create_news.sql`, then `php api/lib/migrate.php 2026_06_24_004_create_careers.sql`).
7. Seed any content domains that ship with data — News & Insights, Careers, and site pages (see "Seed data" below): load `api/seeds/news_seed.sql`, `api/seeds/careers_seed.sql`, and `api/seeds/site_pages_seed.sql` via the `mysql` client.
8. Verify with the health endpoint — `database.selected_schema` should report `"crayhill"` and a separate `CURRENT_USER()` query should return `crayhill_app@%` — then `curl http://127.0.0.1:8000/v1/news.php` and `curl http://127.0.0.1:8000/v1/careers.php` should return the seeded rows.

#### Rotating the app user password

The migration is idempotent and `DROP USER IF EXISTS` first, so re-running it with a new `DB_PASSWORD` value in `secrets.env` is the canonical way to rotate:

```sh
# 1. Edit .config/secrets.env, set a new DB_PASSWORD value (40-char hex recommended).
# 2. Re-run the migration to recreate the user with the new password:
php api/lib/migrate.php 2026_04_28_002_create_app_user.sql
# 3. Restart the API process so it reloads secrets.env.
```

### Seed data

**News & Insights** is the first seeded domain. The cleaned legacy posts are committed as `api/seeds/news_seed.sql` — a single idempotent `INSERT ... ON DUPLICATE KEY UPDATE` keyed on the unique `slug`. (Provenance: a one-time WordPress dump was cleaned to Markdown by `scripts/clean-wp-posts.mjs` into a CSV, then exported to this SQL seed; the raw dump and CSV were removed from the repo and backed up offline — the DB is now the source of truth.) Load it into the `news` table — created by migration `003` above — with the `mysql` client:

```sh
# from the repo root, after migration 003 has run.
# Uses the same RDS host/credentials as the API; load with whichever user
# has INSERT on crayhill.* (the app user is sufficient).
mysql --host="$DB_HOST" --port="${DB_PORT:-3306}" \
      --user="$DB_USER" --password \
      --ssl-ca=api/certs/aws-rds-ca-bundle.pem \
      crayhill < api/seeds/news_seed.sql
```

Idempotent — safe to re-run; existing rows (matched by `slug`) update, new rows insert.

**Careers** is the second seeded domain. The open job postings are committed as `api/seeds/careers_seed.sql` — same idempotent `INSERT ... ON DUPLICATE KEY UPDATE` keyed on the unique `slug`. (Provenance: a one-time scrape of the legacy crayhill.com Careers listing + job detail pages, converted to Markdown. The DB is now the source of truth; edit the seed/table directly rather than re-scraping.) Load it into the `careers` table — created by migration `004` above — the same way:

```sh
# from the repo root, after migration 004 has run.
mysql --host="$DB_HOST" --port="${DB_PORT:-3306}" \
      --user="$DB_USER" --password \
      --ssl-ca=api/certs/aws-rds-ca-bundle.pem \
      crayhill < api/seeds/careers_seed.sql
```

**Site pages** (Legal Notice & Disclosures, Privacy Policy) are seeded as `api/seeds/site_pages_seed.sql` into the `site_pages` table — migration `005`. Readable Markdown sources live in `api/seeds/content/*.md`. Load the same way:

```sh
# from the repo root, after migration 005 has run.
mysql --host="$DB_HOST" --port="${DB_PORT:-3306}" \
      --user="$DB_USER" --password \
      --ssl-ca=api/certs/aws-rds-ca-bundle.pem \
      crayhill < api/seeds/site_pages_seed.sql
```

> **Why a `mysql`-loaded seed and not a `*_seed_*.sql` migration through `api/lib/migrate.php`:** the migration runner splits files naively on `;`, and the Markdown post content is full of semicolons — raw `INSERT` SQL would break apart mid-statement. The real `mysql` client parses string literals correctly, so the content survives intact. Small, semicolon-free reference data can still use a numbered `*_seed_*.sql` migration via the runner.

> **Regenerating after content edits:** edit the rows directly in the DB (the source of truth) or hand-edit `api/seeds/news_seed.sql`. The original CSV-based cleaning pipeline (`scripts/clean-wp-posts.mjs`) is retained for provenance but its inputs are no longer in the repo.

---

## Build steps

### Frontend

```sh
cd frontend
npm ci             # clean, deterministic install based on package-lock.json
npm run build
```

Output is a fully static bundle in `frontend/dist/` (HTML, JS, CSS, assets). For production this directory is what gets served by Nginx/Apache.

### API

PHP requires no build step. For deployment, the entire `api/` directory is shipped as-is to the EC2 instance and pointed at by the web server config (Nginx/Apache + PHP-FPM). Composer dependencies, when added, would run via `composer install --no-dev --optimize-autoloader` at deploy time.

---

## AWS RDS access for local development

The RDS instance is the source of truth for application data. By default a fresh RDS instance is **not publicly accessible** — its DNS only resolves to a private VPC IP that you can't reach from outside AWS. This section documents the temporary "punch a hole" approach for local development. **It is not the long-term answer**; once the EC2 instance exists, the right pattern is an SSH tunnel through EC2 (private subnet RDS, no public exposure).

> **Caveats — read before doing this:**
> - Lock the security-group rule to **your specific public IP** (`/32`), never `0.0.0.0/0`.
> - Re-disable public access **before** any sensitive data lands in the DB.
> - Rotate the `admin` RDS password after this walkthrough — it has been shared in chat at least once during initial setup.
> - Production-bound endpoints will route through EC2 in a private subnet; this is dev-only.

### One-time: find your public IP

```sh
curl -s https://checkip.amazonaws.com
```

You'll add this address (with `/32`) to the security group below. If your IP changes (home WiFi → coffee shop), repeat the SG step.

### Step 1 — Make the RDS instance publicly accessible

1. Open the AWS Console → **RDS** → **Databases**.
2. Click your instance (`crayhill` based on the endpoint we have).
3. **Modify** (top right).
4. Scroll to **Connectivity** → expand **Additional configuration**.
5. Set **Public access** → **Publicly accessible**.
6. Scroll to the bottom → **Continue**.
7. On the "Summary of modifications" screen, choose **Apply immediately**.
8. Click **Modify DB instance**.
9. Wait 1–5 minutes. The instance status will go from `Modifying` → `Available`. AWS will assign it a public IP and update DNS.

After the modification completes, run `dig +short <DB_HOST>` again from your machine. You should now see a **public** IP (not `172.31.x.x` or `10.x.x.x`). That's your signal to move on.

### Step 2 — Allow your IP through the security group

1. Still in RDS console, click your instance.
2. **Connectivity & security** tab → under **Security**, click the linked **VPC security group** (e.g. `sg-0abc123…`).
3. The EC2 console opens. Make sure the SG is selected.
4. **Inbound rules** tab → **Edit inbound rules**.
5. **Add rule**:
   - Type: **MYSQL/Aurora** (auto-fills protocol = TCP, port = 3306).
   - Source: choose **My IP** (AWS auto-detects your public IP) or **Custom** + enter `<your.public.ip>/32`.
   - Description: `crayhillRebrand local dev`.
6. **Save rules**.

### Step 3 — Verify from your machine

```sh
# Should resolve to a PUBLIC IP now
dig +short <DB_HOST>

# Should connect over TLS and print the MariaDB version
curl -s http://127.0.0.1:8000/v1/health.php | jq
```

Expected `database` block in the health response:

```json
"database": {
  "connected": true,
  "selected_schema": null,
  "error": null
}
```

### Step 4 — Lock it back down (do this before real data lands)

When you no longer need direct local access (typically: once the EC2 bastion + SSH tunnel approach is in place):

1. RDS → instance → **Modify** → **Public access: Not publicly accessible** → Apply immediately.
2. EC2 → Security Groups → remove the inbound 3306 rule with the `local dev` description.

Document the date you locked it back down in this file's troubleshooting section so we have a record.

### Step 5 — Operational hygiene

The two operations below are **already done** in the current dev environment; this checklist is for replicating in staging and production.

- **Rotate the `admin` password** if it has ever been shared (chat, email, screenshot). RDS console → Modify → set a new master password → Apply immediately. Then update `DB_ADMIN_PASSWORD` in `.config/secrets.env` (or whatever store production uses). The old value is considered burned.
- **Provision the least-privilege app user.** This is now done by migration `2026_04_28_002_create_app_user.sql` — see the Database setup section above. The migration creates `crayhill_app` with exactly `SELECT/INSERT/UPDATE/DELETE` on `crayhill.*` and `REQUIRE SSL`. Use it (`DB_USER` / `DB_PASSWORD`) for runtime; reserve admin (`DB_ADMIN_USER` / `DB_ADMIN_PASSWORD`) for the migration runner only.

---

## EC2 deployment

> **Status (current):** Static frontend is deployed via `npm run deploy` to `/var/www/crayhill`. The PHP API is **not automatic** — run `scripts/setup-api-ec2.sh` once on the box to wire PHP-FPM + Apache so `/api/v1/*` returns JSON from RDS. Until that script runs, News & Insights and Careers show no data (Apache's SPA fallback serves `index.html` for API URLs). HTTPS (certbot) is still pending.

The box is **Amazon Linux 2023**. All commands below run **on the EC2 instance** over SSH. On the current box the repo is cloned at `/var/www/crayhill2026` (the path is machine-specific — substitute your own if it differs).

### Why a dedicated docroot

The build is served from `/var/www/crayhill`, **not** directly from the repo's `frontend/dist/`. Keeping the web root separate from the git working tree means Apache only ever exposes the built static files — never the source, `.git/`, `node_modules/`, or the `api/` tree — and makes each redeploy a single atomic `cp`. (It also sidesteps the `apache`-user traversal/SELinux issues you'd hit serving from a home directory.)

The build itself is self-contained: `frontend/vite.config.ts` uses the default `base: '/'` and `publicDir: '../assets'`, so brand assets (logos, icons, images) are already copied into `dist/`. Nothing outside `dist/` needs to ship.

### 1. Install and start Apache (run once)

```sh
sudo dnf install -y httpd
sudo systemctl enable --now httpd
```

### 2. Deploy the build to the docroot

```sh
sudo mkdir -p /var/www/crayhill
sudo cp -r /var/www/crayhill2026/frontend/dist/. /var/www/crayhill/
sudo chown -R apache:apache /var/www/crayhill
```

If SELinux is enforcing (check with `getenforce`), restore the web-content file context so Apache is allowed to read the files:

```sh
sudo restorecon -R /var/www/crayhill
```

### 3. Virtual host with SPA fallback + API routing (run once)

The site is a single-page app: React Router handles routing client-side, so any URL that isn't a real file on disk (e.g. `/who-we-are`) must be served `index.html`. **But** `/api/v1/*` must **not** hit that fallback — those paths must reach the PHP API in the repo or the browser receives HTML instead of JSON and DB-backed pages go blank.

The committed vhost lives at `config/httpd/crayhill.conf`. Install it with the one-time setup script (recommended — also installs PHP-FPM and fixes secrets permissions):

```sh
bash /var/www/crayhill2026/scripts/setup-api-ec2.sh
```

Prerequisites before running that script:

1. `.config/secrets.env` exists on the box at `/var/www/crayhill2026/.config/secrets.env` with production `DB_*` values.
2. The RDS security group allows inbound **3306** from this EC2 instance's security group (or private IP if both are in the VPC).

The script installs `php-fpm` + `php-mysqlnd`, copies the vhost to `/etc/httpd/conf.d/crayhill.conf` (substituting the repo path), sets `secrets.env` to mode `640` / group `apache`, applies SELinux labels when enforcing, reloads `php-fpm` + `httpd`, and smoke-tests `GET /api/v1/health`.

Manual equivalent (if you prefer not to use the script) — copy and customize the committed file:

```sh
sudo sed "s|@CRAYHILL_REPO@|/var/www/crayhill2026|g" \
  /var/www/crayhill2026/config/httpd/crayhill.conf \
  | sudo tee /etc/httpd/conf.d/crayhill.conf
sudo apachectl configtest && sudo systemctl reload httpd
```

Validate and reload:

```sh
sudo apachectl configtest   # expect: Syntax OK
sudo systemctl reload httpd
```

Amazon Linux ships a default `welcome.conf` that can shadow the docroot with the Apache test page. If you see that page instead of the site, disable it (run once):

```sh
sudo mv /etc/httpd/conf.d/welcome.conf /etc/httpd/conf.d/welcome.conf.disabled
sudo systemctl reload httpd
```

### 4. Smoke test on the box

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost/            # 200
curl -s http://localhost/ | grep -o '<title>.*</title>'              # the page title
curl -s -o /dev/null -w '%{http_code}\n' http://localhost/who-we-are # 200 via FallbackResource
curl -s http://localhost/api/v1/health | head -c 120                 # JSON with "database" (after setup-api-ec2.sh)
curl -s http://localhost/api/v1/news | head -c 80                    # JSON array (after setup-api-ec2.sh)
```

### 5. Open port 80 in the security group

AWS Console → **EC2** → the instance → **Security** tab → click its security group → **Inbound rules** → **Edit inbound rules** → **Add rule**:

- Type: **HTTP** (auto-fills TCP / port 80)
- Source: **Anywhere-IPv4** (`0.0.0.0/0`) for a public site, or **My IP** while it's still unreleased brand work
- Description: `crayhill http`

Amazon Linux 2023 does not run `firewalld` by default, so the security group is the only gate. If `sudo systemctl is-active firewalld` reports `active`, also open it at the host:

```sh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

### 6. Browse to it

```sh
curl -s http://checkip.amazonaws.com   # the instance's public IP
```

Open `http://<that-IP>/` in a browser.

### Log locations

- Access log: `/var/log/httpd/crayhill_access.log`
- Error log: `/var/log/httpd/crayhill_error.log`
- Service status / restart: `sudo systemctl status httpd`, `sudo systemctl reload httpd`

---

## First-time deploy checklist

Ordered steps for the very first deploy onto a fresh Amazon Linux 2023 EC2 box. Static frontend only (see "EC2 deployment" above for full detail).

1. SSH into the instance.
2. Install git and Node (LTS) if not already present, then clone the repo (on the current box it lives at `/var/www/crayhill2026`).
3. Build the frontend:
   ```sh
   cd /var/www/crayhill2026/frontend
   npm ci
   npm run build
   ```
4. Install Apache: `sudo dnf install -y httpd && sudo systemctl enable --now httpd`.
5. Create the docroot and copy the build:
   ```sh
   sudo mkdir -p /var/www/crayhill
   sudo cp -r /var/www/crayhill2026/frontend/dist/. /var/www/crayhill/
   sudo chown -R apache:apache /var/www/crayhill
   sudo restorecon -R /var/www/crayhill   # if SELinux is enforcing
   ```
6. Create `/etc/httpd/conf.d/crayhill.conf` via `bash scripts/setup-api-ec2.sh` (installs PHP-FPM + API routing + SPA fallback), then confirm `sudo apachectl configtest`.
7. Disable `welcome.conf` if the Apache test page shows instead of the site.
8. Open inbound port 80 in the instance's security group.
9. Smoke test (`curl http://localhost/` and `curl http://localhost/api/v1/health`) and confirm in a browser at `http://<public-ip>/`.

---

## Routine deploy checklist

Steps for every subsequent deploy of the static frontend after the box is already provisioned. It's a single command:

```sh
cd /var/www/crayhill2026/frontend
npm run deploy
```

`npm run deploy` (defined in `frontend/package.json`) runs `scripts/deploy-ec2.sh`, which does the whole pipeline in order:

1. `git pull` (fetch + merge) in the repo root.
2. `npm ci` in `frontend/` — clean, lockfile-exact dependency install.
3. Re-executes itself with the freshly pulled code (the script is committed, so the pull in step 1 can rewrite it — re-exec guarantees the build/publish steps run the updated version, guarded by the `CRAYHILL_DEPLOY_PULLED` env var so it doesn't loop).
4. `npm run build` — produces `frontend/dist`.
5. Publishes `dist/` to the Apache docroot (`/var/www/crayhill`): clears stale files first so deleted assets don't linger, fixes ownership to `apache`, re-applies SELinux labels when enforcing, and reloads `httpd`.

The publish steps use `sudo`, so the command prompts for your password (or runs straight through with passwordless sudo). A `git pull` that hits a merge conflict aborts the deploy before anything is published.

Escape hatch — `CRAYHILL_SKIP_PULL=1 npm run deploy` skips the `git pull` + `npm ci` and just rebuilds and republishes the current working tree (useful when iterating on the box without a new commit).

Override the paths on a box with a different layout:

```sh
CRAYHILL_DOCROOT=/srv/www/crayhill npm run deploy
```

The manual equivalent (what the script automates) remains:

```sh
npm run build
sudo cp -r /var/www/crayhill2026/frontend/dist/. /var/www/crayhill/
sudo chown -R apache:apache /var/www/crayhill
sudo restorecon -R /var/www/crayhill            # if SELinux is enforcing
sudo systemctl reload httpd
```

Then re-run the smoke test and confirm in a browser. Apache config (`crayhill.conf`) only changes when the deploy topology changes, not on a routine content/build deploy.

---

## Troubleshooting

> Add an entry here every time we hit a real failure mode and figure out the fix.

- **News & Insights / Careers show no articles or jobs (empty or error state).** The frontend calls `/api/v1/news` and `/api/v1/careers`. Diagnose in order:
  1. **Local dev:** Is `npm run dev:api` running in a second terminal? Vite proxies `/api` to `127.0.0.1:8000`; without the PHP server you get `[vite] http proxy error ... ECONNREFUSED` and the pages fail.
  2. **EC2:** Did you run `bash /var/www/crayhill2026/scripts/setup-api-ec2.sh` once? Until PHP-FPM is wired, Apache's SPA `FallbackResource` returns `index.html` for `/api/v1/*` — the browser can't parse that as JSON.
  3. **Quick check on the box:**
     ```sh
     curl -s http://localhost/api/v1/health | head -c 200
     ```
     Expect JSON with `"database":{"connected":true,...}`. If you see `<!doctype html`, the API is not wired. If JSON shows `"connected":false`, see the RDS troubleshooting entries below.
- **`npm run deploy` prints `WARNING: /api/v1/health returned HTML`.** Same as (2) above — run `scripts/setup-api-ec2.sh` on the EC2 instance after provisioning `.config/secrets.env`.
- **`GET /api/v1/health` returns HTTP 500 (Content-Type: text/html) after `setup-api-ec2.sh`.** PHP-FPM is wired but the request fails before JSON is emitted — usually secrets permissions or the FPM socket path. Diagnose on the box:
  ```sh
  # Env loader must succeed as the apache user (same user PHP-FPM uses)
  sudo -u apache php -r "require '/var/www/crayhill2026/api/lib/env.php'; echo env('APP_ENV'), PHP_EOL;"
  ls -la /var/www/crayhill2026/.config/
  ls -la /run/php-fpm/
  grep listen /etc/php-fpm.d/www.conf
  sudo tail -30 /var/log/httpd/crayhill_error.log
  ```
  **Fix (most common):** the `.config/` directory itself must be traversable by `apache`, not just `secrets.env`. Re-run the setup script from a current repo pull (it sets `.config/` to `750` + group `apache`, labels the whole dir under SELinux, and substitutes the live FPM socket into the vhost). Manual equivalent:
  ```sh
  sudo chgrp apache /var/www/crayhill2026/.config
  sudo chmod 750 /var/www/crayhill2026/.config
  sudo chown ec2-user:apache /var/www/crayhill2026/.config/secrets.env
  sudo chmod 640 /var/www/crayhill2026/.config/secrets.env
  sudo chcon -R -t httpd_sys_content_t /var/www/crayhill2026/.config   # if SELinux enforcing
  bash /var/www/crayhill2026/scripts/setup-api-ec2.sh
  ```
  Expect `GET /api/v1/health` → HTTP 200 with JSON. `"database":{"connected":false,...}` means env is fine but RDS is unreachable — see the RDS entries below.
- **`npm install` fails inside `frontend/` with `ENOENT package.json` from the repo root.** You ran `npm install` from a shell that wasn't actually `cd`'d into `frontend/`. Verify with `pwd` first; npm walks **up** the tree looking for `package.json` and will report the topmost path it tried.
- **`tsc -b` fails with `error TS5101: Option 'baseUrl' is deprecated`.** TypeScript 6 deprecated `baseUrl`. Use `paths` alone with paths relative to the tsconfig file (already configured this way in `frontend/tsconfig.app.json`).
- **Vite dev server says "Port 5173 is in use" and picks 5174.** Usually a previous `vite` process didn't fully release the port. Find and kill it: `lsof -ti:5173 | xargs kill`. If nothing's listening but the port is still claimed, give it ~30 seconds for the OS to clear `TIME_WAIT` state, or just use the new port.
- **`/api/v1/health` reports `database.connected: false` with `error: "connection_failed"`.** The PHP API can't reach RDS. Check the PHP server log — the actual underlying error is recorded there (with full SQLSTATE / network detail). Diagnose first:
  ```sh
  dig +short <DB_HOST>            # what does the hostname resolve to?
  ```
  - **Empty / NXDOMAIN** → instance isn't publicly accessible at all.
  - **Private IP (e.g. `172.31.x.x` or `10.x.x.x`)** → instance has **Publicly accessible: No**; you can resolve the name but not route to it from outside the VPC.
  - **Public IP** → DNS is fine; the failure is at the TCP/SSL layer (security group, network ACL, or cert issue).

  Two paths forward:
  1. Temporarily set the RDS instance to **Publicly accessible: Yes** and add your dev IP to the security group's inbound 3306 rule (see "AWS RDS access for local development" below). Easiest for development; lock it back down before any sensitive data lands in the DB.
  2. Provision the EC2 instance, SSH-tunnel from your dev machine through EC2 to RDS, point `DB_HOST` at `127.0.0.1` for the duration of the tunnel. Slower to set up but matches production network topology.
- **`SQLSTATE[HY000] [2002] SSL connection error: ...` or `unable to verify server certificate`.** Either the CA bundle is missing/stale or you're connecting via raw IP instead of the RDS hostname (the cert is issued for the hostname). Refresh the bundle (`curl ... > api/certs/aws-rds-ca-bundle.pem`) and confirm `DB_HOST` in `.config/secrets.env` is the full RDS endpoint hostname, not an IP.
- **`php` command not found after `brew install php@8.3`.** `php@8.3` is keg-only — brew installs it but doesn't symlink it into your PATH. Either use the full path `/opt/homebrew/opt/php@8.3/bin/php` or add `export PATH="/opt/homebrew/opt/php@8.3/bin:$PATH"` to your shell rc file.
- **`Required env key missing or empty: DB_HOST` (or similar) from the API.** The PHP env loader couldn't find a required value in `.config/secrets.env`. Either the file doesn't exist (run `cp .config/secrets.env.example .config/secrets.env` and fill in values), or the named key is missing/blank in the file.
- **Everything under `/icons/...` returns 404 (e.g. the footer LinkedIn mark), but other static assets like `/crayhill-r-logo-svg/...` load fine.** The file is present in the docroot but a request to it 404s with Apache's default error page (not the SPA `FallbackResource`). Cause: Apache's stock `/etc/httpd/conf.d/autoindex.conf` defines a server-wide `Alias /icons/ "/usr/share/httpd/icons/"` for directory-listing icons. It loads before `crayhill.conf` (alphabetical) and shadows the `DocumentRoot`, so `/icons/*` maps to the system icons dir, not the site's `assets/icons/`. The site doesn't use Apache directory listings, so comment that alias out and reload:
  ```sh
  sudo sed -i 's|^Alias /icons/|#Alias /icons/|' /etc/httpd/conf.d/autoindex.conf
  sudo apachectl configtest && sudo systemctl reload httpd
  curl -sI http://localhost/icons/icon-linkedin.svg | head -1   # expect HTTP/1.1 200 OK
  ```
  Note this edits a package-managed file; if a future `dnf update httpd` restores the alias and the icons 404 again, re-apply the comment (or move the override into a `00-`-prefixed conf in `conf.d/` that loads first). The app deliberately uses the `/icons/` URL per the brand asset convention (`assets/icons/` → `/icons/...`); neutralizing the stock alias is the agreed resolution rather than renaming the asset path.
