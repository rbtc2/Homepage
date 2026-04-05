import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ViewTracker from '@/components/ViewTracker';
import { getPressById, getPrevNextPress } from '@/lib/press-coverage';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = await getPressById(id);
  if (!row) return { title: '언론보도 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${row.title} | 언론보도 | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

function isEmptyHtml(html) {
  if (!html || !html.trim()) return true;
  const t = html.replace(/\s/g, '');
  return t === '<p></p>' || t === '<p><br></p>' || t === '<p><br/></p>';
}

export default async function PressDetailPage({ params }) {
  const { id } = await params;
  const row = await getPressById(id);
  if (!row) notFound();

  const { prev, next } = await getPrevNextPress(id);
  const hasBody = !isEmptyHtml(row.content);

  return (
    <>
      <ViewTracker table="press_coverage" id={id} />
      <Header />
      <main role="main">
        <div className="nd-wrap pd-wrap">
          <nav className="nd-crumb" aria-label="위치">
            <Link href="/" className="nd-crumb__link">
              홈
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href="/press" className="nd-crumb__link">
              언론보도
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="nd-crumb__current" aria-current="page">
              상세
            </span>
          </nav>

          <article className="nd pd">
            <header className="nd__hd pd__hd">
              {row.isFeatured && <span className="pd__badge">대표 보도</span>}
              <h1 className="nd__title">{row.title}</h1>
              <div className="pd__source-card">
                <dl className="pd__dl">
                  <div className="pd__dl-row">
                    <dt>언론사</dt>
                    <dd>{row.sourceName}</dd>
                  </div>
                  <div className="pd__dl-row">
                    <dt>게재일</dt>
                    <dd>
                      <time dateTime={row.publishedAt}>{row.publishedAt}</time>
                    </dd>
                  </div>
                  <div className="pd__dl-row">
                    <dt>등록일</dt>
                    <dd>
                      <time dateTime={row.createdAt}>{row.createdAt}</time>
                    </dd>
                  </div>
                  <div className="pd__dl-row">
                    <dt>조회</dt>
                    <dd>{row.views.toLocaleString()}</dd>
                  </div>
                </dl>
                <div className="pd__cta">
                  <a
                    href={row.articleUrl}
                    className="pd__btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    원문 기사 보기
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <p className="pd__cta-note">외부 사이트로 이동합니다.</p>
                </div>
              </div>
            </header>

            {hasBody && (
              <div
                className="nd__body nd__body--html pd__body"
                dangerouslySetInnerHTML={{ __html: row.content }}
              />
            )}
          </article>

          <nav className="nd-sibling" aria-label="이전·다음 글">
            {next && (
              <Link href={`/press/${next.id}`} className="nd-sibling__item">
                <span className="nd-sibling__dir">
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
                <span className="nd-sibling__title">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/press/${prev.id}`} className="nd-sibling__item">
                <span className="nd-sibling__dir">
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
                <span className="nd-sibling__title">{prev.title}</span>
              </Link>
            )}
          </nav>

          <div className="nd-foot">
            <Link href="/press" className="nd-foot__back">
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
