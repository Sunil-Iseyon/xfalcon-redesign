import type { Metadata } from 'next';
import { getDemoEntries, getLandingContent, type DemoEntry } from '@/lib/content';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { DemoCard } from '@/components/demos/DemoCard';
import './demos-page.css';

/* Demo paths are resolved by walking public/ at request time. */
export const dynamic = 'force-dynamic';

const UNCATEGORIZED_GROUP = 'More';

export const metadata: Metadata = {
  title: 'Live demos',
  description:
    'Interactive xFalcon demo portals across healthcare, retail, manufacturing, finance, and more - real dashboards you can click through, no signup.',
};

/**
 * Groups entries by category, sorting the groups alphabetically while keeping
 * the order getDemoEntries() already applied inside each group.
 */
function groupByCategory(demos: DemoEntry[]): { category: string; demos: DemoEntry[] }[] {
  const groups = new Map<string, DemoEntry[]>();

  for (const demo of demos) {
    const category = demo.category || UNCATEGORIZED_GROUP;
    const existing = groups.get(category);
    if (existing) {
      existing.push(demo);
    } else {
      groups.set(category, [demo]);
    }
  }

  return [...groups.entries()]
    .map(([category, entries]) => ({ category, demos: entries }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

export default function DemosPage() {
  const content = getLandingContent();
  const groups = groupByCategory(getDemoEntries());

  return (
    <>
      <LandingNavbar />
      <main>
        <section className="demos-hero">
          <div className="container-xf">
            <p className="eyebrow">LIVE DEMOS</p>
            <h1 className="heading-hero demos-hero-heading">See xFalcon on data like yours</h1>
            <p className="subhead demos-hero-subhead">
              Click through the real dashboards we ship, by industry.
            </p>
          </div>
        </section>

        {groups.length > 0 ? (
          <div className="demos-groups">
            {groups.map((group) => (
              <section key={group.category} className="container-xf">
                <h2 className="heading-3 demos-group-title">{group.category}</h2>
                <ul className="demo-grid" role="list">
                  {group.demos.map((demo) => (
                    <li key={demo.path}>
                      <DemoCard demo={demo} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="container-xf demos-empty">
            <p className="body-copy">
              Demos are being refreshed. Email {content.contactInfo.email} for a walkthrough.
            </p>
          </div>
        )}
      </main>
      <FooterSection
        description={content.footer.description}
        copyright={content.footer.copyright}
        email={content.contactInfo.email}
      />
    </>
  );
}
