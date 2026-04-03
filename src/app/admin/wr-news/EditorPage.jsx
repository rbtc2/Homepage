'use client';

import RichEditor from '@/components/editor/RichEditor';
import { createWrNewsPost, updateWrNewsPost } from './actions';

export default function WrNewsEditorPage({ post }) {
  const handleSave = async ({ title, content, createdAt, coverImage }) => {
    if (post) {
      await updateWrNewsPost(post.id, { title, content, coverImage, createdAt });
    } else {
      await createWrNewsPost({ title, content, coverImage, createdAt });
    }
  };

  return (
    <RichEditor
      post={post}
      backHref="/admin/wr-news"
      editTitle="WR뉴스 게시물 수정"
      newTitle="새 WR뉴스 게시물 작성"
      showCoverImage
      onSave={handleSave}
    />
  );
}
