import fs from 'fs';
import path from 'path';
import defaultLandingContent from '@/content/landing.json';

/**
 * Content loading - local files only.
 *
 * landing.json and the legal JSON files are read straight from the repo
 * (TinaCMS writes to these same files through /admin). The former Tina Cloud
 * GraphQL fetch path was dead code and has been removed - if it is ever
 * needed again, the schema in tina/config.ts, the types here, and
 * src/content/landing.json must be kept in lockstep.
 */

/* ============================================================
   Types - mirror tina/config.ts `landing` collection exactly
   ============================================================ */

export interface CtaLink {
  label: string;
  href: string;
}

export interface LandingPageContent {
  hero: {
    eyebrow: string;
    heading: string;
    subhead: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
    statPills: string[];
  };
  whatYouGet: {
    eyebrow: string;
    heading: string;
    items: { title: string; description: string }[];
  };
  demosTeaser: {
    eyebrow: string;
    heading: string;
    subheading: string;
    ctaLabel: string;
  };
  cta: {
    heading: string;
    description: string;
    ctaLabel: string;
  };
  contactInfo: {
    email: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
}

export interface DemoEntry {
  title: string;
  description: string;
  path: string;
  thumbnail: string;
  category: string;
  featured: boolean;
  order: number;
}

export type LegalPageSlug = 'privacy-policy' | 'terms-of-service' | 'security-and-trust';

export interface LegalPageContent {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

/* ============================================================
   Paths
   ============================================================ */

const LANDING_CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'landing.json');
const DEMOS_CONTENT_PATH = path.join(process.cwd(), 'content', 'demos');
const LEGAL_CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'legal');

/* ============================================================
   Landing content
   ============================================================ */

export function getLandingContent(): LandingPageContent {
  try {
    const raw = fs.readFileSync(LANDING_CONTENT_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<LandingPageContent>;
    return normalizeLandingContent(parsed);
  } catch (error) {
    console.error('Error reading landing content, using defaults:', error);
    return defaultLandingContent as LandingPageContent;
  }
}

function normalizeLandingContent(content: Partial<LandingPageContent>): LandingPageContent {
  const defaults = defaultLandingContent as LandingPageContent;
  return {
    hero: { ...defaults.hero, ...content.hero },
    whatYouGet: { ...defaults.whatYouGet, ...content.whatYouGet },
    demosTeaser: { ...defaults.demosTeaser, ...content.demosTeaser },
    cta: { ...defaults.cta, ...content.cta },
    contactInfo: { ...defaults.contactInfo, ...content.contactInfo },
    footer: { ...defaults.footer, ...content.footer },
  };
}

/* ============================================================
   Legal pages
   ============================================================ */

export function getLegalPageContent(slug: LegalPageSlug): LegalPageContent {
  try {
    const raw = fs.readFileSync(path.join(LEGAL_CONTENT_PATH, `${slug}.json`), 'utf-8');
    return JSON.parse(raw) as LegalPageContent;
  } catch (error) {
    console.error(`Error reading ${slug} content:`, error);
    return {
      title: 'Content unavailable',
      lastUpdated: '',
      intro: 'This page could not be loaded. Please contact info@iseyon.com.',
      sections: [],
    };
  }
}

/* ============================================================
   Demos - markdown frontmatter in content/demos/*.md.
   resolveDemoPath walks public/ to find each demo's index.html,
   including single nested (URL-encoded) child directories.
   Ported verbatim from the previous implementation - do not "simplify".
   ============================================================ */

export function getDemoEntries(): DemoEntry[] {
  try {
    if (!fs.existsSync(DEMOS_CONTENT_PATH)) {
      return [];
    }

    const files = fs
      .readdirSync(DEMOS_CONTENT_PATH)
      .filter((fileName) => fileName.endsWith('.md'));

    const entries = files
      .map((fileName) => {
        const raw = fs.readFileSync(path.join(DEMOS_CONTENT_PATH, fileName), 'utf-8');
        return normalizeDemoEntry(parseFrontmatter(raw));
      })
      .filter((entry): entry is DemoEntry => Boolean(entry));

    return sortDemoEntries(entries);
  } catch (error) {
    console.error('Error reading demos content:', error);
    return [];
  }
}

function parseFrontmatter(markdown: string): Partial<DemoEntry> {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  const frontmatter = match[1];
  const result: Partial<DemoEntry> = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key === 'featured') {
      result.featured = value.toLowerCase() === 'true';
      continue;
    }

    if (key === 'order') {
      const order = Number(value);
      if (!Number.isNaN(order)) {
        result.order = order;
      }
      continue;
    }

    if (key === 'title') result.title = value;
    if (key === 'description') result.description = value;
    if (key === 'path') result.path = value;
    if (key === 'thumbnail') result.thumbnail = value;
    if (key === 'category') result.category = value;
  }

  return result;
}

function normalizeDemoEntry(entry: Partial<DemoEntry>): DemoEntry | null {
  const title = String(entry.title ?? '').trim();
  const demoPath = resolveDemoPath(String(entry.path ?? '').trim());

  if (!title || !demoPath || !isValidDemoPath(demoPath)) {
    return null;
  }

  return {
    title,
    description: entry.description ? String(entry.description).trim() : '',
    path: demoPath,
    thumbnail: entry.thumbnail ? String(entry.thumbnail).trim() : '',
    category: entry.category ? String(entry.category).trim() : '',
    featured: Boolean(entry.featured),
    order: typeof entry.order === 'number' ? entry.order : Number.MAX_SAFE_INTEGER,
  };
}

function normalizeDemoPath(value: string): string {
  if (!value) {
    return '';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  if (withLeadingSlash.endsWith('.html')) {
    return withLeadingSlash;
  }

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function resolveDemoPath(value: string): string {
  const normalizedPath = normalizeDemoPath(value);
  if (!normalizedPath) {
    return '';
  }

  const relativeDemoPath = normalizedPath.replace(/^\//, '').replace(/\/$/, '');
  const fileSystemRelativePath = decodePathForFileSystem(relativeDemoPath);
  const absoluteDemoPath = path.join(process.cwd(), 'public', fileSystemRelativePath);

  if (normalizedPath.endsWith('.html') && fs.existsSync(absoluteDemoPath)) {
    return normalizedPath;
  }

  const directIndexPath = path.join(absoluteDemoPath, 'index.html');

  if (fs.existsSync(directIndexPath)) {
    return `${normalizedPath}index.html`;
  }

  if (!fs.existsSync(absoluteDemoPath)) {
    return '';
  }

  const childDirectories = fs
    .readdirSync(absoluteDemoPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (childDirectories.length !== 1) {
    return '';
  }

  const childDir = childDirectories[0];
  const childIndexPath = path.join(absoluteDemoPath, childDir, 'index.html');
  if (!fs.existsSync(childIndexPath)) {
    return '';
  }

  const childUrlSegment = childDir
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${normalizedPath}${childUrlSegment}/index.html`;
}

function isValidDemoPath(value: string): boolean {
  // Any .html under /demos/ - not just index.html (e.g. demo6's pmr-dashboard.html).
  return /^\/demos\/.+(\/|\.html)$/.test(value);
}

function decodePathForFileSystem(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function sortDemoEntries(entries: DemoEntry[]): DemoEntry[] {
  return [...entries].sort((a, b) => {
    const aOrder = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
    const bOrder = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.title.localeCompare(b.title);
  });
}
