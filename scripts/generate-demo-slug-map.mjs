/**
 * generate-demo-slug-map.mjs
 *
 * Regenerates src/lib/demo-slug-map.ts - the static slug -> real static path
 * table that src/proxy.ts uses to serve clean demo URLs
 * (/demos/rush-energy/ instead of /demos/demo4/Falcon%20...%20Red%20One/).
 *
 * Why a generated module and not a runtime lookup?
 * ────────────────────────────────────────────────
 * The proxy has to answer this question on every request to /demos/<slug>/...
 * and it cannot touch the filesystem (it may run on the Edge runtime, and the
 * real demo folders only exist in public/). So the map is resolved once, here,
 * and committed as a plain TypeScript object.
 *
 * The path-resolution rules below are the same ones src/lib/content.ts applies
 * in resolveDemoPath(): a folder path resolves to its index.html, descending
 * through exactly one nested child directory if needed, and an explicit .html
 * path is used verbatim. That logic is duplicated because content.ts is
 * TypeScript and this script is plain node - tests/demo-slugs.test.ts asserts
 * the two agree, so drift fails the test run rather than shipping.
 *
 * Usage
 * ─────
 *   node scripts/generate-demo-slug-map.mjs
 *
 * Run it after adding, renaming or re-pathing a demo in content/demos/*.md
 * (or after moving folders under public/demos/) and commit the result.
 * Deliberately NOT wired into postinstall or the build: the committed file is
 * the source of truth at request time and `next build` must not depend on
 * public/ folder layout.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEMOS_CONTENT_PATH = path.join(REPO_ROOT, 'content', 'demos');
const PUBLIC_PATH = path.join(REPO_ROOT, 'public');
const OUTPUT_PATH = path.join(REPO_ROOT, 'src', 'lib', 'demo-slug-map.ts');

/* ---------------------------------------------------------------- parsing */

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  const result = {};

  for (const line of match[1].split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');

    if (key === 'title' || key === 'path' || key === 'slug') {
      result[key] = value;
    }
  }

  return result;
}

/* --------------------------------------------------- slug derivation */

/** Mirrors deriveDemoSlug() in src/lib/content.ts. */
function deriveDemoSlug(title) {
  return title
    .split(' - ')[0]
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Mirrors normalizeDemoSlug() in src/lib/content.ts. */
function normalizeDemoSlug(rawSlug, title) {
  const explicit = deriveDemoSlug(rawSlug);
  return explicit || deriveDemoSlug(title);
}

/* ------------------------------------------------- path resolution */

function normalizeDemoPath(value) {
  if (!value) {
    return '';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  if (withLeadingSlash.endsWith('.html')) {
    return withLeadingSlash;
  }

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function decodePathForFileSystem(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function resolveDemoPath(value) {
  const normalizedPath = normalizeDemoPath(value);
  if (!normalizedPath) {
    return '';
  }

  const relativeDemoPath = normalizedPath.replace(/^\//, '').replace(/\/$/, '');
  const fileSystemRelativePath = decodePathForFileSystem(relativeDemoPath);
  const absoluteDemoPath = path.join(PUBLIC_PATH, fileSystemRelativePath);

  if (normalizedPath.endsWith('.html') && existsSync(absoluteDemoPath)) {
    return normalizedPath;
  }

  if (existsSync(path.join(absoluteDemoPath, 'index.html'))) {
    return `${normalizedPath}index.html`;
  }

  if (!existsSync(absoluteDemoPath) || !statSync(absoluteDemoPath).isDirectory()) {
    return '';
  }

  const childDirectories = readdirSync(absoluteDemoPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (childDirectories.length !== 1) {
    return '';
  }

  const childDir = childDirectories[0];
  if (!existsSync(path.join(absoluteDemoPath, childDir, 'index.html'))) {
    return '';
  }

  const childUrlSegment = childDir
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${normalizedPath}${childUrlSegment}/index.html`;
}

/**
 * Re-encodes every path segment so the value the proxy rewrites to is a valid
 * URL path even when the real folder name contains spaces or "&".
 * Already-encoded segments are left alone (encoding twice turns %20 into %2520).
 */
function encodeUrlPath(urlPath) {
  return urlPath
    .split('/')
    .map((segment) => (/%[0-9A-Fa-f]{2}/.test(segment) ? segment : encodeURIComponent(segment)))
    .join('/');
}

/* ---------------------------------------------------------------- build */

const files = readdirSync(DEMOS_CONTENT_PATH)
  .filter((fileName) => fileName.endsWith('.md'))
  .sort();

const seenSlugs = new Set();
const rows = [];
const problems = [];

for (const fileName of files) {
  const frontmatter = parseFrontmatter(
    readFileSync(path.join(DEMOS_CONTENT_PATH, fileName), 'utf-8'),
  );
  const title = (frontmatter.title ?? '').trim();
  if (!title) {
    problems.push(`${fileName}: missing title`);
    continue;
  }

  const htmlPath = encodeUrlPath(resolveDemoPath((frontmatter.path ?? '').trim()));
  if (!htmlPath || !/^\/demos\/.+\.html$/.test(htmlPath)) {
    problems.push(`${fileName}: could not resolve "${frontmatter.path}" to an .html file under public/`);
    continue;
  }

  const slug = normalizeDemoSlug((frontmatter.slug ?? '').trim(), title);
  if (!slug) {
    problems.push(`${fileName}: slug is empty after normalisation`);
    continue;
  }
  if (/^demo\d/.test(slug)) {
    // The proxy matcher deliberately ignores /demos/demoN/... so those real
    // static paths never enter middleware; a slug shaped like that is unroutable.
    problems.push(`${fileName}: slug "${slug}" may not start with "demo" + a digit`);
    continue;
  }
  if (seenSlugs.has(slug)) {
    problems.push(`${fileName}: duplicate slug "${slug}" - set a unique slug: in the frontmatter`);
    continue;
  }
  seenSlugs.add(slug);

  rows.push({
    slug,
    html: htmlPath,
    dir: htmlPath.slice(0, htmlPath.lastIndexOf('/')),
    source: fileName,
  });
}

if (problems.length > 0) {
  console.error('Cannot generate demo slug map:');
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

rows.sort((a, b) => a.slug.localeCompare(b.slug));

const body = rows
  .map(
    (row) =>
      `  '${row.slug}': {\n` +
      `    html: '${row.html}',\n` +
      `    dir: '${row.dir}',\n` +
      `  },`,
  )
  .join('\n');

const output = `/**
 * GENERATED FILE - DO NOT EDIT BY HAND.
 * Run \`node scripts/generate-demo-slug-map.mjs\` after changing
 * content/demos/*.md or the folder layout under public/demos/.
 *
 * Maps the public demo slug to the real static files under public/demos:
 *   html - the document served for /demos/<slug>/
 *   dir  - the folder every /demos/<slug>/<asset> request resolves against
 *
 * Consumed by src/proxy.ts, which cannot read the filesystem at request time.
 */

export interface DemoSlugTarget {
  /** URL path of the demo's own HTML document, percent-encoded. */
  html: string;
  /** URL path of the folder that HTML document lives in, percent-encoded. */
  dir: string;
}

export const DEMO_SLUG_TARGETS: Record<string, DemoSlugTarget> = {
${body}
};
`;

writeFileSync(OUTPUT_PATH, output, 'utf-8');
console.log(`Wrote ${path.relative(REPO_ROOT, OUTPUT_PATH)} with ${rows.length} demo slugs:`);
for (const row of rows) {
  console.log(`  ${row.slug.padEnd(30)} ${row.html}   (${row.source})`);
}
