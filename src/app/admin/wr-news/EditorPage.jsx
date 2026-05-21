'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createWrNewsPost, updateWrNewsPost } from './actions';

export default function WrNewsEditorPage({ post }) {
  const handleSave = async ({ title, content, createdAt, coverImage }) => {
    const result = post
      ? await updateWrNewsPost(post.id, { title, content, coverImage, createdAt })
      : await createWrNewsPost({ title, content, coverImage, createdAt });
    assertActionOk(result);
  };

  return (
    <RichEditor
      post={post}
      contentType="wr_news"
      backHref="/admin/wr-news"
      editTitle="WR뉴스 게시물 수정"
      newTitle="새 WR뉴스 게시물 작성"
      showCoverImage
      coverUploadFolder="wr-news"
      onSave={handleSave}
    />
  );
}
