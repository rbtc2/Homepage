'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createArchive, updateArchive } from './actions';

export default function EditorPage({ archive, categoryState }) {
  const categoryOptions =
    categoryState?.enabled && categoryState.categories.length > 0
      ? categoryState.categories
      : null;

  const handleSave = async ({ title, content, createdAt, isSecret, secretPassword, categoryId }) => {
    const payload = { title, content, createdAt, isSecret, secretPassword };
    if (categoryOptions) payload.categoryId = categoryId ?? null;
    const result = archive
      ? await updateArchive(archive.id, payload)
      : await createArchive(payload);
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
      categoryOptions={categoryOptions}
      onSave={handleSave}
    />
  );
}
