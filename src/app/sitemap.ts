import type { MetadataRoute } from 'next';
import { CANONICAL_ORIGIN } from '@/lib/app-config';
import { DEMO_SLUG_TARGETS } from '@/lib/demo-slug-map';

/*
  There was no sitemap (QA SEO audit P0-4), which is the slowest possible path
  to getting a replacement site indexed - especially for the 22 demo portals,
  which are static HTML with no internal links pointing at them other than the
  /demos grid.

  Absolute URLs are built from CANONICAL_ORIGIN rather than metadataBase on
  purpose: a preview deployment should still advertise the production URLs, not
  its own throwaway host.

  The demo slugs come from the generated map that src/proxy.ts already uses, so
  the sitemap cannot list a demo URL that does not resolve - and adding a demo
  updates the sitemap as a side effect of regenerating that map.
*/

/** Marketing and legal routes, most important first. */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/demos', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/security-and-trust', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = ROUTES.map((route) => ({
    url: `${CANONICAL_ORIGIN}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const demos = Object.keys(DEMO_SLUG_TARGETS)
    .sort()
    .map((slug) => ({
      url: `${CANONICAL_ORIGIN}/demos/${slug}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...pages, ...demos];
}
