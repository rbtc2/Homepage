import { getArchives } from '@/lib/archive';
import { getArchiveCategoryState } from '@/lib/archive-categories';
import ArchiveClient from './ArchiveClient';

export const metadata = { title: '자료실 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminArchivePage() {
  const [archives, categoryState] = await Promise.all([
    getArchives(),
    getArchiveCategoryState({ withCounts: true }),
  ]);
  return (
    <ArchiveClient
      initialArchives={archives}
      initialCategoryState={categoryState}
    />
  );
}

