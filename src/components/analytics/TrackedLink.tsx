'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';

interface TrackedLinkProps {
  href: string;
  /** Event name shown in Vercel Analytics, e.g. "feature_click" */
  event: string;
  /** Event properties, e.g. { feature: "memory" } */
  data?: Record<string, string>;
  className?: string;
  children: ReactNode;
  newTab?: boolean;
}

/**
 * Link that reports a custom event to Vercel Analytics on click.
 * Internal routes use next/link; external/mailto/static targets use <a>.
 * Click-throughs appear under Analytics > Events in the Vercel dashboard.
 */
export function TrackedLink({ href, event, data, className, children, newTab }: TrackedLinkProps) {
  const onClick = () => track(event, data);
  const isInternalRoute = href.startsWith('/') && !href.startsWith('/demos/');

  if (isInternalRoute) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
