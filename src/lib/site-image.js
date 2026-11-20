/**
 * 공개 페이지 next/image 표시 품질.
 * 업로드 최적화와 별개로, next/image 기본 q=75 재인코딩·과소 sizes가
 * 레티나에서 선명도를 깎지 않도록 상세/목록 기준을 통일합니다.
 */
export const SITE_IMAGE = {
  /** 상세 커버 — 재인코딩 손실 최소화 */
  detailQuality: 90,
  /** 목록·히어로 썸네일 */
  thumbQuality: 85,
  /** 상세 커버 intrinsic width (레티나 ≈ 1180×2 여유) */
  detailWidth: 2400,
  detailHeight: 1800,
  /** 레이아웃 --max-w(1180px)에 맞춤 */
  detailSizes: '(max-width: 768px) 100vw, 1180px',
};
