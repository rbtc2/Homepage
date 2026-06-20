import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-session';
import { processEditorAttachmentUpload } from '@/lib/editor-attachment-upload';

export const runtime = 'nodejs';

/** 첨부파일 업로드 — Server Action 본문 제한·파싱 오류를 피하기 위해 API Route 사용 */
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
    const result = await processEditorAttachmentUpload(formData);
    return Response.json(result, { status: result.ok ? 200 : 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json(
      {
        ok: false,
        message: msg || '업로드 처리 중 오류가 났습니다.',
      },
      { status: 500 }
    );
  }
}
