'use client';

import RichEditor from '@/components/editor/RichEditor';
import { createArchive, updateArchive } from './actions';

export default function EditorPage({ archive }) {
  const handleSave = async ({ title, content, createdAt, isSecret, secretPassword }) => {
    if (archive) {
      await updateArchive(archive.id, { title, content, createdAt, isSecret, secretPassword });
    } else {
      await createArchive({ title, content, createdAt, isSecret, secretPassword });
    }
  };

  return (
    <RichEditor
      post={archive}
      backHref="/admin/archive"
      editTitle="자료 수정"
      newTitle="새 자료 작성"
      showSecretToggle
      onSave={handleSave}
    />
  );
}
