export function getAttachmentFileExtension(filename) {
  const match = String(filename ?? '').match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

/**
 * @param {string} displayNameRaw - 사용자가 입력한 표시 파일명
 * @param {string} originalFileName - 원본 파일명(업로드 파일명 또는 URL 마지막 세그먼트)
 * @param {string} [fallbackExt] - 확장자가 없을 때 붙일 값
 */
export function resolveAttachmentDisplayName(displayNameRaw, originalFileName, fallbackExt = '') {
  const original = String(originalFileName ?? '').trim() || (fallbackExt ? `첨부파일.${fallbackExt}` : '첨부파일');
  const custom = String(displayNameRaw ?? '')
    .replace(/[/\\<>:"|?*\x00-\x1f]/g, '')
    .trim();

  if (!custom) return original;

  if (getAttachmentFileExtension(custom)) return custom;

  const ext = getAttachmentFileExtension(original) || fallbackExt;
  return ext ? `${custom}.${ext}` : custom;
}
