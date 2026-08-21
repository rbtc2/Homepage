import GalleryDetailView from '@/components/gallery/GalleryDetailView';
import { getGalleryById, localizeGalleryPost } from '@/lib/gallery';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = localizeGalleryPost(await getGalleryById(id), 'en');
  if (!post) return { title: 'Gallery | WORLD RIGHTS' };
  return { title: `${post.title} | WORLD RIGHTS` };
}

export default async function EnGalleryDetailPage({ params }) {
  const { id } = await params;
  return <GalleryDetailView id={id} locale="en" />;
}
