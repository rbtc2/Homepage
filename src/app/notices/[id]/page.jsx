import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNoticeById, getPrevNext } from '@/data/notices';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const notice = getNoticeById(id);
  if (!notice) return { title: '공지사항 | EJJ 홈페이지' };
  return { title: `${notice.title} | EJJ 홈페이지` };
}

function renderBody(content) {
  return content.split(/\n\n+/).map((block, bi) => (
    <p key={bi} className="nd__para">
      {block.split('\n').map((line, li) => (
        li === 0 ? line : <span key={li}><br />{line}</span>
      ))}
    </p>
  ));
}

export default async function NoticeDetailPage({ params }) {
  const { id } = await params;
  const notice = getNoticeById(id);
  if (!notice) notFound();

  const { prev, next } = getPrevNext(id);

  return (
    <>
      <Header />
      <main role="main">
        <div className="nd-wrap">

          <nav className="nd-crumb" aria-label="위치">
            <Link href="/" className="nd-crumb__link">홈</Link>
            <span className="nd-crumb__sep" aria-hidden="true">/</span>
            <Link href="/notices" className="nd-crumb__link">공지사항</Link>
            <span className="nd-crumb__sep" aria-hidden="true">/</span>
            <span className="nd-crumb__current" aria-current="page">상세</span>
          </nav>

          <article className="nd">
            <header className="nd__hd">
              {notice.isPinned && (
                <span className="nd__pin-badge">공지</span>
              )}
              <h1 className="nd__title">{notice.title}</h1>
              <div className="nd__byline">
                <span className="nd__byline-item">
                  <span className="nd__byline-label">작성자</span>
                  {notice.author}
                </span>
                <span className="nd__byline-dot" aria-hidden="true" />
                <time className="nd__byline-item" dateTime={notice.createdAt}>
                  {notice.createdAt}
                </time>
                <span className="nd__byline-dot" aria-hidden="true" />
                <span className="nd__byline-item">
                  조회&nbsp;{notice.views.toLocaleString()}
                </span>
              </div>
            </header>

            <div className="nd__body">
              {renderBody(notice.content)}
            </div>
          </article>

          <nav className="nd-sibling" aria-label="이전·다음 글">
            {next && (
              <Link href={`/notices/${next.id}`} className="nd-sibling__item">
                <span className="nd-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  다음 글
                </span>
                <span className="nd-sibling__title">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/notices/${prev.id}`} className="nd-sibling__item">
                <span className="nd-sibling__dir">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  이전 글
                </span>
                <span className="nd-sibling__title">{prev.title}</span>
              </Link>
            )}
          </nav>

          <div className="nd-foot">
            <Link href="/notices" className="nd-foot__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M8.5 3L5 7L8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
