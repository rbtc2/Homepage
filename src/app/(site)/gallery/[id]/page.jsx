import GalleryDetailView from '@/components/gallery/GalleryDetailView';
import { getGalleryById } from '@/lib/gallery';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getGalleryById(id);
  if (!post) return { title: '포토갤러리 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${post.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function GalleryDetailPage({ params }) {
  const { id } = await params;
  return <GalleryDetailView id={id} locale="ko" />;
}
