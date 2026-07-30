import type { NextConfig } from "next";

/**
 * Applied to all Next.js app routes (everything except /demos/* and /admin/*).
 *
 * Content-Security-Policy is NOT set here — it is issued per-request by
 * src/middleware.ts using a cryptographic nonce, which eliminates the need for
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
        source: "/admin/(.*)",
        headers: STATIC_ASSET_HEADERS,
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