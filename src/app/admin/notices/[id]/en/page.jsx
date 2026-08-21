import { notFound } from 'next/navigation';
import { getNoticeById } from '@/lib/notices';
import NoticesEnglishEditorPage from '../../EnglishEditorPage';

export const metadata = { title: '공지사항 영문 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminNoticeEnglishPage({ params }) {
  const { id } = await params;
  const post = await getNoticeById(id);
  if (!post) notFound();

  return <NoticesEnglishEditorPage post={post} />;
}
