import { NextResponse, type NextRequest } from 'next/server';
import { DEMO_SLUG_TARGETS } from '@/lib/demo-slug-map';

/**
 * Two jobs, in this order:
 *
 * 1. Clean demo URLs. /demos/rush-energy/ is rewritten (never redirected) onto
 *    the real static file under public/demos, so the pretty URL stays in the
 *    address bar and the internal folder names stay out of it. Because the URL
 *    keeps its trailing slash, the relative asset references inside the demo
 *    HTML resolve back through /demos/<slug>/... and are rewritten the same way.
 *
 * 2. A per-request nonce plus a strict Content-Security-Policy header for all
 *    app routes (excludes /demos/, /admin/ and Next.js internals).
 *
 * Why proxy and not next.config.ts headers()?
 * Static headers cannot contain a per-request nonce, so 'unsafe-inline' would
 * be required for Next.js hydration scripts. A nonce issued here is read by
 * the Next.js App Router runtime (via x-nonce) and stamped onto every inline
 * <script> it emits, allowing us to drop 'unsafe-inline' entirely.
 *
 * Named `proxy` (not `middleware`) since Next.js 16 - the middleware file
 * convention is deprecated. Proxy also defaults to the Node.js runtime rather
 * than Edge, so `Buffer` and `crypto.randomUUID()` below are native. The slug
 * table is still a plain generated module (src/lib/demo-slug-map.ts) rather
 * than a filesystem walk, so nothing here depends on the Node.js runtime.
 *
 * CSP notes:
 * - 'nonce-{nonce}': authorises inline scripts that carry the matching nonce
 *   attribute - Next.js applies this automatically to its hydration scripts.
 * - https://va.vercel-scripts.com: Vercel Analytics external script host.
 * - 'unsafe-inline' is intentionally kept in style-src: Tailwind CSS and
 *   Next.js App Router still inject inline styles; nonce-based style CSP
 *   requires additional framework support not yet in place.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Clean demo URLs -> real static path. Deliberately no CSP header: this
  //    serves the exact same static demo HTML as /demos/demoN/..., which is
  //    CSP-exempt because those files load Chart.js from a CDN.
  //    NB: build these URLs with `new URL(..., request.url)`, not
  //    nextUrl.clone() - a cloned NextURL re-applies the trailing slash of the
  //    incoming path when it is formatted, which turns the 308 below into a
  //    redirect loop.
  const demoTarget = resolveDemoSlugTarget(pathname);
  if (demoTarget) {
    return NextResponse.rewrite(new URL(`${demoTarget}${request.nextUrl.search}`, request.url));
  }

  // 2. Trailing-slash normalisation. Next's built-in redirect is turned off
  //    (skipTrailingSlashRedirect in next.config.ts) so demo slug URLs above
  //    keep the trailing slash their relative assets depend on; every other
  //    route still gets the 308 it always got.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const trimmedPathname = pathname.replace(/\/+$/, '') || '/';
    return NextResponse.redirect(
      new URL(`${trimmedPathname}${request.nextUrl.search}`, request.url),
      308,
    );
  }

  // 3. Anything left under /demos/ is an unknown slug. Hand it to the router
  //    untouched (the [...slug] catch-all sends it home) and, again, no CSP.
  if (pathname.startsWith('/demos/')) {
    return NextResponse.next();
  }

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

/** Slugs are generated kebab-case ASCII; anything else is not a demo. */
const DEMO_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Maps a clean demo URL onto the real static path under public/demos, or null
 * if this is not one.
 *
 *   /demos/rush-energy            -> /demos/demo4/Falcon%20...%20Red%20One/index.html
 *   /demos/rush-energy/           -> same
 *   /demos/rush-energy/sales.html -> /demos/demo4/Falcon%20...%20Red%20One/sales.html
 *
 * The returned path is always inside the demo's own folder: the slug must be an
 * own property of the generated table, and the remaining segments are rejected
 * outright if they contain any traversal or empty segment, so nothing can be
 * pointed outside public/demos/.
 */
function resolveDemoSlugTarget(pathname: string): string | null {
  if (!pathname.startsWith('/demos/')) {
    return null;
  }

  const rest = pathname.slice('/demos/'.length);
  const separatorIndex = rest.indexOf('/');
  const slug = separatorIndex === -1 ? rest : rest.slice(0, separatorIndex);
  const assetPath = separatorIndex === -1 ? '' : rest.slice(separatorIndex + 1);

  if (!DEMO_SLUG_PATTERN.test(slug) || !Object.hasOwn(DEMO_SLUG_TARGETS, slug)) {
    return null;
  }

  const target = DEMO_SLUG_TARGETS[slug];

  if (assetPath === '') {
    return target.html;
  }

  return isSafeAssetPath(assetPath) ? `${target.dir}/${assetPath}` : null;
}

/**
 * Rejects traversal ("..", "%2e%2e"), empty segments ("//") and backslashes.
 * The check runs on the decoded value so percent-encoded traversal is caught
 * too; an undecodable value is rejected rather than guessed at.
 */
function isSafeAssetPath(assetPath: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(assetPath);
  } catch {
    return false;
  }

  if (decoded.includes('\\') || decoded.includes('\0')) {
    return false;
  }

  return decoded
    .split('/')
    .every((segment, index, segments) =>
      segment === '' ? index === segments.length - 1 : segment !== '.' && segment !== '..',
    );
}

export const config = {
  matcher: [
    {
      // App routes only - skip Next.js internals, static assets, demos, admin.
      source: '/((?!_next/static|_next/image|favicon\\.ico|demos/|admin/).*)',
      missing: [
        // Skip prefetch requests; their RSC payload carries no inline scripts
        // so a mismatched nonce would silently block nothing but wastes a nonce.
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      // Clean demo URLs (/demos/<slug>/...) so they can be rewritten onto the
      // real files. The real /demos/demoN/... static paths stay excluded here
      // and above, so they are served straight from public/ with no proxy pass
      // and no CSP - exactly as before. Never let a slug start with "demo" +
      // a digit; scripts/generate-demo-slug-map.mjs rejects those.
      source: '/demos/((?!demo\\d).*)',
    },
  ],
};
