'use client';

import RichEditor from '@/components/editor/RichEditor';
import { assertActionOk } from '@/lib/assert-action-ok';
import { updateGalleryEnglish } from './actions';

export default function GalleryEnglishEditorPage({ post }) {
  const hasEnglish = Boolean(post.hasEnglish);
  const editorPost = {
    id: post.id,
    title: String(post.titleEn ?? '').trim() ? post.titleEn : post.title,
    content: String(post.contentEn ?? '').trim() ? post.contentEn : post.content,
  };

  const handleSave = async ({ title, content }) => {
    const result = await updateGalleryEnglish(post.id, { title, content });
    assertActionOk(result);
  };

  return (
    <RichEditor
      post={editorPost}
      contentType=""
      backHref="/admin/gallery"
      editTitle={hasEnglish ? '포토갤러리 영문 수정' : '포토갤러리 영문 작성'}
      newTitle="포토갤러리 영문 작성"
      showMetaDate={false}
      titlePlaceholder="English title"
      saveLabel="영문 저장"
      notice={
        <>
          <p>커버 이미지·작성일·비밀글 설정은 한국어 글과 같습니다. 제목과 본문만 영어로 작성하세요.</p>
          <p>처음이면 한국어 본문을 복사해 두었습니다. 사진과 표는 그대로 두시고 문장만 바꾸면 됩니다.</p>
        </>
      }
      onSave={handleSave}
    />
  );
}
