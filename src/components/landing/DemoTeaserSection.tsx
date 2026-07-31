import Link from 'next/link';
import { DemoCard, type DemoCardEntry } from '@/components/demos/DemoCard';
import './demo-teaser.css';

interface DemoTeaserSectionProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  /**
   * Card-shaped entries only (see toDemoCardEntry) - these props are serialised
   * into the page's RSC payload, and the resolved demo `path` would put the
   * internal folder names back into the HTML source.
   */
  demos: DemoCardEntry[];
  total: number;
}

export function DemoTeaserSection({
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  demos,
  total,
}: DemoTeaserSectionProps) {
  return (
    <section className="section" id="demos">
      <div className="container-xf">
        <div className="section-header">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="heading-2">{heading}</h2>
          <p className="subhead">{subheading}</p>
        </div>

        <ul className="demo-grid demo-teaser-grid" role="list">
          {demos.map((demo) => (
            <li key={demo.slug}>
              <DemoCard demo={demo} />
            </li>
          ))}
        </ul>

        <div className="demo-teaser-footer">
          <Link className="btn btn-secondary" href="/demos">
            {ctaLabel}
          </Link>
          <p className="caption demo-teaser-count">{total} interactive demos</p>
        </div>
      </div>
    </section>
  );
}
