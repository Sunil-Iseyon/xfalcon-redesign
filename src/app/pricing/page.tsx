import type { Metadata } from 'next';
import { getLandingContent } from '@/lib/content';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { CTASection } from '@/components/landing/CTASection';
import { FooterSection } from '@/components/landing/FooterSection';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingTiers } from '@/components/pricing/PricingTiers';
import { PocCallout } from '@/components/pricing/PocCallout';
import { AiModelSection } from '@/components/pricing/AiModelSection';
import { TcoComparison } from '@/components/pricing/TcoComparison';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Every xFalcon tier is $10 per user per month - tiers differ by analytical complexity, not just seats. Start with a $3,500 proof of concept on your own data, credited toward installation.',
};

export default function PricingPage() {
  const content = getLandingContent();

  return (
    <>
      <LandingNavbar />
      <main>
        <PricingHero />
        <PricingTiers />
        <PocCallout />
        <AiModelSection />
        <TcoComparison />
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
