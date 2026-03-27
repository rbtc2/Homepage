'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTION_LABELS = {
  '/admin/notices':     '공지사항 관리',
  '/admin/archive':     '자료실 관리',
  '/admin/disclosures': '공시자료 관리',
  '/admin/popups':      '팝업 관리',
  '/admin/gallery':     '포토갤러리 관리',
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
