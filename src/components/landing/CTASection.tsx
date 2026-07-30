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
          <p className="eyebrow">Try it on your data</p>
          <h2 className="heading-2 cta-heading">{heading}</h2>
          <p className="subhead cta-description">{description}</p>
          <div className="cta-actions">
            <a className="btn btn-primary" href={mailto}>
              {ctaLabel}
            </a>
            <a className="cta-email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
