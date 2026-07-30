import type { Metadata } from 'next';
import { getDemoEntries, getLandingContent } from '@/lib/content';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhatYouGetSection } from '@/components/landing/WhatYouGetSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingTeaserSection } from '@/components/landing/PricingTeaserSection';
import { DemoTeaserSection } from '@/components/landing/DemoTeaserSection';
import { DesktopAppTeaser } from '@/components/landing/DesktopAppTeaser';
import { CTASection } from '@/components/landing/CTASection';
import { FooterSection } from '@/components/landing/FooterSection';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'xFalcon - Business intelligence for the AI era',
  description:
    'Know what changed. See why. Decide what to do. xFalcon turns your warehouse into governed answers, morning briefs, and ready-to-present work - live in 4-6 weeks.',
};

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
        <PricingTeaserSection />
        <DemoTeaserSection
          {...content.demosTeaser}
          demos={demos.slice(0, 6)}
          total={demos.length}
        />
        <DesktopAppTeaser />
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
