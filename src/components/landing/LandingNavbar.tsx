'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { track } from '@vercel/analytics';
import { ThemeToggle } from '@/components/landing/ThemeToggle';
import './navbar.css';

const NAV_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Demos', href: '/demos' },
  { label: 'Contact', href: '/#contact' },
];

const BOOK_DEMO_HREF = 'mailto:info@xfalcon.ai?subject=xFalcon%20demo%20request';

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className="navbar" ref={menuRef}>
      <div className="container-xf navbar-inner">
        <Link href="/" className="navbar-logo" aria-label="xFalcon home" onClick={() => setOpen(false)}>
          {/*
            228x162 masters with real alpha. The previous *_1024.png marks were
            square tiles with the theme background (#F5F8FC / #061122) baked in
            opaque, so they showed as a hard-edged rectangle over the navbar's
            translucent blurred backdrop.
          */}
          <Image
            src="/brand/logo/mark_transparent_on_light.png"
            alt=""
            width={38}
            height={27}
            className="logo-light-only"
            priority
          />
          <Image
            src="/brand/logo/mark_transparent_on_dark.png"
            alt=""
            width={38}
            height={27}
            className="logo-dark-only"
            priority
          />
          <span className="navbar-wordmark">
            <span className="navbar-wordmark-x">x</span>Falcon
          </span>
        </Link>

        <nav className="navbar-links" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          {/* QA R1-11: nav chip for the unshipped desktop app removed. The
              footer's desktop-app line still carries the announcement. */}
          <ThemeToggle />
          <a
            className="btn btn-primary btn-sm navbar-cta"
            href={BOOK_DEMO_HREF}
            onClick={() => track('demo_click', { source: 'navbar' })}
          >
            Book a demo
          </a>
          <button
            type="button"
            className="navbar-menu-btn theme-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="navbar-mobile" aria-label="Main mobile">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="navbar-mobile-link" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <a
            className="btn btn-primary btn-sm navbar-mobile-cta"
            href={BOOK_DEMO_HREF}
            onClick={() => {
              track('demo_click', { source: 'navbar-mobile' });
              setOpen(false);
            }}
          >
            Book a demo
          </a>
        </nav>
      )}
    </header>
  );
}
