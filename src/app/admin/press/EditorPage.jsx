'use client';

import PressEditor from '@/components/press/PressEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createPress, updatePress } from './actions';

export default function EditorPage({ post }) {
  const handleSave = async (payload) => {
    const result = post ? await updatePress(post.id, payload) : await createPress(payload);
    assertActionOk(result);
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
