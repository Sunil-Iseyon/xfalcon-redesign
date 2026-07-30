import Link from 'next/link';
import Image from 'next/image';
import './footer.css';

interface FooterSectionProps {
  description: string;
  copyright: string;
  email: string;
}

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
      { label: 'Contact', href: 'mailto:info@iseyon.com' },
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
              <Image
                src="/brand/logo/mark_darkcyan_on_light_1024.png"
                alt=""
                width={34}
                height={24}
                className="logo-light-only"
              />
              <Image
                src="/brand/logo/mark_white_on_dark_1024.png"
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

        <div className="footer-bottom">
          <p className="caption">{copyright}</p>
          <p className="caption">Iseyon Analytics · Lancet Software India</p>
        </div>
      </div>
    </footer>
  );
}
