'use client';

import RichEditor from '@/components/editor/RichEditor';
import { createNotice, updateNotice } from './actions';

export default function EditorPage({ notice }) {
  const handleSave = async ({ title, content, createdAt, isPinned }) => {
    if (notice) {
      await updateNotice(notice.id, { title, content, isPinned, createdAt });
    } else {
      await createNotice({ title, content, isPinned, createdAt });
    }
  };

  return (
    <RichEditor
      post={notice}
      backHref="/admin/notices"
      editTitle="게시물 수정"
      newTitle="새 게시물 작성"
      showPinToggle
      onSave={handleSave}
    />
  );
}
