import Link from 'next/link';
import Image from 'next/image';

/**
 * 갤러리 그리드 카드
 *
 * @param {object} post      - 갤러리 게시물 (id, title, coverImage, author, createdAt)
 * @param {string} basePath  - 예: '/gallery'
 * @param {number} index     - 그리드 내 위치 (priority 판단용)
 */
export default function GalleryCard({ post, basePath, index = 0 }) {
  const href = `${basePath}/${post.id}`;

  return (
    <Link href={href} className="gallery-card">
      <div className="gallery-card__img-wrap">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="gallery-card__img"
            priority={index < 3}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="gallery-card__placeholder" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 22l7-6 5 4 4-3 10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="gallery-card__overlay">
        <h2 className="gallery-card__title">{post.title}</h2>
        <div className="gallery-card__meta">
          <span>{post.author}</span>
          <span className="gallery-card__meta-dot" aria-hidden="true" />
          <span>{post.createdAt}</span>
        </div>
      </div>
    </Link>
  );
}
