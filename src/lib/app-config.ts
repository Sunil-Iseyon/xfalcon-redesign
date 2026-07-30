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

function getResolvedAppUrl(): URL {
  return (
    coerceAbsoluteUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    coerceAbsoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    coerceAbsoluteUrl(process.env.VERCEL_URL) ||
    new URL('http://localhost:3090')
  );
}

export const APP_URL = getResolvedAppUrl().toString().replace(/\/$/, '');
export const METADATA_BASE_URL = getResolvedAppUrl();