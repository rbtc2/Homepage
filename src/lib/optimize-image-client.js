import { optimizeEditorImage } from '@/app/admin/optimize-image-action';
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
 * lanczos급은 아니지만 high-quality 리샘플 + WebP로 최소한의 품질을 유지.
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
 * @param {string} base64
 * @param {string} mimeType
 * @param {string} fileName
 * @returns {File}
 */
function fileFromBase64(base64, mimeType, fileName) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], fileName, {
    type: mimeType,
    lastModified: Date.now(),
  });
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
    const fd = new FormData();
    fd.append('file', file);
    fd.append('preset', presetKey);
    const res = await optimizeEditorImage(fd);

    if (!res.ok) {
      // 세션/서버 오류 시 브라우저 폴백으로 업로드는 가능하게
      const fallback = await optimizeImageFileClientFallback(file, presetKey);
      return { ...fallback, format: fallback.skipped ? 'original' : 'webp' };
    }

    if (res.skipped || !res.base64) {
      return {
        file,
        originalBytes: res.originalBytes,
        resultBytes: res.resultBytes,
        skipped: true,
        format: 'original',
      };
    }

    const optimized = fileFromBase64(res.base64, res.mimeType, res.fileName);
    return {
      file: optimized,
      originalBytes: res.originalBytes,
      resultBytes: res.resultBytes,
      skipped: false,
      format: res.format === 'avif' || res.format === 'webp' ? res.format : 'webp',
    };
  } catch {
    const fallback = await optimizeImageFileClientFallback(file, presetKey);
    return { ...fallback, format: fallback.skipped ? 'original' : 'webp' };
  }
}
