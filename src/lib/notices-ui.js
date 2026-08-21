export const NOTICES_UI = {
  ko: {
    sectionLabel: '커뮤니티',
    title: '공지사항',
    searchAria: '공지사항 검색',
    searchPlaceholder: '제목 또는 내용으로 검색',
    searchSubmit: '검색',
    emptyText: '공지사항을',
    pin: '공지',
    home: '홈',
    crumbCurrent: '상세',
    author: '작성자',
    viewsByline: (n) => `조회\u00a0${n.toLocaleString()}`,
    next: '다음 글',
    prev: '이전 글',
    backToList: '목록으로',
    siblingAria: '이전·다음 글',
    crumbAria: '위치',
  },
  en: {
    sectionLabel: 'Community',
    title: 'Notices',
    searchAria: 'Search notices',
    searchPlaceholder: 'Search titles or content',
    searchSubmit: 'Search',
    emptyText: 'notices',
    pin: 'Notice',
    home: 'Home',
    crumbCurrent: 'Article',
    author: 'Author',
    viewsByline: (n) => `${n.toLocaleString()} views`,
    next: 'Next',
    prev: 'Previous',
    backToList: 'Back to list',
    siblingAria: 'Previous and next posts',
    crumbAria: 'Breadcrumb',
  },
};

export function noticesUi(locale = 'ko') {
  return NOTICES_UI[locale] ?? NOTICES_UI.ko;
}
