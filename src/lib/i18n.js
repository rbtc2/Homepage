export const LOCALES = ['ko', 'en'];

export const NAV_ITEMS = [
  {
    id: 'about',
    label: { ko: '단체 소개', en: 'About' },
    children: [
      { href: '/about', label: { ko: '소개', en: 'About' } },
      { href: '/greeting', label: { ko: '인사말', en: 'Greeting' } },
      { href: '/history', label: { ko: '연혁', en: 'History' } },
      { href: '/people', label: { ko: '함께하는 사람들', en: 'People' } },
      { href: '/directions', enHref: '/en/contact', label: { ko: '오시는 길', en: 'Contact' } },
    ],
  },
  {
    id: 'work',
    label: { ko: '단체 사업', en: 'What we do' },
    children: [
      { href: '/projects', label: { ko: '진행사업', en: 'Ongoing projects' } },
    ],
  },
  {
    id: 'activity',
    label: { ko: '단체 활동', en: 'Activities' },
    children: [
      { href: '/wr-news', label: { ko: 'WR뉴스', en: 'WR News' } },
      { href: '/press', label: { ko: '언론보도', en: 'Press' } },
    ],
  },
  {
    id: 'support',
    label: { ko: '단체 후원', en: 'Support' },
    children: [
      { href: '/member', label: { ko: '회원가입', en: 'Membership' } },
      { href: '/dues', label: { ko: '회비납부', en: 'Dues' } },
    ],
  },
  {
    id: 'community',
    label: { ko: '커뮤니티', en: 'Community' },
    children: [
      { href: '/notices', label: { ko: '공지사항', en: 'Notices' } },
      { href: '/disclosures', label: { ko: '공시자료', en: 'Disclosures' } },
      { href: '/archive', label: { ko: '자료실', en: 'Archive' } },
      { href: '/gallery', label: { ko: '포토갤러리', en: 'Gallery' } },
    ],
  },
];

export const HEADER_UI = {
  ko: {
    homeAria: '홈으로 이동',
    navAria: '주 메뉴',
    submenuSuffix: '하위 메뉴',
    admin: '관리자 페이지',
    logout: '로그아웃',
    login: '로그인',
    loginAria: '로그인 창 열기',
    logoutAria: '로그아웃',
    langAria: '영문 사이트로 이동',
    langLabel: 'ENG',
  },
  en: {
    homeAria: 'Go to home',
    navAria: 'Primary menu',
    submenuSuffix: 'submenu',
    admin: 'Admin',
    logout: 'Log out',
    login: 'Log in',
    loginAria: 'Open login dialog',
    logoutAria: 'Log out',
    langAria: 'Go to Korean site',
    langLabel: 'KOR',
  },
};

export const FOOTER_UI = {
  ko: {
    office: '사무실',
    representative: '대표자',
    phone: '대표 전화',
    fax: '팩스',
    snsGroup: '인스타그램/페이스북',
    instagram: '인스타그램',
    facebook: '페이스북',
    instagramAria: '인스타그램 링크',
    facebookAria: '페이스북 링크',
  },
  en: {
    office: 'Office',
    representative: 'Representative',
    phone: 'Phone',
    fax: 'Fax',
    snsGroup: 'Instagram and Facebook',
    instagram: 'Instagram',
    facebook: 'Facebook',
    instagramAria: 'Instagram (opens in a new tab)',
    facebookAria: 'Facebook (opens in a new tab)',
  },
};

export const EN_OFFICE_ADDRESS =
  '602-A23, 6F, Baekam Building, 150 Jungdae-ro, Songpa-gu, Seoul, Republic of Korea';

const KO_TO_EN_SPECIAL = {
  '/directions': '/en/contact',
};

const EN_TO_KO_SPECIAL = {
  '/en/contact': '/directions',
};

export function isEnPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/');
}

export function hrefForNavItem(item, locale) {
  if (!item?.href || item.href === '#') return '#';
  if (locale !== 'en') return item.href;
  if (item.enHref) return item.enHref;
  return `/en${item.href}`;
}

export function homeHref(locale) {
  return locale === 'en' ? '/en' : '/';
}

export function toEnPath(pathname) {
  const path = (pathname || '/').split('?')[0] || '/';
  if (isEnPath(path)) return path;
  if (KO_TO_EN_SPECIAL[path]) return KO_TO_EN_SPECIAL[path];
  return path === '/' ? '/en' : `/en${path}`;
}

export function toKoPath(pathname) {
  const path = (pathname || '/').split('?')[0] || '/';
  if (EN_TO_KO_SPECIAL[path]) return EN_TO_KO_SPECIAL[path];
  if (path === '/en') return '/';
  if (path.startsWith('/en/')) return path.slice(3) || '/';
  return path;
}

export function localePath(pathname, locale) {
  return locale === 'en' ? toEnPath(pathname) : toKoPath(pathname);
}
