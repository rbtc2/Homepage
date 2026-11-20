/** @typedef {'original' | 'high' | 'medium' | 'size'} ImageQualityPreset */

/**
 * 웹 사진 품질 기준 (SSIMULACRA2 ≈ 70–80):
 * - AVIF quality ≈ 50–55 → 고품질, ≈ 65–70 → 매우 고품질
 * - WebP quality ≈ 75 → 고품질, ≈ 87 → 매우 고품질
 * - canvasQuality: 브라우저 폴백용 0–1
 * @see https://imageloadlab.com/jpeg-webp-avif-quality-equivalence/
 *
 * @type {Record<Exclude<ImageQualityPreset, 'original'>, {
 *   maxWidth: number;
 *   maxHeight: number;
 *   avifQuality: number;
 *   webpQuality: number;
 *   canvasQuality: number;
 * }>}
 */
export const IMAGE_QUALITY_PRESETS = {
  // 매우 고품질: 세부·피부·그라데이션 우선
  high: {
    maxWidth: 2560,
    maxHeight: 2560,
    avifQuality: 68,
    webpQuality: 88,
    canvasQuality: 0.92,
  },
  // 기본: 웹용 고품질 (용량↓ + 체감 화질 유지)
  medium: {
    maxWidth: 2048,
    maxHeight: 2048,
    avifQuality: 58,
    webpQuality: 82,
    canvasQuality: 0.88,
  },
  // 용량 우선이어도 “웹 고품질” 하한선 유지 (구 0.78 WebP보다 체감 화질↑)
  size: {
    maxWidth: 1600,
    maxHeight: 1600,
    avifQuality: 52,
    webpQuality: 76,
    canvasQuality: 0.84,
  },
};

export const IMAGE_QUALITY_OPTIONS = [
  { id: 'original', label: '원본 그대로' },
  { id: 'high', label: '품질 높음' },
  { id: 'medium', label: '보통' },
  { id: 'size', label: '용량 우선' },
];

/**
 * @param {File | { type?: string }} file
 * @returns {boolean}
 */
export function isOptimizableImage(file) {
  return file?.type !== 'image/gif';
}
