This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## TinaCMS (Tina Cloud) Setup

All landing sections and demo cards are wired to Tina content models.

1. Add the following values to `.env.local`:

```bash
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_readonly_or_editor_token
NEXT_PUBLIC_TINA_BRANCH=main
```

You can copy `.env.example` as a starting point.

2. Run Tina with Next.js locally:

```bash
npm run dev:tina
```

3. Access the Tina admin UI at:

```text
http://localhost:3000/admin/index.html
```

Notes:
- Landing content is sourced from `src/content/landing.json` through Tina schema.
- Demo cards are sourced from `content/demos/*.md` through Tina schema.
- Demo paths like `/demos/demo1/` are resolved to the matching `index.html` under `public/demos`.

## Demo URLs

Demos are linked by a human-readable slug, never by their folder path:

```text
/demos/rush-energy/   ->  public/demos/demo4/Falcon Manufacturing Bev - Red One/index.html
```

`src/proxy.ts` rewrites (never redirects) `/demos/<slug>/` and everything under
it onto the real static files, so the clean URL stays in the address bar and the
relative asset references inside each demo keep resolving. The old
`/demos/demoN/...` URLs still work - they are the real files.

The slug comes from the `slug:` line in `content/demos/*.md`, falling back to a
kebab-case of the title (`Rush Energy - Energy Drink Analytics` ->
`rush-energy`). The proxy cannot read the filesystem, so it reads a generated
table instead. **After adding, renaming or re-pathing a demo, regenerate it and
commit the result:**

```bash
node scripts/generate-demo-slug-map.mjs   # writes src/lib/demo-slug-map.ts
npm test                                  # fails if the table has drifted
```

This is deliberately not a build hook - `next build` must not depend on the
`public/demos` folder layout.

## Social preview card

`public/brand/hero/og_1200x630.png` is the Open Graph image every LinkedIn,
Slack, and Twitter share renders. It is generated from HTML, not drawn by hand:

```bash
node scripts/og/generate-og-image.mjs   # rasterises scripts/og/og-card.html
```

Editing the card means editing `scripts/og/og-card.html` (it uses the real
self-hosted Hanken Grotesk file and the real falcon mark, so it cannot drift
from the site's typography) and committing the regenerated PNG.

## Vercel Deploy Notes

1. In Vercel Project Settings, add:

```bash
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
NEXT_PUBLIC_TINA_BRANCH
NEXT_PUBLIC_APP_URL       # e.g. https://www.xfalcon.ai - see below
```

`NEXT_PUBLIC_APP_URL` sets `metadataBase`, which every canonical tag, `og:url`,
and `og:image` URL is resolved against. Without it the app falls back to
`VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, and only then to the
canonical origin hardcoded in `src/lib/app-config.ts` - so on a preview
deployment shares will unfurl with preview hostnames unless this is set
explicitly on the Production environment. It must agree with `CANONICAL_ORIGIN`
in that same file, which is what the JSON-LD, `robots.txt`, and `sitemap.xml`
advertise; if the apex `xfalcon.ai` is canonical in DNS rather than the `www`
host, change both.

2. Build command can stay as default (`npm run build`) because it now runs Tina build first.

3. Tina admin route is available at:

```text
/admin
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
