import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '연혁 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

/*
  샘플 구조: 연도별 이벤트 수 (실제 내용 입력 전 자리 표시)
  각 배열 요소는 해당 행의 내용 줄 수를 나타냄
*/
const SAMPLE_HISTORY = [
  {
    year: '2026',
    rows: [
      { lines: ['85%', '60%'] },
      { lines: ['75%'] },
      { lines: ['90%', '65%'] },
      { lines: ['70%'] },
    ],
  },
];

/* 월 skeleton — 각 행마다 다른 너비로 자연스럽게 */
const MONTH_WIDTHS = ['1.75rem', '1.875rem', '2rem', '1.75rem', '1.875rem', '2rem', '1.75rem'];

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main role="main">

        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">연혁</h1>
          </div>
        </div>

        <div className="hy-wrap">
          {SAMPLE_HISTORY.map(({ year, rows }) => (
            <div key={year} className="hy-block">

              {/* 연도 — sticky */}
              <div className="hy-year" aria-hidden="true">
                <p className="hy-year__num">{year}</p>
              </div>

              {/* 이벤트 목록 */}
              <ul className="hy-events" aria-label={`${year}년 연혁 (준비 중)`}>
                {rows.map((row, i) => (
                  <li key={i} className="hy-row">

                    {/* 월 skeleton */}
                    <span
                      className="hy-row__month--skel hy-skel"
                      style={{ width: MONTH_WIDTHS[i % MONTH_WIDTHS.length] }}
                      aria-hidden="true"
                    />

                    {/* 내용 skeleton */}
                    <div className="hy-row__content" aria-hidden="true">
                      {row.lines.map((w, j) => (
                        <span
                          key={j}
                          className="hy-row__line hy-skel"
                          style={{ width: w }}
                        />
                      ))}
                    </div>

                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
}
