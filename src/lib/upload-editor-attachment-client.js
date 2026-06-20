import { uploadEditorAttachment } from '@/app/admin/upload-editor-attachment-action';

/**
 * @param {File} file
 * @returns {Promise<{ ok: true, url: string, fileName: string } | { ok: false, message: string }>}
 */
export async function uploadEditorAttachmentFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', 'editor-attachments');
  return uploadEditorAttachment(fd);
}
