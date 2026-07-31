function coerceAbsoluteUrl(value: string | undefined | null): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed);
  } catch {
    // Common deployment mistake: host without protocol.
    if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(trimmed)) {
      try {
        return new URL(`https://${trimmed}`);
      } catch {
        return null;
      }
    }

    return null;
  }
}

/**
 * The site's own address, used for identity that must not move with the
 * deployment: JSON-LD `url`/`logo`, robots.txt's sitemap line, sitemap entries.
 *
 * Kept as a named constant rather than derived from the environment because a
 * preview deployment should still describe the production site in structured
 * data. Canonical/OG URLs, by contrast, follow METADATA_BASE_URL below.
 *
 * NB: this is the www host, matching what the JSON-LD has always claimed. If
 * the apex (xfalcon.ai) is the canonical host in DNS instead, change it here -
 * having structured data and canonical tags disagree on the host is exactly how
 * ranking signals get split across two "different" sites.
 */
export const CANONICAL_ORIGIN = 'https://www.xfalcon.ai';

/**
 * Resolution order matters. The last-resort fallback is the production origin
 * rather than localhost so that a missing NEXT_PUBLIC_APP_URL degrades to
 * correct-in-production instead of publishing og:image URLs pointing at
 * localhost, which unfurl as a bare text link (QA SEO audit P0-1). Localhost is
 * still the fallback outside production so local shares stay obviously local.
 */
function getResolvedAppUrl(): URL {
  return (
    coerceAbsoluteUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    coerceAbsoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    coerceAbsoluteUrl(process.env.VERCEL_URL) ||
    (process.env.NODE_ENV === 'production'
      ? new URL(CANONICAL_ORIGIN)
      : new URL('http://localhost:3090'))
  );
}

export const APP_URL = getResolvedAppUrl().toString().replace(/\/$/, '');
export const METADATA_BASE_URL = getResolvedAppUrl();