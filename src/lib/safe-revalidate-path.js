import { revalidatePath } from 'next/cache';

/**
 * Server Action 등에서 revalidatePath가 incrementalCache 부재로 실패해도
 * DB 변경은 유지되도록 합니다. 클라이언트 router.refresh()와 함께 쓰입니다.
 */
export function safeRevalidatePath(path) {
  try {
    revalidatePath(path);
  } catch (e) {
    console.error('[safeRevalidatePath]', path, e);
  }
}
