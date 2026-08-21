import { getHistoryEvents, groupHistoryByYear } from '@/lib/history';

export const metadata = {
  title: '연혁 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export const revalidate = 60;

const FALLBACK_EVENTS = [
  { id: 'fallback-7', year: 2026, month: 7, title: '이주여성 문화 콘텐츠 강사 양성과정 1기 입과', detail: '' },
  { id: 'fallback-3', year: 2026, month: 3, title: '창립총회 개회', detail: '' },
];

export default async function HistoryPage() {
  let grouped = [];
  try {
    grouped = groupHistoryByYear(await getHistoryEvents());
  } catch {
    grouped = groupHistoryByYear(FALLBACK_EVENTS);
  }

  return (
    <>
      <main role="main">

        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">단체 소개</p>
            <h1 className="page-header__title">연혁</h1>
          </div>
        </div>

        <div className="hy-wrap">
          {grouped.length === 0 ? (
            <div className="hy-empty">
              <p className="hy-empty__title">등록된 연혁이 없습니다.</p>
              <p className="hy-empty__desc">곧 단체의 발자취를 이곳에 기록합니다.</p>
            </div>
          ) : (
            grouped.map(({ year, events }) => (
              <div key={year} className="hy-block">

                <div className="hy-year" aria-hidden="true">
                  <p className="hy-year__num">{year}</p>
                </div>

                <ul className="hy-events" aria-label={`${year}년 연혁`}>
                  {events.map((ev) => (
                    <li key={ev.id} className="hy-row">
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
            ))
          )}
        </div>

      </main>
    </>
  );
}
