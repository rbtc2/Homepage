import { notFound } from 'next/navigation';
import { getNoticeById } from '@/lib/notices';
import EditorPage from '../../EditorPage';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) return { title: '관리자' };
  return { title: `"${notice.title}" 수정 | 관리자` };
}

export default async function EditNoticePage({ params }) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) notFound();
  return <EditorPage notice={notice} />;
}
