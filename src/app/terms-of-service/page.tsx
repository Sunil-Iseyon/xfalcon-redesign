import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getLandingContent, getLegalPageContent } from '@/lib/content';

export const metadata: Metadata = pageMetadata({
  path: '/terms-of-service',
  title: 'Terms of service',
  description:
    'Confidentiality, liability, and usage terms governing access to the xFalcon platform.',
});

export default function TermsOfServicePage() {
  const content = getLegalPageContent('terms-of-service');
  const landingContent = getLandingContent();

  return <LegalPageLayout content={content} landingContent={landingContent} />;
}
