/**
 * add-demo-sri.mjs
 *
 * One-time script: adds SRI integrity hashes to every chart.js CDN <script>
 * tag in public/demos/**\/*.html.
 *
 * Strategy
 * ────────
 * • All variant URLs (chart.js@4, chart.js@4.4.0/dist/chart.umd.js, etc.)
 *   are normalised to the pinned minified build:
 *     https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
 * • The SHA-384 hash is computed live from the downloaded bytes so the value
 *   is always correct regardless of when this script is run.
 * • Google Fonts and rsms.me CSS <link> tags are left untouched — jsDelivr /
 *   Google serve these responses dynamically per User-Agent, making SRI
 *   hashes impractical for CSS delivered from those hosts.
 * • .js generator files (generate-dashboards.js) are skipped — they are not
 *   served as web pages.
 *
 * Usage
 * ─────
 *   node scripts/add-demo-sri.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { createHash } from 'crypto';
import https from 'https';
import http from 'http';

const DEMOS_ROOT = new URL('../public/demos', import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, '$1'); // fix Windows path: /C:/... → C:/...

const PINNED_URL =
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

// Matches any <script src="https://cdn.jsdelivr.net/npm/chart.js@…"> tag that
// does NOT already have an integrity attribute.
const CHART_TAG_RE =
  /<script(?![^>]*\bintegrity\b)[^>]*\bsrc="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js@[^"]*"[^>]*><\/script>/g;

// ── helpers ──────────────────────────────────────────────────────────────────

function fetchBuffer(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    client
      .get(url, { headers: { 'Accept-Encoding': 'identity' } }, (res) => {
        if (
          redirects > 0 &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return fetchBuffer(res.headers.location, redirects - 1)
            .then(resolve)
            .catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

function sriHash(buf) {
  return 'sha384-' + createHash('sha384').update(buf).digest('base64');
}

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, out);
    } else if (extname(entry.name) === '.html') {
      out.push(full);
    }
  }
  return out;
}

// ── main ─────────────────────────────────────────────────────────────────────

console.log(`Downloading: ${PINNED_URL}`);
const buf = await fetchBuffer(PINNED_URL);
const integrity = sriHash(buf);
console.log(`SRI:         ${integrity}\n`);

const replacement =
  `<script src="${PINNED_URL}" integrity="${integrity}" crossorigin="anonymous"></script>`;

const htmlFiles = walkHtml(DEMOS_ROOT);
let patched = 0;
let skipped = 0;

for (const file of htmlFiles) {
  const original = readFileSync(file, 'utf8');
  CHART_TAG_RE.lastIndex = 0;

  if (!CHART_TAG_RE.test(original)) {
    skipped++;
    continue;
  }

  CHART_TAG_RE.lastIndex = 0;
  const updated = original.replace(CHART_TAG_RE, replacement);

  if (updated !== original) {
    writeFileSync(file, updated, 'utf8');
    patched++;
    const rel = file.replace(DEMOS_ROOT, '').replace(/\\/g, '/');
    console.log(`  patched  ${rel}`);
  } else {
    skipped++;
  }
}

console.log(`\nDone — ${patched} file(s) patched, ${skipped} already clean.\n`);
console.log(
  'NOTE: Google Fonts <link> tags were intentionally left without SRI.\n' +
    'Google generates these CSS responses dynamically per User-Agent, so\n' +
    'a fixed hash would fail for many visitors.',
);
