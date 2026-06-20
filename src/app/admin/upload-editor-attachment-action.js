'use server';

import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import { processEditorAttachmentUpload } from '@/lib/editor-attachment-upload';

/**
 * @param {FormData} formData
 * @returns {Promise<{ ok: true, url: string, fileName: string } | { ok: false, message: string }>}
 */
export async function uploadEditorAttachment(formData) {
  try {
    const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSession(raw))) {
      return { ok: false, message: '관리자로 로그인한 뒤 다시 시도해 주세요.' };
    }
    return await processEditorAttachmentUpload(formData);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      message:
        msg && !msg.includes('NEXT_REDIRECT')
          ? msg
          : '업로드 처리 중 오류가 났습니다. 파일 크기·형식을 확인하거나 잠시 후 다시 시도해 주세요.',
    };
  }
}
