import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ViewTracker from '@/components/ViewTracker';
import SafeHtml from '@/components/board/SafeHtml';
import SecretPostGate from '@/components/board/SecretPostGate';
import { getWrNewsById, getWrNewsPrevNext, getWrNewsSecretAuth } from '@/lib/wr-news';
import { canReadSecretPost, SECRET_BOARD_CONFIG } from '@/lib/secret-post';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getWrNewsById(id);
  if (!post) return { title: 'WR뉴스 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${post.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function WrNewsDetailPage({ params }) {
  const { id } = await params;
  const post = await getWrNewsById(id);
  if (!post) notFound();

  const secretAuth = await getWrNewsSecretAuth(id);
  const board = SECRET_BOARD_CONFIG.wr_news;
  const canRead = await canReadSecretPost({
    isSecret: secretAuth.isSecret,
    secretPasswordHash: secretAuth.secretPasswordHash,
    cookiePrefix: board.cookiePrefix,
    id,
  });

  const { prev, next } = await getWrNewsPrevNext(id);

  return (
    <>
      <ViewTracker table="wr_news" id={id} />
      <Header />
      <main role="main" className="wna-page">
        <div className="wna-wrap">
          <nav className="wna-crumb" aria-label="위치">
            <Link href="/" className="wna-crumb__link">
              홈
            </Link>
            <span className="wna-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href="/wr-news" className="wna-crumb__link">
              WR뉴스
            </Link>
            <span className="wna-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="wna-crumb__current" aria-current="page">
              상세
            </span>
          </nav>

          <article className="wna">
            <header className="wna__hd">
              <p className="wna__eyebrow">WR뉴스</p>
              <h1 className="wna__title">{post.title}</h1>
              <div className="wna__byline">
                <span className="wna__byline-item">
                  <span className="wna__byline-label">작성자</span>
                  {post.author}
                </span>
                <span className="wna__byline-dot" aria-hidden="true" />
                <time className="wna__byline-item" dateTime={post.createdAt}>
                  {post.createdAt}
                </time>
                <span className="wna__byline-dot" aria-hidden="true" />
                <span className="wna__byline-item">조회&nbsp;{post.views.toLocaleString()}</span>
              </div>
            </header>

            {canRead ? (
              <>
                {post.coverImage ? (
                  <figure className="wna__cover">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={1600}
                      height={1200}
                      className="wna__cover-img"
                      priority
                      sizes="(max-width: 768px) 100vw, 720px"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </figure>
                ) : null}
                <SafeHtml html={post.content} className="wna__body nd__body--html" />
              </>
            ) : (
              <SecretPostGate board="wr_news" id={id} />
            )}
          </article>

          <nav className="wna-sibling" aria-label="이전·다음 글">
            {next && (
              <Link href={`/wr-news/${next.id}`} className="wna-sibling__item">
                <span className="wna-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 8L6 4L10 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  다음 글
                </span>
                <span className="wna-sibling__title">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/wr-news/${prev.id}`} className="wna-sibling__item">
                <span className="wna-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  이전 글
                </span>
                <span className="wna-sibling__title">{prev.title}</span>
              </Link>
            )}
          </nav>

          <div className="wna-foot">
            <Link href="/wr-news" className="wna-foot__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M8.5 3L5 7L8.5 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
