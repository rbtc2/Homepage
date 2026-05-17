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
  releaseImageNodeSelection,
  updateEditorImageAt,
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
  return node?.attrs ?? {};
}

/**
 * 본문 이미지 선택 시 플로팅 툴바 — 너비(px), 정렬, 좌우 여백 조절.
 */
export default function ImageToolbar({ editor }) {
  const menuRef = useRef(null);
  const savedImagePosRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(null);
  const [maxNaturalWidth, setMaxNaturalWidth] = useState(MAX_WIDTH);
  const [widthDraft, setWidthDraft] = useState('');
  const [marginLeftDraft, setMarginLeftDraft] = useState(0);
  const [marginRightDraft, setMarginRightDraft] = useState(0);

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

  const syncDraftsFromNode = useCallback(() => {
    const pos = savedImagePosRef.current;
    const attrs = getImageAttrs(editor, pos);
    const w = clampWidth(attrs.width) ?? getEditorImageDisplayWidth(editor, pos);
    setWidthDraft(w != null ? String(w) : '');
    setMarginLeftDraft(clampMargin(attrs.marginLeft));
    setMarginRightDraft(clampMargin(attrs.marginRight));
    refreshWidth();
  }, [editor, refreshWidth]);

  const patchAtSaved = useCallback(
    (attrs) => {
      const pos = savedImagePosRef.current;
      if (pos == null || !editor) return;
      updateEditorImageAt(editor, pos, attrs);
      refreshWidth();
    },
    [editor, refreshWidth]
  );

  const prepareInputEdit = useCallback(() => {
    const pos = savedImagePosRef.current;
    if (pos == null || !editor) return;
    releaseImageNodeSelection(editor, pos);
    syncDraftsFromNode();
  }, [editor, syncDraftsFromNode]);

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
        syncDraftsFromNode();
      }
    };

    onSelectionUpdate();
    editor.on('selectionUpdate', onSelectionUpdate);
    editor.on('transaction', refreshWidth);

    return () => {
      editor.off('selectionUpdate', onSelectionUpdate);
      editor.off('transaction', refreshWidth);
    };
  }, [editor, refreshWidth, syncDraftsFromNode]);

  useEffect(() => {
    if (!editor) return undefined;

    const blockEditorKeys = (e) => {
      if (!menuRef.current?.contains(document.activeElement)) return;
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    document.addEventListener('keydown', blockEditorKeys, true);
    document.addEventListener('keypress', blockEditorKeys, true);
    document.addEventListener('keyup', blockEditorKeys, true);

    return () => {
      document.removeEventListener('keydown', blockEditorKeys, true);
      document.removeEventListener('keypress', blockEditorKeys, true);
      document.removeEventListener('keyup', blockEditorKeys, true);
    };
  }, [editor]);

  const applyWidthDraft = useCallback(() => {
    const next = clampWidth(widthDraft);
    if (next == null) {
      syncDraftsFromNode();
      return;
    }
    patchAtSaved({ width: next });
    setWidthDraft(String(next));
    setDisplayWidth(next);
  }, [widthDraft, patchAtSaved, syncDraftsFromNode]);

  const applyMarginDraft = useCallback(
    (side) => {
      if (side === 'left') {
        patchAtSaved({ marginLeft: marginLeftDraft });
      } else {
        patchAtSaved({ marginRight: marginRightDraft });
      }
    },
    [marginLeftDraft, marginRightDraft, patchAtSaved]
  );

  const handleDelete = useCallback(() => {
    const pos = savedImagePosRef.current;
    if (pos == null || !editor) return;
    const { state, view } = editor;
    const sel = NodeSelection.create(state.doc, pos);
    view.dispatch(state.tr.setSelection(sel));
    editor.chain().focus().deleteSelection().run();
    savedImagePosRef.current = null;
  }, [editor]);

  if (!editor) return null;

  const savedPos = savedImagePosRef.current;
  const attrs = getImageAttrs(editor, savedPos);
  const align = normalizeAlign(attrs.align);
  const widthMax = Math.max(MIN_WIDTH, maxNaturalWidth);

  const handleInputKeyDown = (e, apply) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      apply();
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      syncDraftsFromNode();
      e.currentTarget.blur();
    }
  };

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
        onPointerDownCapture={(e) => e.stopPropagation()}
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
            value={widthDraft}
            onFocus={prepareInputEdit}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setWidthDraft(e.target.value)}
            onBlur={applyWidthDraft}
            onKeyDown={(e) => handleInputKeyDown(e, applyWidthDraft)}
            aria-label="이미지 너비 px (비율 유지)"
            title="Enter로 적용 · 비율은 자동 유지"
          />
          <span className="ep-img-toolbar__unit">px</span>
        </label>
        <span className="ep-img-bubble__sep" aria-hidden="true" />
        <ToolbarBtn
          title="왼쪽 정렬"
          active={align === 'left'}
          onClick={() => patchAtSaved({ align: 'left' })}
        >
          {icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          title="가운데 정렬"
          active={align === 'center'}
          onClick={() => patchAtSaved({ align: 'center' })}
        >
          {icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          title="오른쪽 정렬"
          active={align === 'right'}
          onClick={() => patchAtSaved({ align: 'right' })}
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
            value={marginLeftDraft}
            onFocus={prepareInputEdit}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setMarginLeftDraft(clampMargin(e.target.value))}
            onBlur={() => applyMarginDraft('left')}
            onKeyDown={(e) => handleInputKeyDown(e, () => applyMarginDraft('left'))}
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
            value={marginRightDraft}
            onFocus={prepareInputEdit}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setMarginRightDraft(clampMargin(e.target.value))}
            onBlur={() => applyMarginDraft('right')}
            onKeyDown={(e) => handleInputKeyDown(e, () => applyMarginDraft('right'))}
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
