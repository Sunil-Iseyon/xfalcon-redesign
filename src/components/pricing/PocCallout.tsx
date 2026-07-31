import { POC } from '@/content/pricing';
import './poc-callout.css';

const POC_MAILTO = 'mailto:info@xfalcon.ai?subject=xFalcon%20POC';

export function PocCallout() {
  return (
    <section className="section poc-section" id="proof-of-concept">
      <div className="container-xf">
        <div className="card-sunken poc-card">
          <div className="poc-lead">
            <p className="eyebrow">Try it on your data</p>
            <h2 className="heading-2 poc-heading">{POC.name}</h2>
            <p className="poc-price">{POC.price}</p>
            <p className="caption poc-timeline">{POC.timeline} on your own data</p>
          </div>

          <div className="poc-body">
            <ul className="poc-includes" role="list">
              {POC.includes.map((item) => (
                <li key={item} className="poc-include">
                  <span className="poc-marker" aria-hidden="true" />
                  <span className="poc-include-text">{item}</span>
                </li>
              ))}
            </ul>

            <p className="poc-guarantee">{POC.guarantee}</p>

            <a className="btn btn-primary poc-cta" href={POC_MAILTO}>
              Start a POC
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
