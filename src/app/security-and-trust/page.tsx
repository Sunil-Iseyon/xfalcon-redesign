import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getLandingContent, getLegalPageContent } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  path: '/security-and-trust',
  title: 'Security and trust',
  description:
    'Where your data lives, who can reach it, which AI models process your questions, and how the xFalcon platform is run.',
  socialTitle: 'Security and trust: built for your security review',
});

export default function SecurityAndTrustPage() {
  const content = getLegalPageContent('security-and-trust');
  const landingContent = getLandingContent();

  return <LegalPageLayout content={content} landingContent={landingContent} />;
}
