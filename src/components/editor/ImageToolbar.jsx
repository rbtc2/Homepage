'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { NodeSelection } from '@tiptap/pm/state';
import {
  clampMargin,
  clampWidth,
  getEditorImageDisplayWidth,
  getEditorImageElAtPos,
  MAX_WIDTH,
  MIN_WIDTH,
  normalizeAlign,
} from './EditorImage';
import icons from './icons';
import { ToolbarBtn } from './ToolbarBtn';

function getImageNodeAt(editor, pos) {
  if (pos == null || !editor) return null;
  const node = editor.state.doc.nodeAt(pos);
  return node?.type.name === 'editorImage' ? node : null;
}

function getImageAttrs(editor, savedPos) {
  const node = getImageNodeAt(editor, savedPos);
  return node?.attrs ?? editor?.getAttributes('editorImage') ?? {};
}

/**
 * 본문 이미지 선택 시 플로팅 툴바 — 너비(px), 정렬, 좌우 여백 조절.
 */
export default function ImageToolbar({ editor }) {
  const menuRef = useRef(null);
  const savedImagePosRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(null);
  const [maxNaturalWidth, setMaxNaturalWidth] = useState(MAX_WIDTH);

  const isMenuActive = useCallback(() => {
    const el = menuRef.current;
    return Boolean(el && el.contains(document.activeElement));
  }, []);

  const refreshWidth = useCallback(() => {
    const pos = savedImagePosRef.current;
    const node = getImageNodeAt(editor, pos);
    if (!editor || !node) {
      if (!isMenuActive()) setDisplayWidth(null);
      return;
    }
    setDisplayWidth(getEditorImageDisplayWidth(editor, pos));
    const img = getEditorImageElAtPos(editor, pos);
    if (img?.naturalWidth > 0) {
      setMaxNaturalWidth(Math.min(MAX_WIDTH, img.naturalWidth));
    }
  }, [editor, isMenuActive]);

  const restoreImageSelection = useCallback(() => {
    const pos = savedImagePosRef.current;
    if (pos == null || !editor || !getImageNodeAt(editor, pos)) return false;
    const { state, view } = editor;
    const sel = NodeSelection.create(state.doc, pos);
    if (state.selection instanceof NodeSelection && state.selection.eq(sel)) {
      return true;
    }
    view.dispatch(state.tr.setSelection(sel).scrollIntoView());
    return true;
  }, [editor]);

  const restoreAndPatch = useCallback(
    (attrs) => {
      if (!editor) return;
      restoreImageSelection();
      editor.chain().focus().updateEditorImage(attrs).run();
    },
    [editor, restoreImageSelection]
  );

  const shouldShowBubble = useCallback(
    ({ editor: ed }) => {
      if (ed.isActive('editorImage')) {
        savedImagePosRef.current = ed.state.selection.from;
        return true;
      }
      if (isMenuActive()) return true;
      const pos = savedImagePosRef.current;
      return pos != null && Boolean(getImageNodeAt(ed, pos));
    },
    [isMenuActive]
  );

  useEffect(() => {
    if (!editor) return undefined;

    const onSelectionUpdate = () => {
      if (editor.isActive('editorImage')) {
        savedImagePosRef.current = editor.state.selection.from;
      }
      refreshWidth();
    };

    refreshWidth();
    editor.on('selectionUpdate', onSelectionUpdate);
    editor.on('transaction', refreshWidth);

    return () => {
      editor.off('selectionUpdate', onSelectionUpdate);
      editor.off('transaction', refreshWidth);
    };
  }, [editor, refreshWidth]);

  useEffect(() => {
    if (!editor) return undefined;
    const pos = savedImagePosRef.current;
    const img = getEditorImageElAtPos(editor, pos);
    const onLoad = () => refreshWidth();
    if (img && !img.complete) img.addEventListener('load', onLoad);
    return () => img?.removeEventListener('load', onLoad);
  }, [editor, refreshWidth, displayWidth]);

  const handleMargin = useCallback(
    (side, raw) => {
      const value = clampMargin(raw);
      restoreAndPatch(side === 'left' ? { marginLeft: value } : { marginRight: value });
    },
    [restoreAndPatch]
  );

  const handleWidthChange = useCallback(
    (raw) => {
      const next = clampWidth(raw);
      if (next == null) return;
      restoreAndPatch({ width: next });
      setDisplayWidth(next);
    },
    [restoreAndPatch]
  );

  const handleMenuKeyDown = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleMenuPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      restoreImageSelection();
      if (e.target instanceof HTMLInputElement) {
        return;
      }
      e.preventDefault();
    },
    [restoreImageSelection]
  );

  const handleDelete = useCallback(() => {
    if (!editor) return;
    restoreImageSelection();
    editor.chain().focus().deleteSelection().run();
    savedImagePosRef.current = null;
  }, [editor, restoreImageSelection]);

  if (!editor) return null;

  const savedPos = savedImagePosRef.current;
  const attrs = getImageAttrs(editor, savedPos);
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
      shouldShow={shouldShowBubble}
      updateDelay={0}
      className="ep-img-bubble"
      tippyOptions={{ duration: 100, maxWidth: 'none', interactive: true }}
    >
      <div
        ref={menuRef}
        className="ep-img-bubble__inner"
        role="toolbar"
        aria-label="이미지 서식"
        onKeyDown={handleMenuKeyDown}
        onKeyDownCapture={handleMenuKeyDown}
        onPointerDown={handleMenuPointerDown}
      >
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
          onClick={() => restoreAndPatch({ align: 'left' })}
        >
          {icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          title="가운데 정렬"
          active={align === 'center'}
          onClick={() => restoreAndPatch({ align: 'center' })}
        >
          {icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          title="오른쪽 정렬"
          active={align === 'right'}
          onClick={() => restoreAndPatch({ align: 'right' })}
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
        <ToolbarBtn title="이미지 삭제" onClick={handleDelete}>
          {icons.deleteImage}
        </ToolbarBtn>
      </div>
    </BubbleMenu>
  );
}
