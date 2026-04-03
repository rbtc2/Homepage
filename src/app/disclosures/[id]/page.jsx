import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ViewTracker from '@/components/ViewTracker';
import { getDisclosureById, getPrevNext } from '@/lib/disclosures';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const disclosure = await getDisclosureById(id);
  if (!disclosure) return { title: '공시자료 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${disclosure.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function DisclosureDetailPage({ params }) {
  const { id } = await params;
  const disclosure = await getDisclosureById(id);
  if (!disclosure) notFound();

  const { prev, next } = await getPrevNext(id);

  return (
    <>
      <ViewTracker table="disclosures" id={id} />
      <Header />
      <main role="main">
        <div className="nd-wrap">
          <nav className="nd-crumb" aria-label="위치">
            <Link href="/" className="nd-crumb__link">
              홈
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <Link href="/disclosures" className="nd-crumb__link">
              공시자료
            </Link>
            <span className="nd-crumb__sep" aria-hidden="true">
              /
            </span>
            <span className="nd-crumb__current" aria-current="page">
              상세
            </span>
          </nav>

          <article className="nd">
            <header className="nd__hd">
              <h1 className="nd__title">{disclosure.title}</h1>
              <div className="nd__byline">
                <span className="nd__byline-item">
                  <span className="nd__byline-label">작성자</span>
                  {disclosure.author}
                </span>
                <span className="nd__byline-dot" aria-hidden="true" />
                <time className="nd__byline-item" dateTime={disclosure.createdAt}>
                  {disclosure.createdAt}
                </time>
                <span className="nd__byline-dot" aria-hidden="true" />
                <span className="nd__byline-item">
                  조회&nbsp;{Number(disclosure.views ?? 0).toLocaleString()}
                </span>
              </div>
            </header>

            <div
              className="nd__body nd__body--html"
              dangerouslySetInnerHTML={{ __html: disclosure.content }}
            />
          </article>

          <nav className="nd-sibling" aria-label="이전·다음 글">
            {next && (
              <Link href={`/disclosures/${next.id}`} className="nd-sibling__item">
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
                  다음 자료
                </span>
                <span className="nd-sibling__title">{next.title}</span>
              </Link>
            )}
            {prev && (
              <Link href={`/disclosures/${prev.id}`} className="nd-sibling__item">
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
                  이전 자료
                </span>
                <span className="nd-sibling__title">{prev.title}</span>
              </Link>
            )}
          </nav>

          <div className="nd-foot">
            <Link href="/disclosures" className="nd-foot__back">
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

