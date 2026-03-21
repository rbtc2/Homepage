'use client';

import RichEditor from '@/components/editor/RichEditor';
import { createArchive, updateArchive } from './actions';

export default function EditorPage({ archive }) {
  const handleSave = async ({ title, content, createdAt }) => {
    if (archive) {
      await updateArchive(archive.id, { title, content, createdAt });
    } else {
      await createArchive({ title, content, createdAt });
    }
  };

  return (
    <RichEditor
      post={archive}
      backHref="/admin/archive"
      editTitle="자료 수정"
      newTitle="새 자료 작성"
      onSave={handleSave}
    />
  );
}
