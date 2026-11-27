import { getNotices } from '@/lib/notices';
import { getBoardCategoryState } from '@/lib/board-categories';
import NoticesClient from './NoticesClient';

export const metadata = { title: '공지사항 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminNoticesPage() {
  const [notices, categoryState] = await Promise.all([
    getNotices(),
    getBoardCategoryState('notices', { withCounts: true }),
  ]);
  return <NoticesClient initialNotices={notices} initialCategoryState={categoryState} />;
}
