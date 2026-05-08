'use server';

import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'covers';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const ALLOWED_FOLDERS = new Set(['wr-news', 'gallery']);

/**
 * 관리자 세션 + Supabase Storage(`covers`)에 이미지 업로드 후 공개 URL 반환.
 * @param {FormData} formData - `file` (File), `folder` ('wr-news' | 'gallery')
 * @returns {Promise<{ ok: true, url: string } | { ok: false, message: string }>}
 */
export async function uploadEditorCoverImage(formData) {
  try {
    const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSession(raw))) {
      return { ok: false, message: '관리자로 로그인한 뒤 다시 시도해 주세요.' };
    }

    const folderRaw = (formData.get('folder') ?? '').toString().trim();
    if (!ALLOWED_FOLDERS.has(folderRaw)) {
      return { ok: false, message: '허용되지 않은 업로드 경로입니다.' };
    }

    const file = formData.get('file');
    if (!file || typeof file === 'string' || !('size' in file)) {
      return { ok: false, message: '파일을 선택해 주세요.' };
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return { ok: false, message: 'JPG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.' };
    }

    if (file.size > MAX_BYTES) {
      return { ok: false, message: '파일 크기는 5MB 이하여야 합니다.' };
    }

    const ext = MIME_TO_EXT[file.type];
    if (!ext) {
      return { ok: false, message: '지원하지 않는 이미지 형식입니다.' };
    }

    const path = `${folderRaw}/${Date.now()}-${randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        ok: false,
        message:
          msg.includes('SUPABASE') || msg.includes('비어')
            ? msg
            : '서버 설정(Supabase URL / Service Role 키)을 확인해 주세요.',
      };
    }

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      return { ok: false, message: uploadError.message || '업로드에 실패했습니다.' };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return { ok: true, url: publicUrl };
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
