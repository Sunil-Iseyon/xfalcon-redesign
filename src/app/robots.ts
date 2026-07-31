import type { MetadataRoute } from 'next';
import { CANONICAL_ORIGIN } from '@/lib/app-config';

/*
  There was no robots.txt at all: the path fell through to the [...slug]
  catch-all and answered a crawler's robots request with a 307 to the homepage
  (QA SEO audit P0-4).

  Two disallows, both deliberate:

  - /admin  TinaCMS's entry point returns 200 with <title>TinaCMS</title>. A CMS
            login page in Google results for "xfalcon" is a credibility problem
            and free reconnaissance. next.config.ts also sends X-Robots-Tag on
            /admin/*, because robots.txt alone does not deindex a URL Google
            already knows.
  - /demos/demo
            The raw demo paths (/demos/demo4/...) still serve the same bytes as
            the clean slug URLs, so every demo is reachable at two addresses and
            the static HTML cannot carry a canonical tag. Blocking the raw prefix
            leaves exactly one indexable address per demo. Safe by construction:
            scripts/generate-demo-slug-map.mjs rejects any slug starting with
            "demo" + a digit, so no clean URL can ever match this prefix. It also
            covers the .pptx/.xlsx demo artifacts, which live under those paths.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/demos/demo'],
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
    host: CANONICAL_ORIGIN,
  };
}
