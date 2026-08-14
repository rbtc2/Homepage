'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createNotice, updateNotice } from './actions';

export default function EditorPage({ notice }) {
  const handleSave = async ({
    title,
    content,
    createdAt,
    isPinned,
    isSecret,
    secretPassword,
  }) => {
    const result = notice
      ? await updateNotice(notice.id, {
          title,
          content,
          isPinned,
          createdAt,
          isSecret,
          secretPassword,
        })
      : await createNotice({ title, content, isPinned, createdAt, isSecret, secretPassword });
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
      onSave={handleSave}
    />
  );
}
