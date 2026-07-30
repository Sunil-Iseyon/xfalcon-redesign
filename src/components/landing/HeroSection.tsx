import type { LandingPageContent } from '@/lib/content';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import './hero.css';

type HeroContent = LandingPageContent['hero'];

export function HeroSection({ eyebrow, heading, subhead, primaryCta, secondaryCta, statPills }: HeroContent) {
  return (
    <section className="hero">
      <div className="container-xf hero-inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="heading-hero hero-heading">{heading}</h1>
        <p className="subhead hero-subhead">{subhead}</p>
        <div className="hero-ctas">
          <TrackedLink
            href={primaryCta.href}
            event="demo_click"
            data={{ source: 'hero' }}
            className="btn btn-primary"
          >
            {primaryCta.label}
          </TrackedLink>
          <a className="btn btn-secondary" href={secondaryCta.href}>
            {secondaryCta.label}
          </a>
        </div>
        <ul className="hero-pills" role="list">
          {statPills.map((pill) => (
            <li key={pill} className="stat-pill">
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
