import { notFound } from 'next/navigation';
import { getDisclosureById, getDisclosureSecretAuth } from '@/lib/disclosures';
import { withSecretEditMeta } from '@/lib/secret-post';
import EditorPage from '../../EditorPage';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const disclosure = await getDisclosureById(id);
  if (!disclosure) return { title: '관리자' };
  return { title: `"${disclosure.title}" 수정 | 관리자` };
}

export default async function EditDisclosurePage({ params }) {
  const { id } = await params;
  const disclosure = await getDisclosureById(id);
  if (!disclosure) notFound();
  const secretAuth = await getDisclosureSecretAuth(id);
  return <EditorPage disclosure={withSecretEditMeta(disclosure, secretAuth)} />;
}
