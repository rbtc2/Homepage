'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 관리자 상단 경로(관리자 / ○○ 관리) 표시용.
 * 새 `/admin/...` 콘텐츠 섹션을 만들 때마다 반드시 여기에 키를 추가하세요.
 * 미등록이면 이 컴포넌트가 null을 반환해 상단 네비가 통째로 사라집니다.
 * 사이드바(NAV_ITEMS)와 함께 갱신하는 것을 권장합니다.
 */
const SECTION_LABELS = {
  '/admin/notices':     '공지사항 관리',
  '/admin/archive':     '자료실 관리',
  '/admin/disclosures': '공시자료 관리',
  '/admin/popups':      '팝업 관리',
  '/admin/gallery':     '포토갤러리 관리',
  '/admin/press':       '언론보도 관리',
  '/admin/wr-news':     'WR뉴스 관리',
};

const SUB_LABELS = {
  '/new':  '새 게시물',
  '/edit': '게시물 수정',
};

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  if (pathname === '/admin') {
    return (
      <nav className="adm-breadcrumb" aria-label="경로">
        <div className="adm-breadcrumb__inner">
          <span className="adm-breadcrumb__current">대시보드</span>
        </div>
      </nav>
    );
  }

  const sectionHref = Object.keys(SECTION_LABELS).find(
    (key) => pathname === key || pathname.startsWith(key + '/')
  );
  if (!sectionHref) return null;

  const sectionLabel = SECTION_LABELS[sectionHref];

  const subLabel = Object.entries(SUB_LABELS).find(([suffix]) =>
    pathname.endsWith(suffix)
  )?.[1];

  return (
    <nav className="adm-breadcrumb" aria-label="경로">
      <div className="adm-breadcrumb__inner">
        <Link href="/admin" className="adm-breadcrumb__item">관리자</Link>
        <span className="adm-breadcrumb__sep" aria-hidden="true">/</span>
        {subLabel ? (
          <>
            <Link href={sectionHref} className="adm-breadcrumb__item">{sectionLabel}</Link>
            <span className="adm-breadcrumb__sep" aria-hidden="true">/</span>
            <span className="adm-breadcrumb__current">{subLabel}</span>
          </>
        ) : (
          <span className="adm-breadcrumb__current">{sectionLabel}</span>
        )}
      </div>
    </nav>
  );
}
