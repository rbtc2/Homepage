import WrNewsDetailView from '@/components/wr-news/WrNewsDetailView';
import { getWrNewsById, localizeWrNewsPost } from '@/lib/wr-news';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = localizeWrNewsPost(await getWrNewsById(id), 'en');
  if (!post) return { title: 'WR News | WORLD RIGHTS' };
  return { title: `${post.title} | WORLD RIGHTS` };
}

export default async function EnWrNewsDetailPage({ params }) {
  const { id } = await params;
  return <WrNewsDetailView id={id} locale="en" />;
}
