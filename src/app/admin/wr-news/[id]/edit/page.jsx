import { notFound } from 'next/navigation';
import { getWrNewsById } from '@/lib/wr-news';
import WrNewsEditorPage from '../../EditorPage';

export const metadata = { title: 'WR뉴스 수정 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminWrNewsEditPage({ params }) {
  const { id } = await params;
  const post = await getWrNewsById(id);
  if (!post) notFound();

  return <WrNewsEditorPage post={post} />;
}
