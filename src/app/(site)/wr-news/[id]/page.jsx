import WrNewsDetailView from '@/components/wr-news/WrNewsDetailView';
import { getWrNewsById } from '@/lib/wr-news';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getWrNewsById(id);
  if (!post) return { title: 'WR뉴스 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${post.title} | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function WrNewsDetailPage({ params }) {
  const { id } = await params;
  return <WrNewsDetailView id={id} locale="ko" />;
}
