'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createArchive, updateArchive } from './actions';

export default function EditorPage({ archive }) {
  const handleSave = async ({ title, content, createdAt, isSecret, secretPassword }) => {
    const result = archive
      ? await updateArchive(archive.id, { title, content, createdAt, isSecret, secretPassword })
      : await createArchive({ title, content, createdAt, isSecret, secretPassword });
    assertActionOk(result);
  };

  return (
    <RichEditor
      post={archive}
      contentType="archive"
      backHref="/admin/archive"
      editTitle="자료 수정"
      newTitle="새 자료 작성"
      showSecretToggle
      onSave={handleSave}
    />
  );
}
