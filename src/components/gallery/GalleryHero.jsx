import Link from 'next/link';
import Image from 'next/image';

/**
 * 갤러리 히어로 섹션 — 최신 1~3개 게시물을 큰 이미지로 노출
 *
 * @param {object[]} items   - 최신 갤러리 게시물 배열 (최대 3)
 * @param {string}   basePath
 */
export default function GalleryHero({ items, basePath = '/gallery' }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="gallery-hero" aria-label="주요 갤러리">
      <div className="gallery-hero__inner">
        <div className="gallery-hero__grid">
          {items.map((post, i) => (
            <Link
              key={post.id}
              href={`${basePath}/${post.id}`}
              className="gallery-hero__item"
              aria-label={post.title}
            >
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes={
                    i === 0
                      ? '(max-width: 640px) 100vw, 66vw'
                      : '(max-width: 640px) 100vw, 33vw'
                  }
                  className="gallery-hero__img"
                  priority={i === 0}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="gallery-hero__placeholder" aria-hidden="true">
                  <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                    <rect x="3" y="6" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 22l7-6 5 4 4-3 10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              <div className="gallery-hero__overlay">
                <p className="gallery-hero__title">{post.title}</p>
                <p className="gallery-hero__meta">{post.author} · {post.createdAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
