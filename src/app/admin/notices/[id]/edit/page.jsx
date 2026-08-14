import { notFound } from 'next/navigation';
import { getNoticeById, getNoticeSecretAuth } from '@/lib/notices';
import { withSecretEditMeta } from '@/lib/secret-post';
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
  const secretAuth = await getNoticeSecretAuth(id);
  return <EditorPage notice={withSecretEditMeta(notice, secretAuth)} />;
}
