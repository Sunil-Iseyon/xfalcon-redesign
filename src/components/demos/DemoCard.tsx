import Image from 'next/image';
import type { DemoEntry } from '@/lib/content';
import './demo-card.css';

/**
 * Only the fields the card actually renders - deliberately not the whole
 * DemoEntry. The resolved `path` would otherwise be serialised into the RSC
 * payload of every page that renders a card, putting the internal demo folder
 * names back into the HTML source that the slug URLs just removed.
 */
export type DemoCardEntry = Pick<
  DemoEntry,
  'title' | 'description' | 'slug' | 'thumbnail' | 'category'
>;

export function toDemoCardEntry({
  title,
  description,
  slug,
  thumbnail,
  category,
}: DemoEntry): DemoCardEntry {
  return { title, description, slug, thumbnail, category };
}

interface DemoCardProps {
  demo: DemoCardEntry;
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
    // Linked by slug, never by demo.path - src/proxy.ts rewrites /demos/<slug>/
    // onto the real static file. The trailing slash matters: the demo HTML
    // resolves its own assets relative to it.
    <a
      className="card demo-card"
      href={`/demos/${demo.slug}/`}
      target="_blank"
      rel="noopener noreferrer"
    >
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
              src="/brand/logo/mark_transparent_on_light.png"
              alt=""
              width={48}
              height={34}
              className="logo-light-only"
            />
            <Image
              src="/brand/logo/mark_transparent_on_dark.png"
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
