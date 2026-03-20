import { getArchives } from '@/lib/archive';
import ArchiveClient from './ArchiveClient';

export const metadata = { title: '자료실 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminArchivePage() {
  const archives = await getArchives();
  return <ArchiveClient initialArchives={archives} />;
}

