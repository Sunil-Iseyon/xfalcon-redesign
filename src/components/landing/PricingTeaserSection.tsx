import Link from 'next/link';
import { PER_USER_PRICE, POC, TIERS, tierFigures } from '@/content/pricing';
import './pricing-teaser.css';

/*
  Untinted by design (QA R2-01): the tier cards already lift this section off
  the white canvas, so a section tint on top of card surfaces would be double
  emphasis. Only how-it-works carries the tint.
*/
export function PricingTeaserSection() {
  return (
    <section className="section" id="pricing">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">Pricing</p>
          <h2 className="heading-2">Enterprise BI without the enterprise bill</h2>
          <p className="subhead">
            {PER_USER_PRICE} per user per month plus a fixed platform fee - proof of concept from{' '}
            {POC.price}.
          </p>
        </div>

        <ul className="teaser-grid" role="list">
          {TIERS.map((tier) => {
            const figures = tierFigures(tier);

            return (
              <li key={tier.name} className="card teaser-card">
                <h3 className="teaser-name">{tier.name}</h3>
                <p className="caption teaser-users">{tier.users}</p>
                <p className="teaser-total">
                  <span className="teaser-total-value">{figures.monthlyTotal}</span>
                  <span className="teaser-total-unit">/ mo total</span>
                </p>
                {/* Without this the total reads as contradicting the $10 headline (QA R1-05). */}
                <p className="caption teaser-breakdown">
                  {figures.platform} platform + {figures.perUser} per user
                </p>
                {/*
                  The one-time installation fee is stated here rather than only on
                  /pricing (QA R3-03): a buyer who reads "$1,300 / mo total" and
                  then meets a $12,000 installation line one click later feels
                  sandbagged. The figure is public either way, so pre-framing it
                  costs nothing and the transparency is the section's whole pitch.
                */}
                <p className="caption teaser-install">
                  + {figures.installation} one-time installation
                </p>
              </li>
            );
          })}
        </ul>

        <Link className="btn btn-secondary teaser-cta" href="/pricing">
          See full pricing
        </Link>
      </div>
    </section>
  );
}
