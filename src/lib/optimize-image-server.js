import sharp from 'sharp';
import { IMAGE_QUALITY_PRESETS } from '@/lib/optimize-image-presets';

/**
 * @typedef {{
 *   buffer: Buffer;
 *   mimeType: string;
 *   extension: string;
 *   originalBytes: number;
 *   resultBytes: number;
 *   width: number;
 *   height: number;
 *   format: 'avif' | 'webp';
 *   skipped: false;
 * }} OptimizedImageResult
 *
 * @typedef {{
 *   buffer: Buffer;
 *   mimeType: string;
 *   extension: string;
 *   originalBytes: number;
 *   resultBytes: number;
 *   skipped: true;
 * }} SkippedImageResult
 */

/**
 * sharp(libvips) + AVIF(tune iq)로 리사이즈·인코딩.
 * AVIF 실패 시 libwebp WebP로 폴백.
 *
 * @param {Buffer} input
 * @param {Exclude<import('@/lib/optimize-image-presets').ImageQualityPreset, 'original'>} presetKey
 * @returns {Promise<OptimizedImageResult | SkippedImageResult>}
 */
export async function optimizeImageBuffer(input, presetKey) {
  const preset = IMAGE_QUALITY_PRESETS[presetKey];
  if (!preset) {
    return {
      buffer: input,
      mimeType: 'application/octet-stream',
      extension: 'bin',
      originalBytes: input.length,
      resultBytes: input.length,
      skipped: true,
    };
  }

  const originalBytes = input.length;
  const base = sharp(input, { failOn: 'none', animated: false }).rotate();

  const resized = base.resize({
    width: preset.maxWidth,
    height: preset.maxHeight,
    fit: 'inside',
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  });

  /** @type {{ data: Buffer; info: sharp.OutputInfo } | null} */
  let encoded = null;
  /** @type {'avif' | 'webp'} */
  let format = 'avif';

  try {
    encoded = await resized
      .clone()
      .avif({
        quality: preset.avifQuality,
        // 인코드 시간 vs 용량: 5가 실무 균형점
        effort: 5,
        // 피부·헤어·미세 질감 보존 (sharp 0.35+ / libaom IQ)
        tune: 'iq',
      })
      .toBuffer({ resolveWithObject: true });
    format = 'avif';
  } catch {
    encoded = null;
  }

  if (!encoded) {
    encoded = await resized
      .webp({
        quality: preset.webpQuality,
        effort: 5,
        smartSubsample: true,
      })
      .toBuffer({ resolveWithObject: true });
    format = 'webp';
  }

  const resultBytes = encoded.data.length;

  // 용량이 줄지 않으면 원본 유지 (이미 최적화된 파일 등)
  if (resultBytes >= originalBytes) {
    return {
      buffer: input,
      mimeType: 'application/octet-stream',
      extension: 'bin',
      originalBytes,
      resultBytes: originalBytes,
      skipped: true,
    };
  }

  return {
    buffer: encoded.data,
    mimeType: format === 'avif' ? 'image/avif' : 'image/webp',
    extension: format,
    originalBytes,
    resultBytes,
    width: encoded.info.width,
    height: encoded.info.height,
    format,
    skipped: false,
  };
}
