'use client';

import { useCallback, useEffect, useState } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  clampMargin,
  clampWidth,
  getEditorImageDisplayWidth,
  getSelectedEditorImageEl,
  MAX_WIDTH,
  MIN_WIDTH,
  normalizeAlign,
} from './EditorImage';
import icons from './icons';
import { ToolbarBtn } from './ToolbarBtn';

/**
 * 본문 이미지 선택 시 플로팅 툴바 — 너비(px), 정렬, 좌우 여백 조절.
 */
export default function ImageToolbar({ editor }) {
  const [displayWidth, setDisplayWidth] = useState(null);
  const [maxNaturalWidth, setMaxNaturalWidth] = useState(MAX_WIDTH);

  const refreshWidth = useCallback(() => {
    if (!editor?.isActive('editorImage')) {
      setDisplayWidth(null);
      return;
    }
    setDisplayWidth(getEditorImageDisplayWidth(editor));
    const img = getSelectedEditorImageEl(editor);
    if (img?.naturalWidth > 0) {
      setMaxNaturalWidth(Math.min(MAX_WIDTH, img.naturalWidth));
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return undefined;
    refreshWidth();
    editor.on('selectionUpdate', refreshWidth);
    editor.on('transaction', refreshWidth);
    const img = getSelectedEditorImageEl(editor);
    const onLoad = () => refreshWidth();
    if (img && !img.complete) img.addEventListener('load', onLoad);
    return () => {
      editor.off('selectionUpdate', refreshWidth);
      editor.off('transaction', refreshWidth);
      img?.removeEventListener('load', onLoad);
    };
  }, [editor, refreshWidth]);

  const patch = useCallback(
    (next) => {
      editor?.chain().focus().updateEditorImage(next).run();
    },
    [editor]
  );

  const handleMargin = useCallback(
    (side, raw) => {
      const value = clampMargin(raw);
      patch(side === 'left' ? { marginLeft: value } : { marginRight: value });
    },
    [patch]
  );

  const handleWidthChange = useCallback(
    (raw) => {
      const next = clampWidth(raw);
      if (next == null) return;
      patch({ width: next });
      setDisplayWidth(next);
    },
    [patch]
  );

  if (!editor) return null;

  const attrs = editor.getAttributes('editorImage');
  const align = normalizeAlign(attrs.align);
  const marginLeft = clampMargin(attrs.marginLeft);
  const marginRight = clampMargin(attrs.marginRight);
  const storedWidth = clampWidth(attrs.width);
  const widthValue = storedWidth ?? displayWidth ?? '';
  const widthMax = Math.max(MIN_WIDTH, maxNaturalWidth);

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="editorImageBubble"
      shouldShow={({ editor: ed }) => ed.isActive('editorImage')}
      className="ep-img-bubble"
      tippyOptions={{ duration: 100, maxWidth: 'none' }}
    >
      <div className="ep-img-bubble__inner" role="toolbar" aria-label="이미지 서식">
        <label className="ep-img-toolbar__field ep-img-toolbar__field--width">
          <span className="ep-img-toolbar__field-label">
            {displayWidth != null ? `현재 ${displayWidth}px` : '너비'}
          </span>
          <input
            type="number"
            className="ep-img-toolbar__input ep-img-toolbar__input--wide"
            min={MIN_WIDTH}
            max={widthMax}
            step={1}
            value={widthValue}
            onChange={(e) => handleWidthChange(e.target.value)}
            aria-label="이미지 너비 px (비율 유지)"
            title="숫자를 줄이면 가로·세로 비율이 유지된 채 크기가 조절됩니다"
          />
          <span className="ep-img-toolbar__unit">px</span>
        </label>
        <span className="ep-img-bubble__sep" aria-hidden="true" />
        <ToolbarBtn
          title="왼쪽 정렬"
          active={align === 'left'}
          onClick={() => patch({ align: 'left' })}
        >
          {icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          title="가운데 정렬"
          active={align === 'center'}
          onClick={() => patch({ align: 'center' })}
        >
          {icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          title="오른쪽 정렬"
          active={align === 'right'}
          onClick={() => patch({ align: 'right' })}
        >
          {icons.alignRight}
        </ToolbarBtn>
        <span className="ep-img-bubble__sep" aria-hidden="true" />
        <label className="ep-img-toolbar__field">
          <span className="ep-img-toolbar__field-label">좌</span>
          <input
            type="number"
            className="ep-img-toolbar__input"
            min={0}
            max={400}
            step={1}
            value={marginLeft}
            onChange={(e) => handleMargin('left', e.target.value)}
            aria-label="왼쪽 여백 px"
          />
          <span className="ep-img-toolbar__unit">px</span>
        </label>
        <label className="ep-img-toolbar__field">
          <span className="ep-img-toolbar__field-label">우</span>
          <input
            type="number"
            className="ep-img-toolbar__input"
            min={0}
            max={400}
            step={1}
            value={marginRight}
            onChange={(e) => handleMargin('right', e.target.value)}
            aria-label="오른쪽 여백 px"
          />
          <span className="ep-img-toolbar__unit">px</span>
        </label>
        <span className="ep-img-bubble__sep" aria-hidden="true" />
        <ToolbarBtn
          title="이미지 삭제"
          onClick={() => editor.chain().focus().deleteSelection().run()}
        >
          {icons.deleteImage}
        </ToolbarBtn>
      </div>
    </BubbleMenu>
  );
}
