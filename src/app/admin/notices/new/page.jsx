import { getBoardCategoryState } from '@/lib/board-categories';
import EditorPage from '../EditorPage';

export const metadata = { title: '새 게시물 작성 | 관리자' };

export default async function NewNoticePage() {
  const categoryState = await getBoardCategoryState('notices');
  return <EditorPage notice={null} categoryState={categoryState} />;
}
