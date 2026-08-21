import HistoryTimeline from '@/components/history/HistoryTimeline';
import {
  FALLBACK_HISTORY_EVENTS,
  getHistoryEvents,
  groupHistoryByYear,
} from '@/lib/history';
import { historyUi } from '@/lib/history-ui';

export const metadata = {
  title: '연혁 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export const revalidate = 60;

export default async function HistoryPage() {
  const ui = historyUi('ko');
  let grouped = [];
  try {
    grouped = groupHistoryByYear(await getHistoryEvents());
  } catch {
    grouped = groupHistoryByYear(FALLBACK_HISTORY_EVENTS);
  }

  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">{ui.sectionLabel}</p>
          <h1 className="page-header__title">{ui.title}</h1>
        </div>
      </div>

      <div className="hy-wrap">
        <HistoryTimeline grouped={grouped} locale="ko" />
      </div>
    </main>
  );
}
