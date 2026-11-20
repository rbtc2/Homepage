/** @type {ReadonlySet<string>} */
export const ACCEPTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export const ACCEPTED_IMAGE_ACCEPT_ATTR = 'image/jpeg,image/png,image/webp,image/gif';

/**
 * @param {FileList | File[] | null | undefined} fileList
 * @returns {File | null}
 */
export function pickAcceptedImageFile(fileList) {
  if (!fileList?.length) return null;
  const files = [...fileList];
  return files.find((file) => ACCEPTED_IMAGE_TYPES.has(file.type)) ?? null;
}

/**
 * @param {DataTransfer | null | undefined} data
 * @returns {File[]}
 */
export function getAcceptedImageFiles(data) {
  if (!data) return [];
  return [...data.files].filter((file) => ACCEPTED_IMAGE_TYPES.has(file.type));
}
