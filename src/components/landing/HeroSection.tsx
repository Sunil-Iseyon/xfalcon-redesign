import type { LandingPageContent } from '@/lib/content';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import './hero.css';

type HeroContent = LandingPageContent['hero'];

/*
  Hero visual (QA R2-02): the headline made literal. "Know what changed. See
  why. Decide what to do." is already a spec, so the composite is one card per
  clause, chained by short accent rules to read as a line of reasoning.

  Pure HTML/CSS on purpose - crisp at any DPI, themes correctly in dark mode,
  no asset pipeline, and no LCP cost (the headline stays the LCP element). The
  alternatives were considered and rejected in R2-02: a demo screenshot reads as
  generic BI and its dark chrome clashes with the light hero; abstract data art
  communicates nothing; an animated journey loop duplicates how-it-works.

  Deliberately NOT wrapped in the browser-frame chrome used by how-it-works and
  the desktop teaser: a window frame claims "this is our UI", and these are
  distilled outputs, not product screens. It reads as the shape of the answer
  you get, which is the honest version of the same idea.

  The scenario matches the how-it-works journey (northeast margin / freight
  surcharges) so the fold previews the story the page then tells. Numbers are
  illustrative - QA R2-03 swaps them for an anonymized real example once one is
  cleared. Keep the same three-card shape when that happens.
*/
/*
  Each card is one number or one graphic plus a label - no prose. The first pass
  read as three paragraphs in boxes; the fix was to cut the words roughly in half
  and let the sparkline, the contribution bar, and the two figures carry the
  meaning. Anything that had to be read left-to-right became something scannable.
*/
const COMPOSITE = {
  changed: {
    label: 'What changed',
    metric: 'Northeast margin',
    delta: '3.2 pts',
    period: 'vs May',
    /* Six flat months, then the drop. Decorative - the figure states the fact. */
    trend: '2,13 15,10 28,14 41,9 54,12 67,11',
    fall: '67,11 78,24',
  },
  why: {
    label: 'See why',
    /* The bar's fill width lives in hero.css (.hero-share-fill) - no inline
       styles in JSX. Change both together. */
    share: '80%',
    driver: 'Freight surcharges',
    scope: '2 distributors',
  },
  todo: {
    label: 'What to do',
    action: 'Renegotiate both freight contracts',
    gain: '2.4 pts',
    gainNote: 'recoverable by Q4',
  },
};

function HeroComposite() {
  return (
    <div className="hero-composite">
      <div className="hero-card hero-card-changed">
        <p className="hero-card-label">{COMPOSITE.changed.label}</p>
        <div className="hero-metric">
          <div className="hero-metric-main">
            <p className="hero-metric-name">{COMPOSITE.changed.metric}</p>
            <p className="hero-metric-figure">
              <span className="hero-metric-delta">
                <span aria-hidden="true">&darr;</span>
                <span className="hero-metric-value">{COMPOSITE.changed.delta}</span>
                <span className="sr-only">down</span>
              </span>
              <span className="hero-metric-period">{COMPOSITE.changed.period}</span>
            </p>
          </div>
          <svg className="hero-spark" viewBox="0 0 80 28" aria-hidden="true" focusable="false">
            <polyline className="hero-spark-line" points={COMPOSITE.changed.trend} />
            <polyline className="hero-spark-fall" points={COMPOSITE.changed.fall} />
            <circle className="hero-spark-dot" cx="78" cy="24" r="2.5" />
          </svg>
        </div>
      </div>

      <span className="hero-link" aria-hidden="true" />

      <div className="hero-card hero-card-why">
        <p className="hero-card-label">{COMPOSITE.why.label}</p>
        <div className="hero-why-row">
          <div className="hero-share">
            <span className="hero-share-fill" />
          </div>
          <span className="hero-share-value">{COMPOSITE.why.share}</span>
        </div>
        <p className="hero-driver">
          {COMPOSITE.why.driver}{' '}
          <span className="hero-driver-scope">&middot; {COMPOSITE.why.scope}</span>
        </p>
      </div>

      <span className="hero-link" aria-hidden="true" />

      <div className="hero-card hero-card-todo">
        <p className="hero-card-label hero-card-label-accent">{COMPOSITE.todo.label}</p>
        <p className="hero-action">{COMPOSITE.todo.action}</p>
        <p className="hero-gain">
          <span className="hero-gain-value">+{COMPOSITE.todo.gain}</span>
          <span className="hero-gain-note">{COMPOSITE.todo.gainNote}</span>
        </p>
      </div>
    </div>
  );
}

/*
  Splits the headline so its final clause can carry the accent colour - the
  "pop" the hero was missing. Deliberately colour, not a gradient: a teal ->
  bright-cyan gradient would end at 1.9:1 on white and undo the contrast work,
  whereas solid --accent is 5.52:1 and this text is 60px.

  Content-safe: the heading comes from the CMS, so if it is ever a single
  sentence this returns it untouched rather than colouring the whole line.
*/
function splitHeadline(heading: string): { lead: string; last: string | null } {
  const sentences = heading.match(/[^.!?]+[.!?]+\s*/g);
  if (!sentences || sentences.length < 2) {
    return { lead: heading, last: null };
  }
  return {
    lead: sentences.slice(0, -1).join('').trim(),
    last: sentences[sentences.length - 1].trim(),
  };
}

export function HeroSection({ eyebrow, heading, subhead, primaryCta, secondaryCta, statPills }: HeroContent) {
  const { lead, last } = splitHeadline(heading);

  return (
    <section className="hero">
      {/* Decorative depth: layered glows, bright cyan allowed here because it is
          never text. Sits behind everything at z-index 0. */}
      <span className="hero-glow" aria-hidden="true" />
      <div className="container-xf hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="heading-hero hero-heading">
            {lead}
            {last ? <span className="hero-heading-accent"> {last}</span> : null}
          </h1>
          <p className="subhead hero-subhead">{subhead}</p>
          <div className="hero-ctas">
            <TrackedLink
              href={primaryCta.href}
              event="demo_click"
              data={{ source: 'hero' }}
              className="btn btn-primary"
            >
              {primaryCta.label}
            </TrackedLink>
            <a className="btn btn-secondary" href={secondaryCta.href}>
              {secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <HeroComposite />
        </div>

        <ul className="hero-pills" role="list">
          {statPills.map((pill) => (
            <li key={pill} className="stat-pill">
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
