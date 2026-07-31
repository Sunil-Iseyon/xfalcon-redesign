import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { CANONICAL_ORIGIN, METADATA_BASE_URL } from '@/lib/app-config';
import { OG_IMAGE } from '@/lib/seo';
import './globals.css';

const hankenGrotesk = localFont({
  src: './fonts/HankenGrotesk-Variable.woff2',
  weight: '100 900',
  variable: '--font-hanken',
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: METADATA_BASE_URL,
  title: {
    default: 'xFalcon - Business intelligence for the AI era',
    template: '%s - xFalcon',
  },
  description:
    'xFalcon works directly on your warehouse and turns live data into governed answers, morning briefs, and ready-to-present work. Live in 4-6 weeks with zero data migration.',
  /*
    Site-wide defaults only. Deliberately NO `url` here: every route inherited
    it, so a /pricing share unfurled as the homepage (QA SEO audit P0-3). Each
    route sets its own canonical and og:url through pageMetadata() in
    src/lib/seo.ts - and because Next replaces `openGraph` wholesale rather than
    deep-merging it, that helper restates images/siteName/locale/type too.
  */
  openGraph: {
    title: 'xFalcon - Business intelligence for the AI era',
    description:
      'Know what changed. See why. Decide what to do. Governed answers from your own warehouse, live in 4-6 weeks.',
    siteName: 'xFalcon',
    images: [OG_IMAGE],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xFalcon - Business intelligence for the AI era',
    description:
      'Know what changed. See why. Decide what to do. Governed answers from your own warehouse, live in 4-6 weeks.',
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [
      { url: '/favicon_32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicon_256.png', sizes: '256x256', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F8FC',
};

/**
 * Runs before first paint: applies the persisted theme so there is no flash
 * of the wrong theme. Must carry the CSP nonce (script-src has no
 * 'unsafe-inline') - see src/proxy.ts.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('xf-theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#061122':'#F5F8FC');}catch(e){}})();`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Iseyon',
  legalName: 'Iseyon Analytics',
  url: CANONICAL_ORIGIN,
  logo: `${CANONICAL_ORIGIN}/brand/logo/mark_darkcyan_on_light_1024.png`,
  email: 'info@xfalcon.ai',
  sameAs: ['https://iseyon.com'],
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'xFalcon',
  url: CANONICAL_ORIGIN,
  description: 'Business intelligence for the AI era.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${hankenGrotesk.variable} ${geistMono.variable}`}
    >
      <head>
        {/*
          suppressHydrationWarning on both: the CSP spec requires browsers to
          blank the `nonce` content attribute once the element is parsed, so the
          server sends nonce="abc..." but the client DOM reports nonce="". React
          reads that as an attribute mismatch and reports a hydration error. The
          value is still live on the `.nonce` IDL property, so CSP keeps working
          - only the comparison is wrong, and this is the documented escape
          hatch for values that legitimately differ across the boundary.
        */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, webSiteJsonLd]) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
