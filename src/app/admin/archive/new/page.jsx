import EditorPage from '../EditorPage';
import { getArchiveCategoryState } from '@/lib/archive-categories';

export const metadata = { title: '새 자료 작성 | 관리자' };

export default async function NewArchivePage() {
  const categoryState = await getArchiveCategoryState();
  return <EditorPage archive={null} categoryState={categoryState} />;
}

