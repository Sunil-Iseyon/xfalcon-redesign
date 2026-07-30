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

## Vercel Deploy Notes

1. In Vercel Project Settings, add:

```bash
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
NEXT_PUBLIC_TINA_BRANCH
```

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
