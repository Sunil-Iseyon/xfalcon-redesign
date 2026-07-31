import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getLandingContent, getLegalPageContent } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  path: '/privacy-policy',
  title: 'Privacy policy',
  description:
    'How Iseyon Analytics and xFalcon collect, use, and protect your personal information.',
});

export default function PrivacyPolicyPage() {
  const content = getLegalPageContent('privacy-policy');
  const landingContent = getLandingContent();

  return <LegalPageLayout content={content} landingContent={landingContent} />;
}
