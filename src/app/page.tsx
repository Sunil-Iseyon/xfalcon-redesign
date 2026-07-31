import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { getDemoEntries, getLandingContent } from '@/lib/content';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhatYouGetSection } from '@/components/landing/WhatYouGetSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SocialProofBand } from '@/components/landing/SocialProofBand';
import { PricingTeaserSection } from '@/components/landing/PricingTeaserSection';
import { DemoTeaserSection } from '@/components/landing/DemoTeaserSection';
import { toDemoCardEntry } from '@/components/demos/DemoCard';
import { CTASection } from '@/components/landing/CTASection';
import { FooterSection } from '@/components/landing/FooterSection';

export const dynamic = 'force-dynamic';

/*
  The homepage title is deliberately the full brand line rather than a word the
  '%s - xFalcon' template would suffix: `title.template` does not apply within
  the segment that defines it, so this string is emitted verbatim.
*/
export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'xFalcon - Business intelligence for the AI era',
  socialTitle: 'xFalcon - Business intelligence for the AI era',
  description:
    'Know what changed. See why. Decide what to do. xFalcon turns your warehouse into governed answers, briefs, and ready-to-present work - live in 4-6 weeks.',
});

export default function LandingPage() {
  const content = getLandingContent();
  const demos = getDemoEntries();

  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection {...content.hero} />
        <WhatYouGetSection {...content.whatYouGet} />
        <HowItWorksSection />
        <SocialProofBand
          demoCount={demos.length}
          industryCount={new Set(demos.map((demo) => demo.category).filter(Boolean)).size}
        />
        <PricingTeaserSection />
        {/* toDemoCardEntry keeps the resolved demo paths out of the RSC payload. */}
        <DemoTeaserSection
          {...content.demosTeaser}
          demos={demos.slice(0, 6).map(toDemoCardEntry)}
          total={demos.length}
        />
        <CTASection {...content.cta} email={content.contactInfo.email} />
      </main>
      <FooterSection
        description={content.footer.description}
        copyright={content.footer.copyright}
        email={content.contactInfo.email}
      />
    </>
  );
}
