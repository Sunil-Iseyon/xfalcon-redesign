import Link from 'next/link';
import './social-proof.css';

interface SocialProofBandProps {
  demoCount: number;
  industryCount: number;
}

/**
 * One quiet line of proof between how-it-works and pricing (QA R1-08). B2B
 * buyers look for evidence before they look at price, and there was none.
 *
 * Deliberately no logo wall and no invented metrics: the counts are derived
 * from content/demos at request time, so they cannot drift from what the
 * /demos page actually ships.
 */
export function SocialProofBand({ demoCount, industryCount }: SocialProofBandProps) {
  return (
    <section className="social-proof" aria-label="Where xFalcon runs">
      <div className="container-xf social-proof-inner">
        <p className="social-proof-line">
          Teams in healthcare, retail, and manufacturing run xFalcon on their own warehouse data.
        </p>
        <Link className="social-proof-link" href="/demos">
          {demoCount} live demo portals across {industryCount} industries
        </Link>
      </div>
    </section>
  );
}
