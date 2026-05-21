'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { createGalleryPost, updateGalleryPost } from './actions';

export default function GalleryEditorPage({ post }) {
  const handleSave = async ({ title, content, createdAt, coverImage }) => {
    const result = post
      ? await updateGalleryPost(post.id, { title, content, coverImage, createdAt })
      : await createGalleryPost({ title, content, coverImage, createdAt });
    assertActionOk(result);
  };

  return (
    <RichEditor
      post={post}
      contentType="gallery"
      backHref="/admin/gallery"
      editTitle="갤러리 게시물 수정"
      newTitle="새 갤러리 게시물 작성"
      showCoverImage
      coverUploadFolder="gallery"
      onSave={handleSave}
    />
  );
}
