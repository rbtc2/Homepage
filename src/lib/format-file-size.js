/**
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * @param {number} originalBytes
 * @param {number} resultBytes
 * @returns {number} 0–100
 */
export function formatReductionPercent(originalBytes, resultBytes) {
  if (originalBytes <= 0) return 0;
  return Math.max(0, Math.round((1 - resultBytes / originalBytes) * 100));
}
