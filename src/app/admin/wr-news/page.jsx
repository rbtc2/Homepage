import { getWrNewsPosts } from '@/lib/wr-news';
import WrNewsClient from './WrNewsClient';

export const metadata = { title: 'WR뉴스 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminWrNewsPage() {
  const posts = await getWrNewsPosts();
  return <WrNewsClient initialPosts={posts} />;
}
