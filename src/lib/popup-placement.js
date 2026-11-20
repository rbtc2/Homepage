/** 팝업 9그리드 위치·오프셋 공유 상수/기하 */

export const OFFSET_LIMIT = 800;

export const POSITION_OPTIONS = [
  { value: 'top-left', label: '좌상단' },
  { value: 'top-center', label: '상단 중앙' },
  { value: 'top-right', label: '우상단' },
  { value: 'middle-left', label: '좌측 중앙' },
  { value: 'center', label: '정중앙' },
  { value: 'middle-right', label: '우측 중앙' },
  { value: 'bottom-left', label: '좌하단' },
  { value: 'bottom-center', label: '하단 중앙' },
  { value: 'bottom-right', label: '우하단' },
];

export const VALID_POSITIONS = new Set(POSITION_OPTIONS.map((o) => o.value));

export const POSITION_LABELS = Object.fromEntries(
  POSITION_OPTIONS.map((o) => [o.value, o.label]),
);

/** 미리보기·스냅 기준 가상 뷰포트 (CSS 앵커 inset 1.25rem ≈ 20px) */
export const PLACEMENT_VIEWPORT = { width: 1280, height: 720, inset: 20 };

export const DEFAULT_POPUP_SIZE = { width: 320, height: 400 };

export function clampOffset(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(-OFFSET_LIMIT, Math.min(OFFSET_LIMIT, Math.round(n)));
}

export function resolvePopupSize(widthPx, heightPx) {
  const width =
    widthPx === '' || widthPx == null || !Number.isFinite(Number(widthPx))
      ? DEFAULT_POPUP_SIZE.width
      : Math.max(120, Math.min(1200, Number(widthPx)));
  const height =
    heightPx === '' || heightPx == null || !Number.isFinite(Number(heightPx))
      ? DEFAULT_POPUP_SIZE.height
      : Math.max(80, Math.min(900, Number(heightPx)));
  return { width, height };
}

/**
 * 앵커별 기본 카드 중심점 (오프셋 0, 뷰포트 좌표).
 */
export function getDefaultCenter(position, size, viewport = PLACEMENT_VIEWPORT) {
  const { width: vw, height: vh, inset: I } = viewport;
  const { width: W, height: H } = size;
  const cxLeft = I + W / 2;
  const cxMid = vw / 2;
  const cxRight = vw - I - W / 2;
  const cyTop = I + H / 2;
  const cyMid = vh / 2;
  const cyBottom = vh - I - H / 2;

  switch (position) {
    case 'top-left':
      return { x: cxLeft, y: cyTop };
    case 'top-center':
      return { x: cxMid, y: cyTop };
    case 'top-right':
      return { x: cxRight, y: cyTop };
    case 'middle-left':
      return { x: cxLeft, y: cyMid };
    case 'middle-right':
      return { x: cxRight, y: cyMid };
    case 'bottom-left':
      return { x: cxLeft, y: cyBottom };
    case 'bottom-center':
      return { x: cxMid, y: cyBottom };
    case 'bottom-right':
      return { x: cxRight, y: cyBottom };
    case 'center':
    default:
      return { x: cxMid, y: cyMid };
  }
}

export function getCardCenter(position, offsetX, offsetY, size, viewport = PLACEMENT_VIEWPORT) {
  const base = getDefaultCenter(position, size, viewport);
  return {
    x: base.x + (Number(offsetX) || 0),
    y: base.y + (Number(offsetY) || 0),
  };
}

export function getCardRect(position, offsetX, offsetY, size, viewport = PLACEMENT_VIEWPORT) {
  const center = getCardCenter(position, offsetX, offsetY, size, viewport);
  return {
    left: center.x - size.width / 2,
    top: center.y - size.height / 2,
    width: size.width,
    height: size.height,
  };
}

export function rectsOverlap(a, b, gap = 8) {
  return !(
    a.left + a.width + gap <= b.left ||
    b.left + b.width + gap <= a.left ||
    a.top + a.height + gap <= b.top ||
    b.top + b.height + gap <= a.top
  );
}

/**
 * 카드 중심점에서 가장 가까운 앵커로 스냅하고 잔여를 오프셋으로 반환.
 */
export function snapCenterToPlacement(center, size, viewport = PLACEMENT_VIEWPORT) {
  let best = 'center';
  let bestDist = Infinity;

  for (const { value } of POSITION_OPTIONS) {
    const d = getDefaultCenter(value, size, viewport);
    const dist = (center.x - d.x) ** 2 + (center.y - d.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = value;
    }
  }

  const base = getDefaultCenter(best, size, viewport);
  return {
    position: best,
    offsetX: clampOffset(center.x - base.x),
    offsetY: clampOffset(center.y - base.y),
  };
}
