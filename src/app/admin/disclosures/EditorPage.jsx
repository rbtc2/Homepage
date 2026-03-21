'use client';

import RichEditor from '@/components/editor/RichEditor';
import { createDisclosure, updateDisclosure } from './actions';

export default function EditorPage({ disclosure }) {
  const handleSave = async ({ title, content, createdAt }) => {
    if (disclosure) {
      await updateDisclosure(disclosure.id, { title, content, createdAt });
    } else {
      await createDisclosure({ title, content, createdAt });
    }
  };

  return (
    <RichEditor
      post={disclosure}
      backHref="/admin/disclosures"
      editTitle="공시자료 수정"
      newTitle="새 공시자료 작성"
      onSave={handleSave}
    />
  );
}
