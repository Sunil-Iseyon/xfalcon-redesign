import Link from 'next/link';
import Image from 'next/image';
import './footer.css';

interface FooterSectionProps {
  description: string;
  copyright: string;
  email: string;
}

const NOTIFY_MAILTO =
  'mailto:info@xfalcon.ai?subject=Notify%20me%20about%20the%20xFalcon%20desktop%20app';

const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Demos', href: '/demos' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: 'mailto:info@xfalcon.ai' },
      { label: 'Iseyon', href: 'https://iseyon.com' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms of service', href: '/terms-of-service' },
      { label: 'Security and trust', href: '/security-and-trust' },
    ],
  },
];

export function FooterSection({ description, copyright, email }: FooterSectionProps) {
  return (
    <footer className="footer">
      <div className="container-xf">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="xFalcon home">
              {/* Transparent 228x162 masters - see the note in LandingNavbar. */}
              <Image
                src="/brand/logo/mark_transparent_on_light.png"
                alt=""
                width={34}
                height={24}
                className="logo-light-only"
              />
              <Image
                src="/brand/logo/mark_transparent_on_dark.png"
                alt=""
                width={34}
                height={24}
                className="logo-dark-only"
              />
              <span className="footer-wordmark">
                <span className="footer-wordmark-x">x</span>Falcon
              </span>
            </Link>
            <p className="footer-description">{description}</p>
            <a className="footer-email" href={`mailto:${email}`}>
              {email}
            </a>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="footer-group">
              <h2 className="footer-group-title">{group.title}</h2>
              <ul className="footer-group-list" role="list">
                {group.links.map((link) =>
                  link.href.startsWith('/') ? (
                    <li key={link.href}>
                      <Link href={link.href} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        {/*
          The desktop app used to be a full homepage section for an unshipped
          feature (QA R1-11, open since round 1). One footer line carries the
          same information without giving vaporware the same weight as the
          product, and keeps a way for interested people to raise their hand.
        */}
        <p className="footer-note">
          <span className="badge-soon">Desktop app - soon</span>
          <span className="footer-note-text">
            A native Mac and Windows app is on the way.{' '}
            <a className="footer-note-link" href={NOTIFY_MAILTO}>
              Notify me
            </a>
          </span>
        </p>

        <div className="footer-bottom">
          <p className="caption">{copyright}</p>
          <p className="caption">Iseyon Analytics · Lancet Software India</p>
        </div>
      </div>
    </footer>
  );
}
