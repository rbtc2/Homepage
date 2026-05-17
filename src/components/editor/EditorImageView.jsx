'use client';

import { useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { clampMargin, clampWidth, MAX_WIDTH, MIN_WIDTH, normalizeAlign } from './EditorImage';

const ALIGN_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

function getMaxResizeWidth(img, marginLeft, marginRight) {
  const natural = img.naturalWidth > 0 ? img.naturalWidth : MAX_WIDTH;
  const content = img.closest('.ep-content');
  const containerCap = content ? content.clientWidth - marginLeft - marginRight : MAX_WIDTH;
  return Math.min(MAX_WIDTH, natural, Math.max(MIN_WIDTH, containerCap));
}

/**
 * 에디터 전용 이미지 NodeView — 선택 시 모서리 핸들로 드래그 리사이즈.
 */
export default function EditorImageView({ node, updateAttributes, selected }) {
  const imgRef = useRef(null);

  const align = normalizeAlign(node.attrs.align);
  const marginLeft = clampMargin(node.attrs.marginLeft);
  const marginRight = clampMargin(node.attrs.marginRight);
  const width = clampWidth(node.attrs.width);

  const startResize = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const img = imgRef.current;
      if (!img) return;

      const startX = e.clientX;
      const startWidth = img.getBoundingClientRect().width;
      const maxW = getMaxResizeWidth(img, marginLeft, marginRight);

      const onPointerMove = (ev) => {
        const delta = ev.clientX - startX;
        const next = Math.min(maxW, Math.max(MIN_WIDTH, Math.round(startWidth + delta)));
        updateAttributes({ width: next });
      };

      const onPointerUp = () => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    },
    [marginLeft, marginRight, updateAttributes]
  );

  const wrapStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: ALIGN_JUSTIFY[align] ?? 'center',
    paddingLeft: `${marginLeft}px`,
    paddingRight: `${marginRight}px`,
    ['--ep-img-ml']: `${marginLeft}px`,
    ['--ep-img-mr']: `${marginRight}px`,
  };

  const imgStyle = width ? { width: `${width}px`, height: 'auto' } : undefined;

  return (
    <NodeViewWrapper
      as="div"
      className={`ep-img-block ep-img-block--${align} ep-img-node-view`}
      data-align={align}
      data-margin-left={String(marginLeft)}
      data-margin-right={String(marginRight)}
      style={wrapStyle}
    >
      <div className="ep-img-node-view__frame">
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          title={node.attrs.title || undefined}
          className="ep-img-block__img"
          style={imgStyle}
          data-width={width ? String(width) : undefined}
          draggable={false}
        />
        {selected ? (
          <button
            type="button"
            className="ep-img-resize-handle"
            aria-label="드래그하여 이미지 크기 조절"
            onPointerDown={startResize}
          >
            <span className="ep-img-resize-handle__dots" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </NodeViewWrapper>
  );
}
