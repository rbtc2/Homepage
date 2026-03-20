import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNoticeById, getPrevNext } from '@/data/notices';

export async function generateMetadata({ params }) {
  const notice = getNoticeById(params.id);
  if (!notice) return { title: '공지사항 | EJJ 홈페이지' };
  return { title: `${notice.title} | EJJ 홈페이지` };
}

export default function NoticeDetailPage({ params }) {
  const notice = getNoticeById(params.id);
  if (!notice) notFound();

  const { prev, next } = getPrevNext(params.id);

  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">공지사항</h1>
          </div>
        </div>

        <div className="notice-board">
          <div className="notice-board__inner">
            <article className="notice-detail">
              <header className="notice-detail__header">
                {notice.isPinned && <span className="notice-badge">공지</span>}
                <h2 className="notice-detail__title">{notice.title}</h2>
                <dl className="notice-detail__info">
                  <div className="notice-detail__info-item">
                    <dt>작성자</dt>
                    <dd>{notice.author}</dd>
                  </div>
                  <div className="notice-detail__info-item">
                    <dt>작성일</dt>
                    <dd>{notice.createdAt}</dd>
                  </div>
                  <div className="notice-detail__info-item">
                    <dt>조회</dt>
                    <dd>{notice.views.toLocaleString()}</dd>
                  </div>
                </dl>
              </header>

              <div className="notice-detail__body">
                {notice.content.split('\n').map((line, i) =>
                  line === '' ? <br key={i} /> : <p key={i}>{line}</p>
                )}
              </div>
            </article>

            <nav className="notice-nav" aria-label="이전·다음 글">
              {next && (
                <Link href={`/notices/${next.id}`} className="notice-nav__item notice-nav__item--next">
                  <span className="notice-nav__label">다음글</span>
                  <span className="notice-nav__title">{next.title}</span>
                </Link>
              )}
              {prev && (
                <Link href={`/notices/${prev.id}`} className="notice-nav__item notice-nav__item--prev">
                  <span className="notice-nav__label">이전글</span>
                  <span className="notice-nav__title">{prev.title}</span>
                </Link>
              )}
            </nav>

            <div className="notice-board__actions">
              <Link href="/notices" className="btn btn--outline">
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
