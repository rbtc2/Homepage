import { getGalleryPosts } from '@/lib/gallery';
import GalleryClient from './GalleryClient';

export const metadata = { title: '포토갤러리 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const posts = await getGalleryPosts();
  return <GalleryClient initialPosts={posts} />;
}
