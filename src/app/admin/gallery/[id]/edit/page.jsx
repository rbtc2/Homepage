import { notFound } from 'next/navigation';
import { getGalleryById } from '@/lib/gallery';
import GalleryEditorPage from '../../EditorPage';

export const metadata = { title: '갤러리 게시물 수정 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminGalleryEditPage({ params }) {
  const { id } = await params;
  const post = await getGalleryById(id);
  if (!post) notFound();

  return <GalleryEditorPage post={post} />;
}
