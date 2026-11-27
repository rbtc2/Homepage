import Image from 'next/image';
import { SITE_IMAGE } from '@/lib/site-image';

function Placeholder() {
  return (
    <span className="gallery-media__placeholder" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 22l7-6 5 4 4-3 10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function GalleryMedia({ post, sizes, priority = false }) {
  if (!post.coverImage || post.isSecret) return <Placeholder />;

  return (
    <Image
      src={post.coverImage}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      quality={SITE_IMAGE.thumbQuality}
      style={{ objectFit: 'cover' }}
    />
  );
}
