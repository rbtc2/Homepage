import { historyUi } from '@/lib/history-ui';

export default function HistoryTimeline({ grouped, locale = 'ko' }) {
  const ui = historyUi(locale);

  if (!grouped.length) {
    return (
      <div className="hy-empty">
        <p className="hy-empty__title">{ui.emptyTitle}</p>
        <p className="hy-empty__desc">{ui.emptyDesc}</p>
      </div>
    );
  }

  return grouped.map(({ year, events }) => (
    <div key={year} className="hy-block">
      <div className="hy-year" aria-hidden="true">
        <p className="hy-year__num">{year}</p>
      </div>

      <ul className="hy-events" aria-label={ui.yearAria(year)}>
        {events.map((ev) => (
          <li key={ev.id} className="hy-row">
            <span className="hy-row__month" aria-label={ui.monthAria(ev.month)}>
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
  ));
}
