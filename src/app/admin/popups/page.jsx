import PopupsClient from './PopupsClient';
import { getPopups } from '@/lib/popups';

export const metadata = { title: '팝업 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminPopupsPage() {
  let initialPopups = [];
  try {
    initialPopups = await getPopups();
  } catch {
    initialPopups = [];
  }

  return <PopupsClient initialPopups={initialPopups} />;
}
