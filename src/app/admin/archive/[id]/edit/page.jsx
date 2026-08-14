import { notFound } from 'next/navigation';
import { getArchiveById, getArchiveSecretAuth } from '@/lib/archive';
import { withSecretEditMeta } from '@/lib/secret-post';
import EditorPage from '../../EditorPage';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const archive = await getArchiveById(id);
  if (!archive) return { title: '관리자' };
  return { title: `"${archive.title}" 수정 | 관리자` };
}

export default async function EditArchivePage({ params }) {
  const { id } = await params;
  const archive = await getArchiveById(id);
  if (!archive) notFound();
  const secretAuth = await getArchiveSecretAuth(id);
  return <EditorPage archive={withSecretEditMeta(archive, secretAuth)} />;
}
