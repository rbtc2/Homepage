import EnComingSoonBanner from '@/components/en/EnComingSoonBanner';
import { getHistoryEvents, groupHistoryByYear } from '@/lib/history';

export const metadata = {
  title: 'History',
  description: 'The path of WORLD RIGHTS.',
};

export const revalidate = 60;

const FALLBACK_EVENTS = [
  { id: 'fallback-7', year: 2026, month: 7, title: '이주여성 문화 콘텐츠 강사 양성과정 1기 입과', detail: '' },
  { id: 'fallback-3', year: 2026, month: 3, title: '창립총회 개회', detail: '' },
];

export default async function EnHistoryPage() {
  let grouped = [];
  try {
    grouped = groupHistoryByYear(await getHistoryEvents());
  } catch {
    grouped = groupHistoryByYear(FALLBACK_EVENTS);
  }

  return (
    <>
      <EnComingSoonBanner />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">About</p>
            <h1 className="page-header__title">History</h1>
          </div>
        </div>

        <div className="hy-wrap">
          {grouped.length === 0 ? (
            <div className="hy-empty">
              <p className="hy-empty__title">No history entries yet.</p>
              <p className="hy-empty__desc">We will record the organization's path here soon.</p>
            </div>
          ) : (
            grouped.map(({ year, events }) => (
              <div key={year} className="hy-block">
                <div className="hy-year" aria-hidden="true">
                  <p className="hy-year__num">{year}</p>
                </div>

                <ul className="hy-events" aria-label={`History in ${year}`}>
                  {events.map((ev) => (
                    <li key={ev.id} className="hy-row">
                      <span className="hy-row__month" aria-label={`Month ${ev.month}`}>
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
