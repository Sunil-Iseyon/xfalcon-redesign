import type { Feature } from '@/content/features';
import { FeatureVideo } from './FeatureVideo';
import './feature-card.css';

interface FeatureCardProps {
  feature: Feature;
}

/**
 * One feature: optional demo poster on top, then title, description, and
 * optional chips. Cards with a video are given extra grid width by the page.
 */
export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="card feature-card">
      {feature.video ? (
        <FeatureVideo video={feature.video} label={`Play the ${feature.title} demo`} />
      ) : null}

      <div className="feature-card-body">
        <div className="feature-card-head">
          <h3 className="heading-3 feature-card-title">{feature.title}</h3>
          {feature.isNew ? <span className="badge-soon feature-card-badge">New</span> : null}
        </div>

        <p className="body-copy feature-card-description">{feature.description}</p>

        {feature.chips?.length ? (
          <ul className="feature-card-chips" role="list">
            {feature.chips.map((chip) => (
              <li key={chip} className="chip">
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
