'use client';

import { useCallback } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { clampMargin, normalizeAlign } from './EditorImage';
import icons from './icons';
import { ToolbarBtn } from './ToolbarBtn';

/**
 * 본문 이미지 선택 시 표시되는 플로팅 툴바 — 정렬·좌우 여백(px) 조절.
 */
export default function ImageToolbar({ editor }) {
  if (!editor) return null;

  const attrs = editor.getAttributes('editorImage');
  const align = normalizeAlign(attrs.align);
  const marginLeft = clampMargin(attrs.marginLeft);
  const marginRight = clampMargin(attrs.marginRight);

  const patch = useCallback(
    (next) => {
      editor.chain().focus().updateEditorImage(next).run();
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

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="editorImageBubble"
      shouldShow={({ editor: ed }) => ed.isActive('editorImage')}
      className="ep-img-bubble"
      tippyOptions={{ duration: 100, maxWidth: 'none' }}
    >
      <div className="ep-img-bubble__inner" role="toolbar" aria-label="이미지 서식">
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
