'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TextSelection } from '@tiptap/pm/state';
import { findTextMatches, nextMatchIndex } from './find-in-editor';

export default function FindReplaceBar({ editor, open, replaceMode, onClose }) {
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [index, setIndex] = useState(-1);
  const findRef = useRef(null);

  const matches = editor && query.trim()
    ? findTextMatches(editor.state.doc, query)
    : [];

  const selectMatch = useCallback(
    (i) => {
      if (!editor || i < 0 || i >= matches.length) return;
      const { from, to } = matches[i];
      const { state, view } = editor;
      view.dispatch(state.tr.setSelection(TextSelection.create(state.doc, from, to)).scrollIntoView());
      setIndex(i);
    },
    [editor, matches]
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => findRef.current?.focus(), 40);
    } else {
      setQuery('');
      setReplacement('');
      setIndex(-1);
    }
  }, [open]);

  const findNext = useCallback(
    (dir) => {
      if (!editor || matches.length === 0) {
        setIndex(-1);
        return;
      }
      const caret = editor.state.selection.from;
      const next = nextMatchIndex(matches, caret + (dir > 0 ? 1 : 0), index, dir);
      selectMatch(next);
    },
    [editor, matches, index, selectMatch]
  );

  const replaceOne = useCallback(() => {
    if (!editor || index < 0 || index >= matches.length) {
      findNext(1);
      return;
    }
    const { from, to } = matches[index];
    editor.chain().focus().insertContentAt({ from, to }, replacement).run();
    setTimeout(() => findNext(1), 0);
  }, [editor, index, matches, replacement, findNext]);

  const replaceAll = useCallback(() => {
    if (!editor || matches.length === 0) return;
    const { state, view } = editor;
    let tr = state.tr;
    for (let i = matches.length - 1; i >= 0; i--) {
      const { from, to } = matches[i];
      tr = tr.insertText(replacement, from, to);
    }
    view.dispatch(tr);
    setIndex(-1);
  }, [editor, matches, replacement]);

  if (!open) return null;

  return (
    <div className="ep-find" role="search" aria-label="찾기">
      <input
        ref={findRef}
        type="text"
        className="ep-find__input"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIndex(-1);
        }}
        placeholder="찾을 내용"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            findNext(e.shiftKey ? -1 : 1);
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
          }
        }}
      />
      {replaceMode ? (
        <input
          type="text"
          className="ep-find__input"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          placeholder="바꿀 내용"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              replaceOne();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              onClose();
            }
          }}
        />
      ) : null}
      <span className="ep-find__count">
        {query.trim()
          ? matches.length === 0
            ? '없음'
            : `${index < 0 ? '-' : index + 1} / ${matches.length}`
          : ''}
      </span>
      <button type="button" className="ep-find__btn" onClick={() => findNext(-1)}>
        이전
      </button>
      <button type="button" className="ep-find__btn" onClick={() => findNext(1)}>
        다음
      </button>
      {replaceMode ? (
        <>
          <button type="button" className="ep-find__btn" onClick={replaceOne}>
            바꾸기
          </button>
          <button type="button" className="ep-find__btn" onClick={replaceAll}>
            모두 바꾸기
          </button>
        </>
      ) : null}
      <button type="button" className="ep-find__btn ep-find__btn--close" onClick={onClose}>
        닫기
      </button>
    </div>
  );
}
