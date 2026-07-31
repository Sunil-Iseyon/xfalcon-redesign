import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { getLandingContent } from '@/lib/content';
import { FEATURES_HERO, FEATURE_GROUPS } from '@/content/features';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { CTASection } from '@/components/landing/CTASection';
import { FooterSection } from '@/components/landing/FooterSection';
import { FeatureCard } from '@/components/features/FeatureCard';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import './features-page.css';

const DEMO_MAILTO = 'mailto:info@xfalcon.ai?subject=xFalcon%20demo%20request';

export const metadata: Metadata = pageMetadata({
  path: '/features',
  title: 'Features',
  description:
    'Plain-English answers straight from your warehouse, checked before they land - plus morning briefs, QBR decks, and Excel ready before the meeting.',
  socialTitle: 'Features: an AI analyst on your own warehouse',
});

export default function FeaturesPage() {
  const content = getLandingContent();

  return (
    <>
      <LandingNavbar />
      <main>
        <section className="features-hero">
          <div className="container-xf features-hero-inner">
            <p className="eyebrow">{FEATURES_HERO.eyebrow}</p>
            <h1 className="heading-hero features-hero-heading">{FEATURES_HERO.heading}</h1>
            <p className="subhead features-hero-subhead">{FEATURES_HERO.subhead}</p>
            {/*
              Removing the four per-group ghost CTAs (R3-02) left the page with
              no button at all until the closing CTA section at y=6400 - one CTA
              in nearly nine phone screens, and nothing above the fold, because
              on mobile the navbar CTA is behind the hamburger (QA R4-18). One
              CTA in the hero is the right answer: it converts where intent is
              highest instead of floating beside a grid.
            */}
            <div className="features-hero-ctas">
              <TrackedLink
                href={DEMO_MAILTO}
                event="demo_click"
                data={{ source: 'features-hero' }}
                className="btn btn-primary"
              >
                Book a demo
              </TrackedLink>
              <Link className="btn btn-secondary" href="/pricing">
                See pricing
              </Link>
            </div>
          </div>
        </section>

        {FEATURE_GROUPS.map((group, index) => (
          <section
            key={group.slug}
            id={group.slug}
            className={
              index % 2 === 1
                ? 'section feature-group feature-group-alt'
                : 'section feature-group'
            }
          >
            <div className="container-xf">
              <div className="section-header">
                <p className="eyebrow">{group.eyebrow}</p>
                <h2 className="heading-2">{group.heading}</h2>
              </div>

              {/*
                No per-group "Book a demo" button (QA R3-02): four of them, each
                floating right-aligned in empty space, read as orphaned rather
                than intentional. The navbar CTA is always visible and the page
                ends in the full CTA section, which is now tracked - conversion
                surface is unchanged, only the per-group attribution is lost.
              */}
              <div className="feature-grid">
                {group.features.map((feature) => (
                  <div
                    key={feature.title}
                    className={feature.video ? 'feature-cell feature-cell-wide' : 'feature-cell'}
                  >
                    <FeatureCard feature={feature} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

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
