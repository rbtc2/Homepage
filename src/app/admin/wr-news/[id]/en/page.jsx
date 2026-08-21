import { notFound } from 'next/navigation';
import { getWrNewsById } from '@/lib/wr-news';
import WrNewsEnglishEditorPage from '../../EnglishEditorPage';

export const metadata = { title: 'WR뉴스 영문 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminWrNewsEnglishPage({ params }) {
  const { id } = await params;
  const post = await getWrNewsById(id);
  if (!post) notFound();

  return <WrNewsEnglishEditorPage post={post} />;
}
