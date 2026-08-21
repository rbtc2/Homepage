import { isOptimizableImage, optimizeImageFile } from '@/lib/optimize-image-client';
import { uploadEditorImageFile } from '@/lib/upload-editor-image-client';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * @param {DataTransfer | null | undefined} data
 * @returns {File[]}
 */
export function getClipboardImageFiles(data) {
  if (!data) return [];
  return [...data.files].filter((file) => IMAGE_TYPES.has(file.type));
}

/**
 * 드롭·붙여넣기 이미지를 보통 품질로 올려 커서(또는 지정 위치)에 삽입합니다.
 *
 * @param {import('@tiptap/pm/view').EditorView} view
 * @param {File[]} files
 * @param {number} [pos]
 */
export async function insertDroppedImages(view, files, pos) {
  const type = view.state.schema.nodes.editorImage;
  if (!type || files.length === 0) return;

  let insertPos = pos ?? view.state.selection.from;

  for (const file of files) {
    try {
      const toUpload = isOptimizableImage(file)
        ? (await optimizeImageFile(file, 'medium')).file
        : file;
      const res = await uploadEditorImageFile(toUpload, 'editor-content');
      if (!res.ok) {
        alert(res.message || '이미지 업로드에 실패했습니다.');
        continue;
      }
      const node = type.create({
        src: res.url,
        alt: '',
        caption: '',
        align: 'center',
        marginLeft: 0,
        marginRight: 0,
      });
      const { state } = view;
      const safePos = Math.min(insertPos, state.doc.content.size);
      view.dispatch(state.tr.replaceWith(safePos, safePos, node));
      insertPos = safePos + node.nodeSize;
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  }
}
