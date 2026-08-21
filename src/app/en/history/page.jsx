import HistoryTimeline from '@/components/history/HistoryTimeline';
import {
  FALLBACK_HISTORY_EVENTS,
  getHistoryEvents,
  groupHistoryByYear,
  localizeHistoryEvents,
} from '@/lib/history';
import { historyUi } from '@/lib/history-ui';

export const metadata = {
  title: 'History | WORLD RIGHTS',
  description: 'The path of WORLD RIGHTS.',
};

export const revalidate = 60;

export default async function EnHistoryPage() {
  const ui = historyUi('en');
  let grouped = [];
  try {
    grouped = groupHistoryByYear(localizeHistoryEvents(await getHistoryEvents(), 'en'));
  } catch {
    grouped = groupHistoryByYear(localizeHistoryEvents(FALLBACK_HISTORY_EVENTS, 'en'));
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
        <HistoryTimeline grouped={grouped} locale="en" />
      </div>
    </main>
  );
}
