import { notFound } from 'next/navigation';
import EditorPage from '../../EditorPage';
import { getPressById, getPressSecretAuth } from '@/lib/press-coverage';
import { withSecretEditMeta } from '@/lib/secret-post';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = await getPressById(id);
  if (!row) return { title: '언론보도 수정 | 관리자' };
  return { title: `${row.title} 수정 | 관리자` };
}

export default async function EditPressPage({ params }) {
  const { id } = await params;
  const post = await getPressById(id);
  if (!post) notFound();
  const secretAuth = await getPressSecretAuth(id);

  return <EditorPage post={withSecretEditMeta(post, secretAuth)} />;
}
