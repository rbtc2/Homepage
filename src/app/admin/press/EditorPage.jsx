'use client';

import PressEditor from '@/components/press/PressEditor';
import { createPress, updatePress } from './actions';

export default function EditorPage({ post }) {
  const handleSave = async (payload) => {
    if (post) {
      await updatePress(post.id, payload);
    } else {
      await createPress(payload);
    }
  };

  return (
    <PressEditor
      post={post}
      backHref="/admin/press"
      editTitle="언론보도 수정"
      newTitle="언론보도 등록"
      onSave={handleSave}
    />
  );
}
