'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createNotice, updateNotice } from './actions';

export default function EditorPage({ notice }) {
  const handleSave = async ({ title, content, createdAt, isPinned }) => {
    const result = notice
      ? await updateNotice(notice.id, { title, content, isPinned, createdAt })
      : await createNotice({ title, content, isPinned, createdAt });
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
      onSave={handleSave}
    />
  );
}
