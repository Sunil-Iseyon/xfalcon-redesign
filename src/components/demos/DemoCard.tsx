import Image from 'next/image';
import type { DemoEntry } from '@/lib/content';
import './demo-card.css';

interface DemoCardProps {
  demo: DemoEntry;
}

/**
 * Thumbnails are raw screenshots dropped into public/ - filenames contain
 * spaces. Encode each path segment so the URL is valid, unless the value is
 * already percent-encoded (encoding twice would turn "%20" into "%2520").
 */
function toImageSrc(thumbnail: string): string {
  if (/%[0-9A-Fa-f]{2}/.test(thumbnail)) {
    return thumbnail;
  }
  return thumbnail.split('/').map(encodeURIComponent).join('/');
}

export function DemoCard({ demo }: DemoCardProps) {
  return (
    <a className="card demo-card" href={demo.path} target="_blank" rel="noopener noreferrer">
      <div className="demo-card-thumb">
        {demo.thumbnail ? (
          <Image
            src={toImageSrc(demo.thumbnail)}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1100px) 22rem, (min-width: 768px) 45vw, 90vw"
            className="demo-card-image"
          />
        ) : (
          <div className="card-sunken demo-card-placeholder">
            <Image
              src="/brand/logo/mark_darkcyan_on_light_1024.png"
              alt=""
              width={48}
              height={34}
              className="logo-light-only"
            />
            <Image
              src="/brand/logo/mark_white_on_dark_1024.png"
              alt=""
              width={48}
              height={34}
              className="logo-dark-only"
            />
          </div>
        )}
      </div>

      <div className="demo-card-body">
        {demo.category ? <span className="chip">{demo.category}</span> : null}
        <h3 className="heading-3 demo-card-title">{demo.title}</h3>
        {demo.description ? <p className="body-copy demo-card-description">{demo.description}</p> : null}
      </div>
    </a>
  );
}
