import { TrackedLink } from '@/components/analytics/TrackedLink';
import './cta.css';

interface CTASectionProps {
  heading: string;
  description: string;
  ctaLabel: string;
  email: string;
}

export function CTASection({ heading, description, ctaLabel, email }: CTASectionProps) {
  const mailto = `mailto:${email}?subject=${encodeURIComponent('xFalcon demo request')}`;

  return (
    <section className="section" id="contact">
      <div className="container-xf">
        <div className="card cta-card">
          {/*
            "Get started", not "Try it on your data" (QA R4-23): the eyebrow was
            the same string as `content.cta.heading` below it, so a screen reader
            announced the identical phrase twice in a row.
          */}
          <p className="eyebrow">Get started</p>
          <h2 className="heading-2 cta-heading">{heading}</h2>
          <p className="subhead cta-description">{description}</p>
          <div className="cta-actions">
            {/* Tracked so the page-bottom CTA is attributable - it was a plain
                <a>, which made every conversion through it invisible. */}
            <TrackedLink
              href={mailto}
              event="demo_click"
              data={{ source: 'cta-section' }}
              className="btn btn-primary"
            >
              {ctaLabel}
            </TrackedLink>
            <a className="cta-email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
