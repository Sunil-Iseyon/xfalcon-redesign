import { PRICING_FOOTNOTE, TIERS } from '@/content/pricing';
import './pricing-tiers.css';

const DEMO_MAILTO = 'mailto:info@xfalcon.ai?subject=xFalcon%20demo%20request';

export function PricingTiers() {
  return (
    <section className="section tiers-section" id="tiers">
      <div className="container-xf">
        <ul className="tiers-grid" role="list">
          {TIERS.map((tier) => (
            <li
              key={tier.name}
              className={tier.highlighted ? 'card tier-card tier-card-featured' : 'card tier-card'}
            >
              <div className="tier-head">
                <h2 className="heading-3 tier-name">{tier.name}</h2>
                {tier.highlighted ? <span className="chip tier-chip">Most common</span> : null}
              </div>

              <p className="body-copy tier-scope">
                {tier.scope} · {tier.users}
              </p>
              <p className="caption tier-complexity">{tier.complexity}</p>

              <p className="tier-per-user">
                <span className="tier-per-user-value">{tier.perUserMonthly}</span>
                <span className="tier-per-user-unit">/ user / month</span>
              </p>

              <dl className="tier-specs">
                <div className="tier-spec">
                  <dt className="tier-spec-label">Installation</dt>
                  <dd className="tier-spec-value">
                    <span className="tier-spec-price">{tier.installation.price}</span>
                    <span className="caption tier-spec-hours">{tier.installation.hours}</span>
                  </dd>
                </div>
                <div className="tier-spec">
                  <dt className="tier-spec-label">Platform fee</dt>
                  <dd className="tier-spec-value">
                    <span className="tier-spec-price">{tier.platform.price} / mo</span>
                    <span className="caption tier-spec-hours">{tier.platform.hours}</span>
                  </dd>
                </div>
              </dl>

              <hr className="tier-divider" />

              <dl className="tier-specs tier-totals">
                <div className="tier-spec">
                  <dt className="tier-spec-label">
                    Total monthly
                    {/* Spell out the derivation - the totals used to look like
                        they contradicted the "$10 per user" headline (QA R1-05). */}
                    <span className="caption tier-total-note">
                      {tier.platform.price} platform + {tier.perUserMonthly} per user
                    </span>
                  </dt>
                  <dd className="tier-total-value">{tier.totalMonthly}</dd>
                </div>
                <div className="tier-spec">
                  <dt className="tier-spec-label">Year 1 total</dt>
                  <dd className="tier-total-value">{tier.yearOneTotal}</dd>
                </div>
              </dl>

              <a
                className={
                  tier.highlighted ? 'btn btn-primary tier-cta' : 'btn btn-secondary tier-cta'
                }
                href={DEMO_MAILTO}
              >
                Book a demo
              </a>
            </li>
          ))}
        </ul>

        <p className="caption tiers-footnote">{PRICING_FOOTNOTE}</p>
      </div>
    </section>
  );
}
