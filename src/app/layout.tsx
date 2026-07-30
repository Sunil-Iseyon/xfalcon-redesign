import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { METADATA_BASE_URL } from '@/lib/app-config';
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
  openGraph: {
    title: 'xFalcon - Business intelligence for the AI era',
    description:
      'Know what changed. See why. Decide what to do. Governed answers from your own warehouse, live in 4-6 weeks.',
    url: '/',
    siteName: 'xFalcon',
    images: [{ url: '/brand/hero/og_1200x630.png', width: 1200, height: 630, alt: 'xFalcon - business intelligence for the AI era' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xFalcon - Business intelligence for the AI era',
    description:
      'Know what changed. See why. Decide what to do. Governed answers from your own warehouse, live in 4-6 weeks.',
    images: ['/brand/hero/og_1200x630.png'],
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
 * 'unsafe-inline') - see src/middleware.ts.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('xf-theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'#061122':'#F5F8FC');}catch(e){}})();`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Iseyon',
  legalName: 'Iseyon Analytics',
  url: 'https://www.xfalcon.ai',
  logo: 'https://www.xfalcon.ai/brand/logo/mark_darkcyan_on_light_1024.png',
  email: 'info@iseyon.com',
  sameAs: ['https://iseyon.com'],
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'xFalcon',
  url: 'https://www.xfalcon.ai',
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
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          nonce={nonce}
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
