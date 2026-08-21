import NoticeDetailView from '@/components/notices/NoticeDetailView';
import { getNoticeById } from '@/lib/notices';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) return { title: '공지사항 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${notice.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function NoticeDetailPage({ params }) {
  const { id } = await params;
  return <NoticeDetailView id={id} locale="ko" />;
}
