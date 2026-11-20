import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import {
  IMAGE_QUALITY_PRESETS,
  isOptimizableImage,
} from '@/lib/optimize-image-presets';
import { optimizeImageBuffer } from '@/lib/optimize-image-server';

export const runtime = 'nodejs';

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * 이미지 최적화 API — Server Action RSC 페이로드 대신 바이너리 응답.
 * 첨부와 같이 FormData 본문 제한·직렬화 이슈를 피합니다.
 */
export async function POST(request) {
  try {
    const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSession(raw))) {
      return Response.json(
        { ok: false, message: '관리자로 로그인한 뒤 다시 시도해 주세요.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const presetKey = (formData.get('preset') ?? '').toString().trim();
    if (!IMAGE_QUALITY_PRESETS[presetKey]) {
      return Response.json(
        { ok: false, message: '올바른 품질 프리셋을 선택해 주세요.' },
        { status: 400 }
      );
    }

    const file = formData.get('file');
    if (!file || typeof file === 'string' || !('size' in file) || !('type' in file)) {
      return Response.json({ ok: false, message: '파일을 선택해 주세요.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        { ok: false, message: 'JPG, PNG, WebP, GIF 이미지만 최적화할 수 있습니다.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_INPUT_BYTES) {
      return Response.json(
        { ok: false, message: '최적화할 파일은 15MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (!isOptimizableImage(file) || file.type === 'image/gif') {
      return Response.json({
        ok: true,
        skipped: true,
        originalBytes: file.size,
        resultBytes: file.size,
        format: 'original',
      });
    }

    const input = Buffer.from(await file.arrayBuffer());
    const result = await optimizeImageBuffer(input, presetKey);
    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';

    if (result.skipped) {
      return Response.json({
        ok: true,
        skipped: true,
        originalBytes: result.originalBytes,
        resultBytes: result.resultBytes,
        format: 'original',
      });
    }

    const fileName = `${baseName}.${result.extension}`;
    return new Response(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Length': String(result.resultBytes),
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-Original-Bytes': String(result.originalBytes),
        'X-Result-Bytes': String(result.resultBytes),
        'X-Format': result.format,
        'X-File-Name': encodeURIComponent(fileName),
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[optimize-image]', msg);
    return Response.json(
      {
        ok: false,
        message: msg
          ? `이미지 최적화에 실패했습니다: ${msg}`
          : '이미지 최적화 중 오류가 났습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    );
  }
}
