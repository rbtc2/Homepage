import { notFound } from 'next/navigation';
import { getDisclosureById } from '@/lib/disclosures';
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
  return <EditorPage disclosure={disclosure} />;
}

