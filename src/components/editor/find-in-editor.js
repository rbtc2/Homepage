/**
 * 문서 텍스트에서 검색어 위치를 모읍니다.
 *
 * @param {import('@tiptap/pm/model').Node} doc
 * @param {string} query
 * @returns {{ from: number, to: number }[]}
 */
export function findTextMatches(doc, query) {
  const needle = query.trim();
  if (!needle) return [];
  const q = needle.toLowerCase();
  const matches = [];

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    const hay = node.text.toLowerCase();
    let from = 0;
    while (from < hay.length) {
      const idx = hay.indexOf(q, from);
      if (idx === -1) break;
      matches.push({ from: pos + idx, to: pos + idx + needle.length });
      from = idx + Math.max(1, needle.length);
    }
  });

  return matches;
}

/**
 * @param {{ from: number, to: number }[]} matches
 * @param {number} caret
 * @param {number} currentIndex
 * @param {1 | -1} dir
 */
export function nextMatchIndex(matches, caret, currentIndex, dir) {
  if (matches.length === 0) return -1;
  if (dir > 0) {
    const found = matches.findIndex((m) => m.from >= caret);
    if (found >= 0) return found;
    return 0;
  }
  for (let i = matches.length - 1; i >= 0; i--) {
    if (matches[i].from < caret) return i;
  }
  return matches.length - 1;
}
