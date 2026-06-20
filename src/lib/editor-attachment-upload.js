import { randomUUID } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'attachments';
const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(['editor-attachments']);

const MIME_TO_EXT = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/x-hwp': 'hwp',
  'application/haansofthwp': 'hwp',
  'application/vnd.hancom.hwp': 'hwp',
};

const EXT_TO_MIME = Object.fromEntries(
  Object.entries(MIME_TO_EXT).map(([mime, ext]) => [ext, mime])
);

const ALLOWED_EXTS = new Set([...Object.values(MIME_TO_EXT), 'hwpx']);

function getFileExtension(filename) {
  const match = String(filename ?? '').match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

function resolveUploadMeta(file) {
  const name = file.name || 'file';
  const extFromName = getFileExtension(name);

  if (file.type && MIME_TO_EXT[file.type]) {
    return { mime: file.type, ext: MIME_TO_EXT[file.type] };
  }

  if (extFromName === 'hwpx') {
    return { mime: 'application/vnd.hancom.hwpx', ext: 'hwpx' };
  }

  if (extFromName && ALLOWED_EXTS.has(extFromName)) {
    return {
      mime: EXT_TO_MIME[extFromName] || 'application/octet-stream',
      ext: extFromName,
    };
  }

  return null;
}

/**
 * @param {FormData} formData
 * @returns {Promise<{ ok: true, url: string, fileName: string } | { ok: false, message: string }>}
 */
export async function processEditorAttachmentUpload(formData) {
  const folderRaw = (formData.get('folder') ?? '').toString().trim();
  if (!ALLOWED_FOLDERS.has(folderRaw)) {
    return { ok: false, message: '허용되지 않은 업로드 경로입니다.' };
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string' || !('size' in file)) {
    return { ok: false, message: '파일을 선택해 주세요.' };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, message: '파일 크기는 20MB 이하여야 합니다.' };
  }

  const meta = resolveUploadMeta(file);
  if (!meta) {
    return {
      ok: false,
      message: 'PDF, Word, Excel, PowerPoint, ZIP, HWP 파일만 업로드할 수 있습니다.',
    };
  }

  const path = `${folderRaw}/${Date.now()}-${randomUUID()}.${meta.ext}`;
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
    contentType: meta.mime,
    upsert: false,
  });

  if (uploadError) {
    const msg = uploadError.message || '업로드에 실패했습니다.';
    if (/bucket not found|does not exist/i.test(msg)) {
      return {
        ok: false,
        message:
          'Storage 버킷(attachments)이 없습니다. Supabase에 마이그레이션(20260620120000_storage_bucket_attachments.sql)을 적용한 뒤 다시 시도해 주세요.',
      };
    }
    if (/mime|content type|not allowed/i.test(msg)) {
      return {
        ok: false,
        message: `Storage가 이 파일 형식을 허용하지 않습니다. (${meta.mime}) Supabase 버킷 설정을 확인해 주세요.`,
      };
    }
    return { ok: false, message: msg };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { ok: true, url: publicUrl, fileName: file.name || `첨부파일.${meta.ext}` };
}
