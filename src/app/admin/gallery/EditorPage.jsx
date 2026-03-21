'use client';

import RichEditor from '@/components/editor/RichEditor';
import { createGalleryPost, updateGalleryPost } from './actions';

export default function GalleryEditorPage({ post }) {
  const handleSave = async ({ title, content, createdAt, coverImage }) => {
    if (post) {
      await updateGalleryPost(post.id, { title, content, coverImage, createdAt });
    } else {
      await createGalleryPost({ title, content, coverImage, createdAt });
    }
  };

  return (
    <RichEditor
      post={post}
      backHref="/admin/gallery"
      editTitle="갤러리 게시물 수정"
      newTitle="새 갤러리 게시물 작성"
      showCoverImage
      onSave={handleSave}
    />
  );
}
