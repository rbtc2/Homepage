import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ViewTracker from '@/components/ViewTracker';
import { getGalleryById, getGalleryPrevNext } from '@/lib/gallery';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getGalleryById(id);
  if (!post) return { title: '포토갤러리 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${post.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function GalleryDetailPage({ params }) {
  const { id } = await params;
  const post = await getGalleryById(id);
  if (!post) notFound();

  const { prev, next } = await getGalleryPrevNext(id);

  return (
    <>
      <ViewTracker table="gallery" id={id} />
      <Header />
      <main role="main">
        <div className="gd-wrap">

          <nav className="gd-crumb" aria-label="위치">
            <Link href="/" className="gd-crumb__link">홈</Link>
            <span className="gd-crumb__sep" aria-hidden="true">/</span>
            <Link href="/gallery" className="gd-crumb__link">포토갤러리</Link>
            <span className="gd-crumb__sep" aria-hidden="true">/</span>
            <span className="gd-crumb__current" aria-current="page">상세</span>
          </nav>

          <article className="gd">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1180}
                height={590}
                className="gd__cover"
                priority
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="gd__cover-placeholder" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="8" width="32" height="25" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="14" cy="17" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 27l9-8 6 5 5-4 12 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}

            <header className="gd__hd">
              <h1 className="gd__title">{post.title}</h1>
              <div className="gd__byline">
                <span className="gd__byline-item">
                  <span className="gd__byline-label">작성자</span>
                  {post.author}
                </span>
                <span className="gd__byline-dot" aria-hidden="true" />
                <time className="gd__byline-item" dateTime={post.createdAt}>
                  {post.createdAt}
                </time>
                <span className="gd__byline-dot" aria-hidden="true" />
                <span className="gd__byline-item">
                  조회&nbsp;{post.views.toLocaleString()}
                </span>
              </div>
            </header>

            {post.content && post.content !== '<p></p>' && (
              <div
                className="nd__body nd__body--html"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </article>

          <nav className="gd-sibling" aria-label="이전·다음 글">
            {next && (
              <Link href={`/gallery/${next.id}`} className="gd-sibling__item">
                <span className="gd-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  다음 글
                </span>
                <span className="gd-sibling__title">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/gallery/${prev.id}`} className="gd-sibling__item">
                <span className="gd-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  이전 글
                </span>
                <span className="gd-sibling__title">{prev.title}</span>
              </Link>
            )}
          </nav>

          <div className="gd-foot">
            <Link href="/gallery" className="gd-foot__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M8.5 3L5 7L8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              목록으로
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
