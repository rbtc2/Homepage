import { notFound } from 'next/navigation';
import { getWrNewsById, getWrNewsSecretAuth } from '@/lib/wr-news';
import { withSecretEditMeta } from '@/lib/secret-post';
import WrNewsEditorPage from '../../EditorPage';

export const metadata = { title: 'WR뉴스 수정 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminWrNewsEditPage({ params }) {
  const { id } = await params;
  const post = await getWrNewsById(id);
  if (!post) notFound();
  const secretAuth = await getWrNewsSecretAuth(id);

  return <WrNewsEditorPage post={withSecretEditMeta(post, secretAuth)} />;
}
