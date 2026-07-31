import { PER_USER_PRICE } from '@/content/pricing';
import './pricing-hero.css';

export function PricingHero() {
  return (
    <section className="pricing-hero">
      <div className="container-xf pricing-hero-inner">
        <p className="eyebrow">Pricing</p>
        <h1 className="heading-hero pricing-hero-heading">Simple per-user pricing</h1>
        <p className="subhead pricing-hero-subhead">
          {PER_USER_PRICE} per user per month, plus a fixed platform fee per tier. Tiers differ by
          analytical complexity, not just seats.
        </p>
      </div>
    </section>
  );
}
