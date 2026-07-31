import type { NextConfig } from "next";

/**
 * Applied to all Next.js app routes (everything except /demos/* and /admin/*).
 *
 * Content-Security-Policy is NOT set here — it is issued per-request by
 * src/proxy.ts using a cryptographic nonce, which eliminates the need for
 * 'unsafe-inline' in script-src.  All other hardening headers are static and
 * safe to set from next.config.ts.
 */
const APP_SECURITY_HEADERS = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * Applied to /demos/* and /admin/* static HTML files.
 *
 * CSP is intentionally omitted here — those HTML files load Chart.js from
 * cdn.jsdelivr.net and fonts from fonts.googleapis.com, which a strict CSP
 * would block. Foundational hardening headers are still applied.
 * X-Frame-Options is omitted to allow demo files to be embedded if needed.
 */
const STATIC_ASSET_HEADERS = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /**
   * Clean demo URLs (/demos/rush-energy/) are rewritten to the real static file
   * by src/proxy.ts, and the demo HTML resolves its assets relative to that
   * trailing slash - Next's built-in trailing-slash redirect would strip it
   * before the proxy ever ran and every relative asset would 404 one level up.
   * The proxy issues the same 308 for every other route instead, and /admin/
   * (outside the proxy matcher) is redirected below.
   */
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      {
        // Tina's admin entry point; src/app/admin/page.tsx handles bare /admin.
        source: "/admin/",
        destination: "/admin/index.html",
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        // All app routes — excludes /demos/ and /admin/ prefixes
        source: "/((?!demos/|admin/).*)",
        headers: APP_SECURITY_HEADERS,
      },
      {
        source: "/demos/(.*)",
        headers: STATIC_ASSET_HEADERS,
      },
      {
        // TinaCMS admin. X-Robots-Tag as well as the robots.txt disallow in
        // src/app/robots.ts: robots.txt asks crawlers not to fetch a URL, but
        // only noindex removes one Google already knows about, and /admin/
        // returns a real 200 page today (QA SEO audit P1-3).
        source: "/admin/(.*)",
        headers: [
          ...STATIC_ASSET_HEADERS,
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/favicon.ico",
          destination: "/favicon_256.png",
        },
      ],
    };
  },
};

export default nextConfig;