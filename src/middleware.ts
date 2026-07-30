import { NextResponse, type NextRequest } from 'next/server';

/**
 * Generates a per-request nonce and injects a strict Content-Security-Policy
 * header for all app routes (excludes /demos/, /admin/, and Next.js internals).
 *
 * Why middleware and not next.config.ts headers()?
 * Static headers cannot contain a per-request nonce, so 'unsafe-inline' would
 * be required for Next.js hydration scripts. A nonce issued here is read by
 * the Next.js App Router runtime (via x-nonce) and stamped onto every inline
 * <script> it emits, allowing us to drop 'unsafe-inline' entirely.
 *
 * CSP notes:
 * - 'nonce-{nonce}': authorises inline scripts that carry the matching nonce
 *   attribute — Next.js applies this automatically to its hydration scripts.
 * - https://va.vercel-scripts.com: Vercel Analytics external script host.
 * - 'unsafe-inline' is intentionally kept in style-src: Tailwind CSS and
 *   Next.js App Router still inject inline styles; nonce-based style CSP
 *   requires additional framework support not yet in place.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https://content.tinajs.io https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');

  // Pass nonce to the App Router runtime so it stamps hydration scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set on the response so browsers enforce the policy.
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    {
      // App routes only — skip Next.js internals, static assets, demos, admin.
      source: '/((?!_next/static|_next/image|favicon\\.ico|demos/|admin/).*)',
      missing: [
        // Skip prefetch requests; their RSC payload carries no inline scripts
        // so a mismatched nonce would silently block nothing but wastes a nonce.
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
