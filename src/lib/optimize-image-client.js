/** @typedef {'original' | 'high' | 'medium' | 'size'} ImageQualityPreset */

/** @type {Record<Exclude<ImageQualityPreset, 'original'>, { maxWidth: number; maxHeight: number; quality: number }>} */
export const IMAGE_QUALITY_PRESETS = {
  high: { maxWidth: 1920, maxHeight: 1920, quality: 0.92 },
  medium: { maxWidth: 1600, maxHeight: 1600, quality: 0.85 },
  size: { maxWidth: 1280, maxHeight: 1280, quality: 0.78 },
};

export const IMAGE_QUALITY_OPTIONS = [
  { id: 'original', label: '원본 그대로' },
  { id: 'high', label: '품질 높음' },
  { id: 'medium', label: '보통' },
  { id: 'size', label: '용량 우선' },
];

/**
 * @param {File} file
 * @returns {boolean}
 */
export function isOptimizableImage(file) {
  return file.type !== 'image/gif';
}

/**
 * @param {number} width
 * @param {number} height
 * @param {number} maxWidth
 * @param {number} maxHeight
 */
function scaleDimensions(width, height, maxWidth, maxHeight) {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

/**
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 불러오지 못했습니다.'));
    };
    img.src = url;
  });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
function canvasToWebpBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('이미지 변환에 실패했습니다.'));
      },
      'image/webp',
      quality
    );
  });
}

/**
 * @param {File} file
 * @param {ImageQualityPreset} presetKey
 * @returns {Promise<{ file: File; originalBytes: number; resultBytes: number; skipped: boolean }>}
 */
export async function optimizeImageFile(file, presetKey) {
  const originalBytes = file.size;

  if (presetKey === 'original' || !isOptimizableImage(file)) {
    return { file, originalBytes, resultBytes: file.size, skipped: true };
  }

  const preset = IMAGE_QUALITY_PRESETS[presetKey];
  if (!preset) {
    return { file, originalBytes, resultBytes: file.size, skipped: true };
  }

  const img = await loadImageFromFile(file);
  const { width, height } = scaleDimensions(
    img.naturalWidth,
    img.naturalHeight,
    preset.maxWidth,
    preset.maxHeight
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('캔버스를 사용할 수 없습니다.');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToWebpBlob(canvas, preset.quality);
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  const optimized = new File([blob], `${baseName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  });

  return {
    file: optimized,
    originalBytes,
    resultBytes: optimized.size,
    skipped: false,
  };
}
