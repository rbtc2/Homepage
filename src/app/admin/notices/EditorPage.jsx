'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createNotice, updateNotice } from './actions';

export default function EditorPage({ notice, categoryState }) {
  const categoryOptions =
    categoryState?.enabled && categoryState.categories.length > 0
      ? categoryState.categories
      : null;

  const handleSave = async ({
    title,
    content,
    createdAt,
    isPinned,
    isSecret,
    secretPassword,
    categoryId,
  }) => {
    const payload = { title, content, isPinned, createdAt, isSecret, secretPassword };
    if (categoryOptions) payload.categoryId = categoryId ?? null;
    const result = notice
      ? await updateNotice(notice.id, payload)
      : await createNotice(payload);
    assertActionOk(result);
  };

  return (
    <RichEditor
      post={notice}
      contentType="notices"
      backHref="/admin/notices"
      editTitle="게시물 수정"
      newTitle="새 게시물 작성"
      showPinToggle
      showSecretToggle
      categoryOptions={categoryOptions}
      onSave={handleSave}
    />
  );
}
