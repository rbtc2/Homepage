'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createDisclosure, updateDisclosure } from './actions';

export default function EditorPage({ disclosure }) {
  const handleSave = async ({ title, content, createdAt }) => {
    const result = disclosure
      ? await updateDisclosure(disclosure.id, { title, content, createdAt })
      : await createDisclosure({ title, content, createdAt });
    assertActionOk(result);
  };

  return (
    <RichEditor
      post={disclosure}
      contentType="disclosures"
      backHref="/admin/disclosures"
      editTitle="공시자료 수정"
      newTitle="새 공시자료 작성"
      onSave={handleSave}
    />
  );
}
