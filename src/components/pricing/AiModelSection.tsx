import { AI_MODEL_NOTE, AI_MODEL_OPTIONS } from '@/content/pricing';
import './ai-model.css';

const DEFAULT_TAG = 'DEFAULT';

export function AiModelSection() {
  return (
    <section className="section ai-section" id="ai-model">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">AI model</p>
          <h2 className="heading-2">Bring your own key - or let us manage it</h2>
          <p className="subhead">{AI_MODEL_NOTE}</p>
        </div>

        <ul className="ai-grid" role="list">
          {AI_MODEL_OPTIONS.map((option) => (
            <li
              key={option.name}
              className={option.tag === DEFAULT_TAG ? 'card ai-card ai-card-default' : 'card ai-card'}
            >
              <p className="ai-tag">{option.tag}</p>
              <h3 className="heading-3 ai-name">{option.name}</h3>
              <p className="ai-price">{option.price}</p>
              <p className="caption ai-price-note">{option.priceNote}</p>
              <ul className="ai-points" role="list">
                {option.points.map((point) => (
                  <li key={point} className="ai-point">
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
