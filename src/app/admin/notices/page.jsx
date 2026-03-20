import { getNotices } from '@/lib/notices';
import NoticesClient from './NoticesClient';

export const metadata = { title: '공지사항 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminNoticesPage() {
  const notices = await getNotices();
  return <NoticesClient initialNotices={notices} />;
}
