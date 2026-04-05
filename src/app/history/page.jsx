import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '연혁 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

/**
 * @typedef {Object} HistoryEvent
 * @property {string} month 월 숫자 (표시는 한 자리, 예: '3')
 * @property {string} title 한 줄 제목
 * @property {string} [detail] 선택: 부가 설명 (여러 줄일 때 사용)
 */

/** @type {Array<{ year: string, events: HistoryEvent[] }>} 같은 연도 안에서는 최신(월 큰 순)이 위 */
const HISTORY_BY_YEAR = [
  {
    year: '2026',
    events: [{ month: '3', title: '창립총회 개회' }],
  },
];

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main role="main">

        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">연혁</h1>
          </div>
        </div>

        <div className="hy-wrap">
          {HISTORY_BY_YEAR.map(({ year, events }) => (
            <div key={year} className="hy-block">

              <div className="hy-year" aria-hidden="true">
                <p className="hy-year__num">{year}</p>
              </div>

              <ul className="hy-events" aria-label={`${year}년 연혁`}>
                {events.map((ev, i) => (
                  <li key={`${year}-${ev.month}-${i}`} className="hy-row">
                    <span className="hy-row__month" aria-label={`${ev.month}월`}>
                      {ev.month}
                    </span>
                    <div className="hy-row__content">
                      <p className="hy-row__title">{ev.title}</p>
                      {ev.detail ? <p className="hy-row__detail">{ev.detail}</p> : null}
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
