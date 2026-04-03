'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/admin',
    label: '대시보드',
    exact: true,
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/admin/popups',
    label: '팝업 관리',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 20h8M12 18v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/notices',
    label: '공지사항',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/disclosures',
    label: '공시자료',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/archive',
    label: '자료실',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 7h18M3 12h18M3 17h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/gallery',
    label: '포토갤러리',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 17l5-4 3 3 3-2 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/admin/press',
    label: '언론보도',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7h8M8 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

function SidebarContent({ pathname, onLogout, onNavClick }) {
  return (
    <>
      <div className="adm-sidebar__brand">WR 관리자</div>
      <nav className="adm-sidebar__nav" aria-label="관리자 메뉴">
        <span className="adm-sidebar__section-label">콘텐츠</span>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-sidebar__item${isActive ? ' adm-sidebar__item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={onNavClick}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="adm-sidebar__footer">
        <Link href="/" className="adm-sidebar__footer-link">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          사이트 보기
        </Link>
        <button
          type="button"
          className="adm-sidebar__footer-link"
          onClick={onLogout}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          로그아웃
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="adm-sidebar" aria-label="관리자 사이드바">
        <SidebarContent pathname={pathname} onLogout={handleLogout} onNavClick={null} />
      </aside>

      {/* Mobile top bar */}
      <div className="adm-topbar">
        <button
          className="adm-topbar__hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={drawerOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="adm-topbar__brand">WR 관리자</span>
        <button
          type="button"
          className="adm-sidebar__footer-link"
          style={{ padding: '0.3rem 0.75rem', width: 'auto' }}
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="adm-drawer-overlay"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="adm-sidebar adm-sidebar--drawer" aria-label="관리자 메뉴 (모바일)">
            <SidebarContent
              pathname={pathname}
              onLogout={handleLogout}
              onNavClick={() => setDrawerOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  );
}
