import HistoryClient from './HistoryClient';
import { getHistoryEvents } from '@/lib/history';

export const metadata = { title: '연혁 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminHistoryPage() {
  let initialEvents = [];
  try {
    initialEvents = await getHistoryEvents();
  } catch {
    initialEvents = [];
  }

  return <HistoryClient initialEvents={initialEvents} />;
}
