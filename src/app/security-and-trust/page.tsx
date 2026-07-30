import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { getLandingContent, getLegalPageContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Security and trust',
  description:
    'How xFalcon handles confidentiality, data access, output accuracy, and user responsibilities.',
};

export default function SecurityAndTrustPage() {
  const content = getLegalPageContent('security-and-trust');
  const landingContent = getLandingContent();

  return <LegalPageLayout content={content} landingContent={landingContent} />;
}
