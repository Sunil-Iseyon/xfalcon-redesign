import type { Metadata } from 'next';
import { getLandingContent } from '@/lib/content';
import { FEATURES_HERO, FEATURE_GROUPS } from '@/content/features';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { CTASection } from '@/components/landing/CTASection';
import { FooterSection } from '@/components/landing/FooterSection';
import { FeatureCard } from '@/components/features/FeatureCard';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import './features-page.css';

const DEMO_MAILTO = 'mailto:info@iseyon.com?subject=xFalcon%20demo%20request';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'xFalcon answers business questions in plain English straight from your warehouse - three learning systems keep it accurate, and it delivers morning briefs, QBR decks, and Excel workbooks that are ready before the meeting.',
};

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

              <div className="feature-group-cta">
                <TrackedLink
                  href={DEMO_MAILTO}
                  event="demo_click"
                  data={{ source: `features-${group.slug}` }}
                  className="btn btn-secondary btn-sm"
                >
                  Book a demo
                </TrackedLink>
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
