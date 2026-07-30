import type { LandingPageContent } from '@/lib/content';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import './what-you-get.css';

type WhatYouGetContent = LandingPageContent['whatYouGet'];

export function WhatYouGetSection({ eyebrow, heading, items }: WhatYouGetContent) {
  return (
    <section className="section" id="what-you-get">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="heading-2">{heading}</h2>
        </div>
        <ul className="wyg-grid" role="list">
          {items.map((item, index) => (
            <li key={item.title} className="card wyg-card">
              <span className="wyg-marker">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="heading-3 wyg-title">{item.title}</h3>
              <p className="body-copy wyg-description">{item.description}</p>
            </li>
          ))}
        </ul>
        <div className="wyg-more">
          <TrackedLink
            href="/features"
            event="features_click"
            data={{ source: 'home-what-you-get' }}
            className="btn btn-secondary btn-sm"
          >
            Explore all features
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
