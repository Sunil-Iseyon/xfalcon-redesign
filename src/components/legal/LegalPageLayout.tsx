import { FooterSection } from '@/components/landing/FooterSection';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import type { LandingPageContent, LegalPageContent } from '@/lib/content';
import './legal.css';

function renderBody(body: string) {
  return body.split(/\n\n+/).map((block, index) => {
    const lines = block.split('\n').filter(Boolean);
    const isList = lines.length > 0 && lines.every((line) => line.trim().startsWith('- '));

    if (isList) {
      return (
        <ul key={index} className="legal-list">
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{line.trim().replace(/^- /, '')}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="legal-paragraph">
        {block}
      </p>
    );
  });
}

interface LegalPageLayoutProps {
  content: LegalPageContent;
  landingContent: LandingPageContent;
}

export function LegalPageLayout({ content, landingContent }: LegalPageLayoutProps) {
  return (
    <>
      <LandingNavbar />
      <main className="legal-main">
        <div className="container-xf legal-container">
          <header className="legal-header">
            <h1 className="heading-2">{content.title}</h1>
            <p className="caption legal-updated">Last updated: {content.lastUpdated}</p>
          </header>

          {content.intro ? <p className="legal-intro">{content.intro}</p> : null}

          <div className="legal-sections">
            {content.sections.map((section, index) => (
              <section key={index} className="legal-section">
                <h2 className="heading-3">{section.heading}</h2>
                <div className="legal-body">{renderBody(section.body)}</div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <FooterSection
        description={landingContent.footer.description}
        copyright={landingContent.footer.copyright}
        email={landingContent.contactInfo.email}
      />
    </>
  );
}
