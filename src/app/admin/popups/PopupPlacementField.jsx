'use client';

import { useEffect, useRef, useState } from 'react';
import {
  OFFSET_LIMIT,
  PLACEMENT_VIEWPORT,
  POSITION_OPTIONS,
  clampOffset,
  getCardCenter,
  getCardRect,
  getDefaultCenter,
  rectsOverlap,
  resolvePopupSize,
  snapCenterToPlacement,
} from '@/lib/popup-placement';

/**
 * 9그리드 픽커 + 드래그 미리보기 + 오프셋 입력.
 */
export default function PopupPlacementField({
  position,
  offsetX,
  offsetY,
  widthPx,
  heightPx,
  imageUrl,
  title,
  siblingPopups = [],
  onPlacementChange,
}) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const onPlacementChangeRef = useRef(onPlacementChange);
  onPlacementChangeRef.current = onPlacementChange;

  const [dragging, setDragging] = useState(false);
  const [draftCenter, setDraftCenter] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const size = resolvePopupSize(widthPx, heightPx);
  const sizeW = size.width;
  const sizeH = size.height;
  const scale =
    stageSize.width > 0 ? stageSize.width / PLACEMENT_VIEWPORT.width : 1;

  const liveCenter =
    draftCenter ??
    getCardCenter(position, offsetX, offsetY, size, PLACEMENT_VIEWPORT);

  const highlight =
    draftCenter != null
      ? snapCenterToPlacement(draftCenter, size, PLACEMENT_VIEWPORT).position
      : position;

  const currentRect = {
    left: liveCenter.x - size.width / 2,
    top: liveCenter.y - size.height / 2,
    width: size.width,
    height: size.height,
  };

  const overlapping = siblingPopups.some((sib) => {
    const sibSize = resolvePopupSize(sib.widthPx, sib.heightPx);
    const sibRect = getCardRect(
      sib.position,
      sib.offsetX,
      sib.offsetY,
      sibSize,
      PLACEMENT_VIEWPORT,
    );
    return rectsOverlap(currentRect, sibRect);
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setStageSize((prev) => {
        if (prev.width === rect.width && prev.height === rect.height) return prev;
        return { width: rect.width, height: rect.height };
      });
    };

    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      const stage = stageRef.current;
      const drag = dragRef.current;
      if (!stage || !drag) return;
      const rect = stage.getBoundingClientRect();
      const localX = (e.clientX - rect.left) / (rect.width / PLACEMENT_VIEWPORT.width);
      const localY = (e.clientY - rect.top) / (rect.height / PLACEMENT_VIEWPORT.height);
      const next = {
        x: localX - drag.offsetX,
        y: localY - drag.offsetY,
      };
      drag.lastCenter = next;
      setDraftCenter(next);
    };

    const onUp = () => {
      const center = dragRef.current?.lastCenter;
      dragRef.current = null;
      setDragging(false);
      setDraftCenter(null);
      if (center) {
        onPlacementChangeRef.current(
          snapCenterToPlacement(center, { width: sizeW, height: sizeH }, PLACEMENT_VIEWPORT),
        );
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, sizeW, sizeH]);

  const startDrag = (e) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const localX = (e.clientX - rect.left) / (rect.width / PLACEMENT_VIEWPORT.width);
    const localY = (e.clientY - rect.top) / (rect.height / PLACEMENT_VIEWPORT.height);
    const center = getCardCenter(position, offsetX, offsetY, size, PLACEMENT_VIEWPORT);
    dragRef.current = {
      offsetX: localX - center.x,
      offsetY: localY - center.y,
      lastCenter: center,
    };
    setDraftCenter(center);
    setDragging(true);
  };

  const selectGrid = (value) => {
    onPlacementChange({ position: value, offsetX: 0, offsetY: 0 });
  };

  const handleOffsetInput = (axis, raw) => {
    const next = clampOffset(raw);
    onPlacementChange({
      position,
      offsetX: axis === 'x' ? next : clampOffset(offsetX),
      offsetY: axis === 'y' ? next : clampOffset(offsetY),
    });
  };

  const cardStyle = {
    left: `${currentRect.left * scale}px`,
    top: `${currentRect.top * scale}px`,
    width: `${size.width * scale}px`,
    height: `${size.height * scale}px`,
  };

  return (
    <fieldset className="an-field an-popup-place">
      <legend className="an-field__label">팝업 위치</legend>

      <div
        ref={stageRef}
        className={`an-popup-place__stage${dragging ? ' an-popup-place__stage--dragging' : ''}`}
        aria-label="팝업 위치 미리보기"
      >
        <div className="an-popup-place__grid-lines" aria-hidden="true" />

        {POSITION_OPTIONS.map((opt) => {
          const c = getDefaultCenter(opt.value, size, PLACEMENT_VIEWPORT);
          return (
            <span
              key={opt.value}
              className={`an-popup-place__anchor${highlight === opt.value ? ' an-popup-place__anchor--on' : ''}`}
              style={{ left: `${c.x * scale}px`, top: `${c.y * scale}px` }}
            />
          );
        })}

        {siblingPopups.map((sib) => {
          const sibSize = resolvePopupSize(sib.widthPx, sib.heightPx);
          const rect = getCardRect(
            sib.position,
            sib.offsetX,
            sib.offsetY,
            sibSize,
            PLACEMENT_VIEWPORT,
          );
          return (
            <div
              key={sib.id}
              className="an-popup-place__sibling"
              style={{
                left: `${rect.left * scale}px`,
                top: `${rect.top * scale}px`,
                width: `${rect.width * scale}px`,
                height: `${rect.height * scale}px`,
              }}
              title={sib.title}
            >
              <span className="an-popup-place__sibling-label">{sib.title || '다른 팝업'}</span>
            </div>
          );
        })}

        <div
          className={`an-popup-place__card${dragging ? ' an-popup-place__card--dragging' : ''}`}
          style={cardStyle}
          onPointerDown={startDrag}
          role="button"
          tabIndex={0}
          aria-label="드래그하여 위치 조정"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="an-popup-place__card-img" draggable={false} />
          ) : (
            <span className="an-popup-place__card-fallback">{title || '팝업'}</span>
          )}
        </div>
      </div>

      {overlapping ? (
        <p className="an-field__help an-popup-place__warn" role="status">
          다른 활성 팝업과 겹칩니다. 저장은 가능하지만 배치를 조정하는 것을 권장합니다.
        </p>
      ) : (
        <p className="an-field__help">카드를 드래그하거나 아래 그리드로 위치를 정하세요.</p>
      )}

      <div className="an-popup-place__grid" role="group" aria-label="9그리드 위치">
        {POSITION_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`an-popup-place__cell${position === opt.value ? ' an-popup-place__cell--on' : ''}`}
            onClick={() => selectGrid(opt.value)}
            aria-pressed={position === opt.value}
            title={opt.label}
          >
            <span className="an-popup-place__cell-dot" aria-hidden="true" />
            <span className="an-popup-place__cell-label">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="an-field-row">
        <div className="an-field">
          <label className="an-field__label" htmlFor="popup-offset-x">
            가로 보정 (오른쪽 +, px)
          </label>
          <input
            id="popup-offset-x"
            name="offsetX"
            type="number"
            min={-OFFSET_LIMIT}
            max={OFFSET_LIMIT}
            className="an-field__input"
            value={offsetX}
            onChange={(e) => handleOffsetInput('x', e.target.value)}
          />
        </div>
        <div className="an-field">
          <label className="an-field__label" htmlFor="popup-offset-y">
            세로 보정 (아래 +, px)
          </label>
          <input
            id="popup-offset-y"
            name="offsetY"
            type="number"
            min={-OFFSET_LIMIT}
            max={OFFSET_LIMIT}
            className="an-field__input"
            value={offsetY}
            onChange={(e) => handleOffsetInput('y', e.target.value)}
          />
        </div>
      </div>
    </fieldset>
  );
}
