/** RichEditor 게시판별 content_type (admin_drafts.content_type) */
export const ADMIN_DRAFT_CONTENT_TYPES = [
  'notices',
  'wr_news',
  'gallery',
  'archive',
  'disclosures',
];

export const ADMIN_DRAFT_LABELS = {
  notices: '공지사항',
  wr_news: 'WR뉴스',
  gallery: '갤러리',
  archive: '자료실',
  disclosures: '공시자료',
};

export function isAdminDraftContentType(value) {
  return ADMIN_DRAFT_CONTENT_TYPES.includes(value);
}

export function formatDraftUpdatedAt(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function draftDisplayTitle(title) {
  const t = (title ?? '').trim();
  return t || '(제목 없음)';
}
