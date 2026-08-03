import type { CSSProperties } from 'react';
import { TCO_CLOSING, TCO_HEADING, TCO_ROWS, TCO_SUBHEAD } from '@/content/pricing';
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

        {/* Same card vocabulary as the tier cards above - the chart is the last
            column of that table, not a separate exhibit. */}
        <div className="card tco-card">
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
              {/* Derived from the same tier the table above publishes, so the
                  bar can be checked against it without leaving the page. */}
              {row.derivation ? <p className="caption tco-derivation">{row.derivation}</p> : null}
              {row.note ? <p className="caption tco-note">{row.note}</p> : null}
            </div>
          ))}
        </div>

        <p className="subhead tco-closing">{TCO_CLOSING}</p>
      </div>
    </section>
  );
}
