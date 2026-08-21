import PressDetailView from '@/components/press/PressDetailView';
import { getPressById } from '@/lib/press-coverage';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const row = await getPressById(id);
  if (!row) return { title: 'Press | WORLD RIGHTS' };
  return { title: `${row.title} | Press | WORLD RIGHTS` };
}

export default async function EnPressDetailPage({ params }) {
  const { id } = await params;
  return <PressDetailView id={id} locale="en" />;
}
