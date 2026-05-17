import { uploadEditorCoverImage } from '@/app/admin/upload-cover-image-action';

/**
 * @param {File} file
 * @param {'wr-news' | 'gallery' | 'editor-content' | 'popups'} folder
 * @returns {Promise<{ ok: true, url: string } | { ok: false, message: string }>}
 */
export async function uploadEditorImageFile(file, folder) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  return uploadEditorCoverImage(fd);
}
