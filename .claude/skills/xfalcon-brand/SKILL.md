---
name: xfalcon-brand
description: xFalcon / Iseyon brand system. Load before writing any UI, styles, copy, metadata, or marketing content in this repo - covers color tokens, typography, voice, logo rules, layout conventions, and engineering guardrails.
---

# xFalcon brand system

The single source of truth for how xFalcon looks, reads, and is built. If another
document disagrees (old brand-pack PDFs, the trifold's serif headlines, prototype HTML),
this file wins.

## 1. Identity

- Product: **xFalcon** - lowercase `x`, capital `F`. Never "XFalcon", "xfalcon", or "X-Falcon" in prose.
- Company: **Iseyon** (Iseyon Analytics in formal/legal contexts). Copyright line: `© 2026 Iseyon. All rights reserved.`
- Domain: `xfalcon.ai`. Positioning line: "Business intelligence for the AI era."
- The falcon mark is the brand's only illustration. No mascots, no stock art, no generated imagery.

## 2. Color

Light mode is the default everywhere. Dark mode is a faithful navy variant behind a toggle.
Components NEVER hardcode hex values - they reference semantic tokens (CSS classes built on
`var(--*)`). The tokens remap via `[data-theme]` on `<html>`.

| Semantic token | Light (default) | Dark |
|---|---|---|
| `--bg` | `#F5F8FC` | `#061122` |
| `--surface` | `#FFFFFF` | `#0D1828` |
| `--surface-raised` | `#FFFFFF` (+ border + soft shadow) | `#0E1B30` |
| `--surface-sunken` | `#EDF2F9` | `#040A17` |
| `--text` | `#0B1220` | `#EAF2FF` |
| `--text-secondary` | `#44556B` | `#B8C0CC` |
| `--text-muted` | `#8A98AC` | `#7E8696` |
| `--border` | `#DCE5EF` | `#1D2A3A` |
| `--border-strong` | `#C4D2E3` | `#2A3B52` |
| `--accent` | `#229CB1` (deep cyan) | `#2ED1ED` (bright cyan) |
| `--accent-bright` | `#2ED1ED` | `#2ED1ED` |
| `--accent-soft` | `rgba(34,156,177,.10)` | `rgba(46,209,237,.10)` |

Rules:
- Bright cyan `#2ED1ED` fails AA as text on white. On light backgrounds it is decoration
  only (logo, small markers, glows); anything readable or interactive uses `--accent`.
- Never pure black. Never the old placeholder blue `#1f9cf0`.
- Depth comes from a subtle radial glow (navy pool + faint cyan), not flat fills or heavy shadows.
- Red/orange (`#E2685A`) is reserved for warnings and negative deltas only.

## 3. Typography

All sans-serif. The serif era (Buenard) is retired - do not reintroduce serifs, and do not
use Inter (deliberately avoiding the default look).

- **Headlines + body + UI: Hanken Grotesk**, self-hosted variable woff2 via `next/font/local`
  (`--font-hanken`). Weights: 400 body, 500 UI labels, 600 subheads/buttons, 700 headlines. No italics.
- **Eyebrows / data labels: Geist Mono** (`--font-geist-mono`), uppercase, `letter-spacing: 0.18em`,
  11-13px, in the accent color. This is the "data" voice: `BUSINESS INTELLIGENCE FOR THE AI ERA`.
- Scale (rem, clamp): hero `clamp(2.4rem, 5vw, 3.75rem)`; section h2 `clamp(1.75rem, 3.5vw, 2.5rem)`;
  body 1-1.125rem; eyebrow 0.75rem; caption 0.8rem. Headlines: weight 700, `letter-spacing: -0.01em`.
- Sentence case for headings and body. ALL CAPS only for short eyebrow labels.

## 4. Voice

- **Brief and concise. Never overexplain.** State the claim and the proof, then stop -
  depth belongs in the sales conversation. Short headlines; 1-2 supporting sentences per
  block; no walls of text; no feature-list padding.
- Confident, concrete, corporate. Lead with the outcome, then the evidence.
- No hype words: revolutionary, supercharge, unleash, game-changing, cutting-edge.
- **Hyphens only** - never em dashes or en dashes, including ranges: `4-6 weeks`, `75-93%`.
- Straight quotes only (`'` `"`), never curly quotes.
- Numbers stated plainly: `$10 per user per month`, `$3,500`.
- The middot `·` is allowed as a separator inside eyebrow lines: `TRUSTED DATA · LIVE DEMO`.
- Key message set (from the conference trifold - reuse, don't paraphrase into hype):
  - "Know what changed. See why. Decide what to do."
  - "Answers people can actually trust."
  - "From live data to a decision you can defend."
  - Stats: 4-6 weeks to live · Zero data migration · 75-93% lower two-year TCO · Every answer checked.

## 5. Logo

- Falcon mark: `public/brand/logo/mark_darkcyan_on_light_1024.png` (light theme) and
  `mark_white_on_dark_1024.png` (dark theme), swapped via `.logo-light-only` / `.logo-dark-only`.
  Source master: `xfalcon_bird_transparent.png` at **228x162 - a 1.41:1 landscape rectangle.
  Never squash it square**; if you set width, height = width / 1.41.
- Lockup: mark left of the wordmark "xFalcon" (Hanken Grotesk 600; the `x` in the accent color),
  vertically centered, small gap.
- Minimum mark height 24px. Clear space = the mark's own height on all sides.
- Never recolor, box, shadow, rotate, or place on low-contrast backgrounds.

## 6. Layout conventions

- Containers: `max-width` ~72-80rem (`max-w-7xl`), horizontal padding 1.5rem mobile / 2rem desktop.
- Section rhythm: `padding-block` 5rem mobile / 7rem desktop. Every section: eyebrow, then h2,
  then optional 1-sentence subhead, then content.
- Cards: `--surface-raised`, 1px `--border`, radius 12-16px, soft shadow on light only.
- Buttons: primary = accent fill, navy/white text per theme; secondary = 1px border, text color.
  Both get visible `:focus-visible` rings in the accent.
- Stat pills: 1px accent border, transparent fill, rounded-full.
- Motion: one orchestrated idea per section maximum; everything else is a quiet fade/rise.
  Always honor `prefers-reduced-motion` (jump to final state).

## 7. Engineering guardrails

- **All styling lives in CSS files** - `globals.css` for tokens/base/shared recipes, per-section
  CSS files for section-specific classes. **No inline `style={{}}` in JSX, no arbitrary hex in
  class names.** One place to adjust; everything stays consistent.
- Theme switching only via `data-theme` on `<html>`; persisted in `localStorage('xf-theme')`;
  default light. The no-FOUC script runs in `<head>` and **must carry the CSP nonce**
  (read `x-nonce` from headers in the layout) - same for any inline script incl. JSON-LD.
- Fonts self-hosted only (`font-src 'self'` in CSP). No Google Fonts CDN, no CDN scripts.
- TinaCMS three-way rule: `tina/config.ts` schema, `src/content/landing.json`, and the types in
  `src/lib/content.ts` must change together; run `npx tinacms build` after any schema edit.
- Never edit `src/middleware.ts` matcher casually - `/demos/` static files are deliberately
  CSP-exempt while the `/demos` index page is not.
