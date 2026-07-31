import type { CSSProperties } from 'react';
import { TCO_HEADING, TCO_ROWS, TCO_SUBHEAD } from '@/content/pricing';
import './tco.css';

const MAX_COST = Math.max(...TCO_ROWS.map((row) => row.costValue));

export function TcoComparison() {
  return (
    <section className="section tco-section" id="economics">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">The economics</p>
          <h2 className="heading-2">{TCO_HEADING}</h2>
          <p className="caption tco-source">{TCO_SUBHEAD}</p>
        </div>

        <div className="tco-rows">
          {TCO_ROWS.map((row) => (
            <div key={row.label} className={row.isXfalcon ? 'tco-row tco-row-xf' : 'tco-row'}>
              <div className="tco-row-head">
                <span className="tco-label">{row.label}</span>
                <span className="tco-cost">{row.cost}</span>
              </div>
              <div className="tco-track">
                <div
                  className="tco-bar"
                  style={{ '--bar-scale': row.costValue / MAX_COST } as CSSProperties}
                />
              </div>
              {row.note ? <p className="caption tco-note">{row.note}</p> : null}
            </div>
          ))}
        </div>

        {/* Must track TCO_ROWS. It previously read "75-93% lower", directly
            under a table showing 62-82% (QA R1-10). */}
        <p className="subhead tco-closing">
          62-82% lower over two years, depending on what you are replacing.
        </p>
      </div>
    </section>
  );
}
