import NoticeDetailView from '@/components/notices/NoticeDetailView';
import { getNoticeById, localizeNotice } from '@/lib/notices';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const notice = localizeNotice(await getNoticeById(id), 'en');
  if (!notice) return { title: 'Notices | WORLD RIGHTS' };
  return { title: `${notice.title} | WORLD RIGHTS` };
}

export default async function EnNoticeDetailPage({ params }) {
  const { id } = await params;
  return <NoticeDetailView id={id} locale="en" />;
}
