import Link from 'next/link';
import { PER_USER_PRICE, POC, TIERS } from '@/content/pricing';
import './pricing-teaser.css';

export function PricingTeaserSection() {
  return (
    <section className="section" id="pricing">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">Pricing</p>
          <h2 className="heading-2">Enterprise BI without the enterprise bill</h2>
          <p className="subhead">
            All tiers are {PER_USER_PRICE} per user per month - proof of concept from {POC.price}.
          </p>
        </div>

        <ul className="teaser-grid" role="list">
          {TIERS.map((tier) => (
            <li key={tier.name} className="card teaser-card">
              <h3 className="teaser-name">{tier.name}</h3>
              <p className="caption teaser-users">{tier.users}</p>
              <p className="teaser-total">
                <span className="teaser-total-value">{tier.totalMonthly}</span>
                <span className="teaser-total-unit">/ mo total</span>
              </p>
            </li>
          ))}
        </ul>

        <Link className="btn btn-secondary teaser-cta" href="/pricing">
          See full pricing
        </Link>
      </div>
    </section>
  );
}
