/**
 * generate-og-image.mjs
 *
 * Rasterises scripts/og/og-card.html to public/brand/hero/og_1200x630.png, the
 * Open Graph image referenced by src/app/layout.tsx.
 *
 * Usage
 *   node scripts/og/generate-og-image.mjs
 *
 * Run it after editing og-card.html (copy, colours, lockup) and commit the PNG.
 * Deliberately NOT wired into the build: it needs a local Chrome, and the
 * committed PNG is what ships.
 *
 * Why headless Chrome and not next/og (ImageResponse)?
 * next/og rasterises with satori, which does not read woff2 - the only format
 * the brand font is committed in. Chrome renders the real @font-face, so the
 * card's typography is identical to the site's instead of a lookalike.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CARD = path.join(REPO_ROOT, 'scripts', 'og', 'og-card.html');
const OUTPUT = path.join(REPO_ROOT, 'public', 'brand', 'hero', 'og_1200x630.png');

/* Open Graph's de facto standard size; also satisfies Twitter summary_large_image. */
const WIDTH = 1200;
const HEIGHT = 630;

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      'No Chrome found. Install Google Chrome or set CHROME_PATH to a Chromium binary.',
    );
  }
  return found;
}

if (!existsSync(CARD)) {
  throw new Error(`Card template missing: ${CARD}`);
}

mkdirSync(path.dirname(OUTPUT), { recursive: true });

const result = spawnSync(
  findChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${WIDTH},${HEIGHT}`,
    // The card pulls the font and the falcon mark from elsewhere in the repo.
    '--allow-file-access-from-files',
    `--screenshot=${OUTPUT}`,
    '--virtual-time-budget=4000',
    `file://${CARD}`,
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);

if (result.error) {
  throw result.error;
}

if (!existsSync(OUTPUT)) {
  throw new Error(`Chrome exited without writing the screenshot.\n${result.stderr?.toString()}`);
}

console.log(`Wrote ${path.relative(REPO_ROOT, OUTPUT)} (${statSync(OUTPUT).size} bytes, ${WIDTH}x${HEIGHT})`);
