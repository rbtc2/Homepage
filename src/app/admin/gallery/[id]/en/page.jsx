import { notFound } from 'next/navigation';
import { getGalleryById } from '@/lib/gallery';
import GalleryEnglishEditorPage from '../../EnglishEditorPage';

export const metadata = { title: '포토갤러리 영문 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminGalleryEnglishPage({ params }) {
  const { id } = await params;
  const post = await getGalleryById(id);
  if (!post) notFound();

  return <GalleryEnglishEditorPage post={post} />;
}
