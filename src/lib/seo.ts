import type { Metadata } from 'next';

/**
 * Per-route metadata builder.
 *
 * Three reasons this exists rather than hand-writing metadata per page:
 *
 * 1. Next merges `metadata` SHALLOWLY. A page that declares `openGraph` at all
 *    replaces the root layout's entire `openGraph` object - so a page setting
 *    just `openGraph.title` silently loses `images`, `siteName`, `type` and
 *    `locale`, and its shares unfurl with no card image. Every field has to be
 *    restated per route, which is exactly the kind of thing that rots by hand.
 * 2. Without a per-page `openGraph.url`, every route inherited the layout's
 *    `url: '/'`. LinkedIn and Slack treat og:url as the share target, so a
 *    share of /pricing unfurled as - and linked to - the homepage, collapsing
 *    every inner-page share into one entry (QA SEO audit P0-3).
 * 3. Nothing set `alternates.canonical`, so with a www/apex pair plus Vercel
 *    preview domains live at once, Google was free to pick its own canonical
 *    (P0-2).
 *
 * Canonical and og:url are RELATIVE here on purpose - Next resolves them
 * against `metadataBase` in the root layout, so they follow the deployment
 * instead of hardcoding a host.
 */

export const OG_IMAGE = {
  url: '/brand/hero/og_1200x630.png',
  width: 1200,
  height: 630,
  alt: 'xFalcon - know what changed, see why, decide what to do',
};

interface PageMetadataInput {
  /** Route path, leading slash, no trailing slash. '/' for the homepage. */
  path: string;
  /** Feeds <title> through the layout's '%s - xFalcon' template. */
  title: string;
  /** Used verbatim for the meta description AND the social description. */
  description: string;
  /**
   * Social headline, when the SERP title is too terse to stand alone in a
   * LinkedIn card. Defaults to the composed page title.
   */
  socialTitle?: string;
}

export function pageMetadata({
  path,
  title,
  description,
  socialTitle,
}: PageMetadataInput): Metadata {
  const shareTitle = socialTitle ?? `${title} - xFalcon`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: 'xFalcon',
      images: [OG_IMAGE],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
