'use server';

import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import {
  IMAGE_QUALITY_PRESETS,
  isOptimizableImage,
} from '@/lib/optimize-image-presets';
import { optimizeImageBuffer } from '@/lib/optimize-image-server';

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * 관리자 세션으로 이미지를 sharp AVIF(또는 WebP 폴백) 최적화.
 * @param {FormData} formData - `file`, `preset` ('high' | 'medium' | 'size')
 * @returns {Promise<
 *   | {
 *       ok: true;
 *       skipped: boolean;
 *       originalBytes: number;
 *       resultBytes: number;
 *       mimeType: string;
 *       fileName: string;
 *       base64: string | null;
 *       format: 'avif' | 'webp' | 'original';
 *     }
 *   | { ok: false; message: string }
 * >}
 */
export async function optimizeEditorImage(formData) {
  try {
    const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSession(raw))) {
      return { ok: false, message: '관리자로 로그인한 뒤 다시 시도해 주세요.' };
    }

    const presetKey = (formData.get('preset') ?? '').toString().trim();
    if (!IMAGE_QUALITY_PRESETS[presetKey]) {
      return { ok: false, message: '올바른 품질 프리셋을 선택해 주세요.' };
    }

    const file = formData.get('file');
    if (!file || typeof file === 'string' || !('size' in file) || !('type' in file)) {
      return { ok: false, message: '파일을 선택해 주세요.' };
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return { ok: false, message: 'JPG, PNG, WebP, GIF 이미지만 최적화할 수 있습니다.' };
    }

    if (file.size > MAX_INPUT_BYTES) {
      return { ok: false, message: '최적화할 파일은 15MB 이하여야 합니다.' };
    }

    if (!isOptimizableImage(file) || file.type === 'image/gif') {
      const buf = Buffer.from(await file.arrayBuffer());
      return {
        ok: true,
        skipped: true,
        originalBytes: buf.length,
        resultBytes: buf.length,
        mimeType: file.type,
        fileName: file.name || 'image.gif',
        base64: buf.toString('base64'),
        format: 'original',
      };
    }

    const input = Buffer.from(await file.arrayBuffer());
    const result = await optimizeImageBuffer(input, presetKey);
    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';

    if (result.skipped) {
      return {
        ok: true,
        skipped: true,
        originalBytes: result.originalBytes,
        resultBytes: result.resultBytes,
        mimeType: file.type,
        fileName: file.name || 'image',
        base64: input.toString('base64'),
        format: 'original',
      };
    }

    return {
      ok: true,
      skipped: false,
      originalBytes: result.originalBytes,
      resultBytes: result.resultBytes,
      mimeType: result.mimeType,
      fileName: `${baseName}.${result.extension}`,
      base64: result.buffer.toString('base64'),
      format: result.format,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      message:
        msg && !msg.includes('NEXT_REDIRECT')
          ? `이미지 최적화에 실패했습니다: ${msg}`
          : '이미지 최적화 중 오류가 났습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
}
