import { getAllPress } from '@/lib/press-coverage';
import PressClient from './PressClient';

export const metadata = { title: '언론보도 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminPressPage() {
  const items = await getAllPress();
  return <PressClient initialItems={items} />;
}
