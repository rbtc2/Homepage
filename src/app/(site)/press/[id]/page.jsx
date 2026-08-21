import PressDetailView from '@/components/press/PressDetailView';
import { getPressById } from '@/lib/press-coverage';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = await getPressById(id);
  if (!row) return { title: '언론보도 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
  return { title: `${row.title} | 언론보도 | 국제인권연대 월드라이츠(WORLD RIGHTS)` };
}

export default async function PressDetailPage({ params }) {
  const { id } = await params;
  return <PressDetailView id={id} locale="ko" />;
}
