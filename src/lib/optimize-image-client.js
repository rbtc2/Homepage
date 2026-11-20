import {
  IMAGE_QUALITY_OPTIONS,
  IMAGE_QUALITY_PRESETS,
  isOptimizableImage,
} from '@/lib/optimize-image-presets';

export { IMAGE_QUALITY_OPTIONS, IMAGE_QUALITY_PRESETS, isOptimizableImage };

/** @typedef {import('@/lib/optimize-image-presets').ImageQualityPreset} ImageQualityPreset */

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
 * 서버(sharp) 사용 불가 시 브라우저 폴백.
 *
 * @param {File} file
 * @param {Exclude<ImageQualityPreset, 'original'>} presetKey
 */
async function optimizeImageFileClientFallback(file, presetKey) {
  const preset = IMAGE_QUALITY_PRESETS[presetKey];
  const originalBytes = file.size;
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
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToWebpBlob(canvas, preset.canvasQuality);
  if (blob.size >= originalBytes) {
    return { file, originalBytes, resultBytes: originalBytes, skipped: true };
  }

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

/**
 * @param {File} file
 * @param {Exclude<ImageQualityPreset, 'original'>} presetKey
 */
async function optimizeImageFileViaApi(file, presetKey) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('preset', presetKey);

  const response = await fetch('/api/admin/optimize-image', {
    method: 'POST',
    body: fd,
    credentials: 'same-origin',
  });

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || '이미지 최적화에 실패했습니다.');
    }
    return {
      file,
      originalBytes: data.originalBytes ?? file.size,
      resultBytes: data.resultBytes ?? file.size,
      skipped: true,
      format: 'original',
    };
  }

  if (!response.ok) {
    throw new Error('이미지 최적화에 실패했습니다.');
  }

  const blob = await response.blob();
  const originalBytes = Number(response.headers.get('x-original-bytes') || file.size);
  const resultBytes = Number(response.headers.get('x-result-bytes') || blob.size);
  const formatHeader = response.headers.get('x-format') || 'avif';
  const encodedName = response.headers.get('x-file-name');
  const fileName = encodedName
    ? decodeURIComponent(encodedName)
    : `${file.name.replace(/\.[^.]+$/, '') || 'image'}.${formatHeader}`;

  const optimized = new File([blob], fileName, {
    type: blob.type || (formatHeader === 'webp' ? 'image/webp' : 'image/avif'),
    lastModified: Date.now(),
  });

  return {
    file: optimized,
    originalBytes,
    resultBytes,
    skipped: false,
    format: formatHeader === 'webp' ? 'webp' : 'avif',
  };
}

/**
 * @param {File} file
 * @param {ImageQualityPreset} presetKey
 * @returns {Promise<{
 *   file: File;
 *   originalBytes: number;
 *   resultBytes: number;
 *   skipped: boolean;
 *   format?: 'avif' | 'webp' | 'original';
 * }>}
 */
export async function optimizeImageFile(file, presetKey) {
  const originalBytes = file.size;

  if (presetKey === 'original' || !isOptimizableImage(file)) {
    return { file, originalBytes, resultBytes: file.size, skipped: true, format: 'original' };
  }

  if (!IMAGE_QUALITY_PRESETS[presetKey]) {
    return { file, originalBytes, resultBytes: file.size, skipped: true, format: 'original' };
  }

  try {
    return await optimizeImageFileViaApi(file, presetKey);
  } catch {
    const fallback = await optimizeImageFileClientFallback(file, presetKey);
    return { ...fallback, format: fallback.skipped ? 'original' : 'webp' };
  }
}
