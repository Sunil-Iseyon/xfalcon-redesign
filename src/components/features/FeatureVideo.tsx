'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { track } from '@vercel/analytics';
import type { FeatureVideoAsset } from '@/content/features';
import './feature-video.css';

interface FeatureVideoProps {
  video: FeatureVideoAsset;
  /** Accessible label, e.g. "Play the xFalcon News demo" */
  label: string;
}

/**
 * Poster frame with click-to-play - no autoplay, nothing downloads until the
 * viewer asks for it. Plays are reported to Vercel Analytics as
 * "feature_video_play" with the feature slug, so per-feature interest is
 * measurable in the dashboard.
 */
export function FeatureVideo({ video, label }: FeatureVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /*
    Move focus to the player once it mounts. Pressing Enter on the poster button
    unmounts that button, and the browser's fallback for a destroyed
    activeElement is <body> - so a keyboard user landed at the top of the
    document and had to Tab through the whole navbar to reach the video they had
    just started (QA R4-19, WCAG 2.4.3). The <video> is focusable because it
    carries `controls`.
  */
  useEffect(() => {
    if (playing) {
      videoRef.current?.focus();
    }
  }, [playing]);

  const start = () => {
    track('feature_video_play', { feature: video.slug });
    setPlaying(true);
  };

  if (playing) {
    return (
      <div className="feature-video">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          aria-label={label.replace(/^Play the /, '')}
        />
      </div>
    );
  }

  return (
    <button type="button" className="feature-video feature-video-trigger" onClick={start} aria-label={label}>
      <Image src={video.poster} alt="" fill sizes="(min-width: 900px) 40rem, 90vw" className="feature-video-poster" />
      <span className="feature-video-play" aria-hidden="true">
        <Play size={20} />
      </span>
    </button>
  );
}
