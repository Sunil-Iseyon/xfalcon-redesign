import Link from 'next/link';
import type { DemoEntry } from '@/lib/content';
import { DemoCard } from '@/components/demos/DemoCard';
import './demo-teaser.css';

interface DemoTeaserSectionProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  demos: DemoEntry[];
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
            <li key={demo.path}>
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
