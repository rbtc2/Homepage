export const HISTORY_UI = {
  ko: {
    sectionLabel: '단체 소개',
    title: '연혁',
    emptyTitle: '등록된 연혁이 없습니다.',
    emptyDesc: '곧 단체의 발자취를 이곳에 기록합니다.',
    yearAria: (year) => `${year}년 연혁`,
    monthAria: (month) => `${month}월`,
  },
  en: {
    sectionLabel: 'About',
    title: 'History',
    emptyTitle: 'No history entries yet.',
    emptyDesc: "We will record the organization's path here soon.",
    yearAria: (year) => `History in ${year}`,
    monthAria: (month) => `Month ${month}`,
  },
};

export function historyUi(locale = 'ko') {
  return HISTORY_UI[locale] ?? HISTORY_UI.ko;
}
