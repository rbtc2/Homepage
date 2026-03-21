# Admin Navigation Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the admin top-bar-only layout with a persistent left sidebar, add breadcrumb navigation, and convert the dashboard home from a 4-card nav menu to a real-data summary page.

**Architecture:** A `AdminSidebar` client component handles mobile drawer state and active-link detection via `usePathname`. A thin `AdminBreadcrumb` client component derives breadcrumb text from the current path. The server-side `layout.jsx` wraps both. The dashboard `page.jsx` is rewritten as a pure async Server Component.

**Tech Stack:** Next.js 14 App Router, React (Server + Client Components), Supabase (existing `getNotices` / `getArchives` / `getDisclosures` helpers), vanilla CSS (project convention — no Tailwind), `next/navigation` (`usePathname`, `useRouter`).

---

## Context: Existing File Patterns

- CSS lives in `src/app/styles/*.css`, imported in `src/app/globals.css`
- Admin CSS uses `adm-*` namespace (`admin-layout.css`) and `an-*` namespace (`admin-board.css`)
- Server Components fetch data directly; Client Components receive data as props
- `LogoutButton` at `src/components/LogoutButton.jsx` currently hardcodes `adm-header__logout` class in compact mode
- `getNotices()`, `getArchives()`, `getDisclosures()` each return `{ id, title, content, author, createdAt, views, ...extras }[]` sorted by `id DESC`
- No automated test suite — verification steps use linter + dev server visual check

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/app/styles/admin-layout.css` | Full rewrite: sidebar layout, breadcrumb, mobile drawer. Remove old header styles. |
| Create | `src/components/admin/AdminSidebar.jsx` | Client component: nav items, active state, mobile toggle (includes inline logout in mobile topbar) |
| Create | `src/components/admin/AdminBreadcrumb.jsx` | Client component: path → breadcrumb label mapping |
| Modify | `src/app/admin/layout.jsx` | Rewrite: server wrapper using AdminSidebar + AdminBreadcrumb |
| Create | `src/lib/dashboard.js` | `getRecentActivity()` — fetches last 5 posts across all 3 sections |
| Modify | `src/app/admin/page.jsx` | Rewrite: 4 stats cards (공지·자료·공시·활성팝업) + recent activity using dashboard lib |
| No change | `src/components/LogoutButton.jsx` | Sidebar uses its own logout button inline; LogoutButton is no longer used in admin |

---

## Task 1: Rewrite admin-layout.css

**Files:**
- Modify: `src/app/styles/admin-layout.css`

- [ ] **Step 1: Replace the file contents**

Replace the entire file with the following. This removes the old `adm-header` styles and adds sidebar, breadcrumb, and mobile drawer styles.

```css
/* ═══════════════════════════════════════════════════════════════
   관리자 레이아웃 (adm-*)
═══════════════════════════════════════════════════════════════ */

/* ── 전체 레이아웃 ─────────────────────────────────────────── */
.adm-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: var(--canvas);
}

.adm-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* ── 사이드바 ─────────────────────────────────────────────── */
.adm-sidebar {
  width: 180px;
  flex-shrink: 0;
  background: var(--ink);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.adm-sidebar__brand {
  padding: 1rem 1.125rem 0.875rem;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
}

.adm-sidebar__nav {
  flex: 1;
  padding: 0.625rem 0;
}

.adm-sidebar__section-label {
  display: block;
  padding: 0.5rem 1.125rem 0.3rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}

.adm-sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: background 0.13s var(--ease), color 0.13s var(--ease);
}

.adm-sidebar__item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
}

.adm-sidebar__item--active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-weight: 600;
  border-left-color: var(--brand-mid);
}

.adm-sidebar__icon {
  flex-shrink: 0;
  opacity: 0.85;
}

.adm-sidebar__item--active .adm-sidebar__icon {
  opacity: 1;
}

.adm-sidebar__footer {
  padding: 0.625rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
}

.adm-sidebar__footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.125rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: color 0.13s var(--ease);
  font: inherit;
  text-align: left;
}

.adm-sidebar__footer-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* ── 브레드크럼 바 ────────────────────────────────────────── */
.adm-breadcrumb {
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}

.adm-breadcrumb__inner {
  padding: 0.4375rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.adm-breadcrumb__item {
  font-size: 0.8125rem;
  color: var(--muted);
  text-decoration: none;
}

.adm-breadcrumb__item:hover {
  color: var(--ink);
}

.adm-breadcrumb__sep {
  font-size: 0.8125rem;
  color: var(--line);
  user-select: none;
}

.adm-breadcrumb__current {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink);
}

/* ── 관리자 메인 (기존 an-* 페이지들이 사용) ─────────────── */
.adm-main {
  flex: 1;
  padding: clamp(2rem, 5vw, 3.5rem) var(--pad-x);
}

.adm-main__inner {
  max-width: var(--max-w);
  margin: 0 auto;
}

.adm-main__hd {
  margin-bottom: 2rem;
}

.adm-main__title {
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin: 0 0 0.375rem;
}

.adm-main__sub {
  font-size: 0.9375rem;
  color: var(--muted);
  margin: 0;
}

/* ── 모바일 상단 바 ───────────────────────────────────────── */
.adm-topbar {
  display: none;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  height: 3rem;
  background: var(--ink);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
}

.adm-topbar__hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.adm-topbar__hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  transition: background 0.15s var(--ease);
}

.adm-topbar__hamburger:hover span {
  background: #fff;
}

.adm-topbar__brand {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

/* ── 모바일 드로어 오버레이 ───────────────────────────────── */
.adm-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 20, 36, 0.5);
  z-index: 299;
  animation: admFadeIn 0.15s ease;
}

@keyframes admFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.adm-sidebar--drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 300;
  animation: admSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes admSlideIn {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}

/* ── 반응형 ──────────────────────────────────────────────── */
@media (max-width: 768px) {
  .adm-layout {
    flex-direction: column;
  }

  .adm-sidebar {
    display: none;
  }

  .adm-sidebar--drawer {
    display: flex;
    width: 220px;
  }

  .adm-topbar {
    display: flex;
  }
}

@media (min-width: 769px) {
  .adm-drawer-overlay,
  .adm-topbar {
    display: none !important;
  }
}
```

- [ ] **Step 2: Check for linter errors**

Open `src/app/styles/admin-layout.css` in the IDE and confirm no linter errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/styles/admin-layout.css
git commit -m "style: rewrite admin-layout.css with sidebar, breadcrumb, mobile drawer"
```

---

## Task 2: Create AdminSidebar component

**Files:**
- Create: `src/components/admin/AdminSidebar.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
    href: '/admin/archive',
    label: '자료실',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 7h18M3 12h18M3 17h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
    href: '/admin/popups',
    label: '팝업 관리',
    icon: (
      <svg className="adm-sidebar__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 20h8M12 18v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function SidebarContent({ pathname, onLogout, onNavClick }) {
  return (
    <>
      <div className="adm-sidebar__brand">EJJ 관리자</div>
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

  // Close drawer on route change
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
        <span className="adm-topbar__brand">EJJ 관리자</span>
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
```

- [ ] **Step 2: Check linter**

Verify no linter errors on `src/components/admin/AdminSidebar.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminSidebar.jsx
git commit -m "feat: add AdminSidebar client component with mobile drawer"
```

---

## Task 3: Create AdminBreadcrumb component

**Files:**
- Create: `src/components/admin/AdminBreadcrumb.jsx`

- [ ] **Step 1: Create the component**

```jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Maps path prefixes to display labels
const SECTION_LABELS = {
  '/admin/notices':     '공지사항 관리',
  '/admin/archive':     '자료실 관리',
  '/admin/disclosures': '공시자료 관리',
  '/admin/popups':      '팝업 관리',
};

// Maps specific sub-path suffixes to labels (must end with these segments)
const SUB_LABELS = {
  '/new':  '새 게시물',
  '/edit': '게시물 수정',
};

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  // Dashboard root — single crumb only
  if (pathname === '/admin') {
    return (
      <nav className="adm-breadcrumb" aria-label="경로">
        <div className="adm-breadcrumb__inner">
          <span className="adm-breadcrumb__current">대시보드</span>
        </div>
      </nav>
    );
  }

  // Find matching section
  const sectionHref = Object.keys(SECTION_LABELS).find(
    (key) => pathname === key || pathname.startsWith(key + '/')
  );
  if (!sectionHref) return null;

  const sectionLabel = SECTION_LABELS[sectionHref];

  // Check for sub-path label (new / edit)
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
```

- [ ] **Step 2: Check linter**

Verify no linter errors on `src/components/admin/AdminBreadcrumb.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminBreadcrumb.jsx
git commit -m "feat: add AdminBreadcrumb client component"
```

---

## Task 4: Rewrite admin layout.jsx

**Files:**
- Modify: `src/app/admin/layout.jsx`

- [ ] **Step 1: Replace the layout**

The old layout rendered a single `adm-header`. Replace entirely:

```jsx
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';

export default function AdminLayout({ children }) {
  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-content">
        <AdminBreadcrumb />
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check linter**

Verify no linter errors on `src/app/admin/layout.jsx`.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000/admin in a browser. Verify:
- [ ] Sidebar appears on the left with dark background
- [ ] "대시보드" nav item is active (highlighted with left border)
- [ ] "사이트 보기" and "로그아웃" appear at the bottom
- [ ] Breadcrumb bar shows "대시보드" below the sidebar content area
- [ ] Navigate to `/admin/notices` — verify sidebar item updates and breadcrumb shows "관리자 / 공지사항 관리"
- [ ] Navigate to `/admin/notices/new` — verify breadcrumb shows "관리자 / 공지사항 관리 / 새 게시물"
- [ ] Resize browser to ≤768px — sidebar disappears, hamburger top bar appears
- [ ] Tap hamburger — sidebar slides in as overlay drawer

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.jsx
git commit -m "feat: rewrite admin layout with sidebar and breadcrumb"
```

---

## Task 5: Create dashboard data helper

**Files:**
- Create: `src/lib/dashboard.js`

- [ ] **Step 1: Create the helper**

```js
import { getNotices } from './notices';
import { getArchives } from './archive';
import { getDisclosures } from './disclosures';

/**
 * Fetches up to `limit` most recent items across all three content sections,
 * merged and sorted by createdAt descending.
 *
 * @param {number} limit - max items to return (default 5)
 * @returns {Promise<Array<{section: string, sectionHref: string, title: string, createdAt: string, editHref: string}>>}
 */
export async function getRecentActivity(limit = 5) {
  const [notices, archives, disclosures] = await Promise.all([
    getNotices(),
    getArchives(),
    getDisclosures(),
  ]);

  const tagged = [
    ...notices.map((n) => ({
      section: '공지',
      sectionHref: '/admin/notices',
      title: n.title,
      createdAt: n.createdAt,
      editHref: `/admin/notices/${n.id}/edit`,
    })),
    ...archives.map((a) => ({
      section: '자료',
      sectionHref: '/admin/archive',
      title: a.title,
      createdAt: a.createdAt,
      editHref: `/admin/archive/${a.id}/edit`,
    })),
    ...disclosures.map((d) => ({
      section: '공시',
      sectionHref: '/admin/disclosures',
      title: d.title,
      createdAt: d.createdAt,
      editHref: `/admin/disclosures/${d.id}/edit`,
    })),
  ];

  return tagged
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, limit);
}
```

- [ ] **Step 2: Check linter**

Verify no linter errors on `src/lib/dashboard.js`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/dashboard.js
git commit -m "feat: add getRecentActivity dashboard data helper"
```

---

## Task 6: Rewrite admin dashboard page.jsx

**Files:**
- Modify: `src/app/admin/page.jsx`

- [ ] **Step 1: Replace the page**

```jsx
import Link from 'next/link';
import { getNotices } from '@/lib/notices';
import { getArchives } from '@/lib/archive';
import { getDisclosures } from '@/lib/disclosures';
import { getRecentActivity } from '@/lib/dashboard';

export const metadata = { title: '대시보드 | EJJ 관리자' };
export const dynamic = 'force-dynamic';

const SECTION_BADGE_STYLE = {
  공지: { background: 'var(--brand)', color: '#fff' },
  자료: { background: 'var(--canvas)', color: 'var(--muted)', border: '1px solid var(--line)' },
  공시: { background: 'rgba(18,79,166,0.08)', color: 'var(--brand)' },
};

export default async function AdminPage() {
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [notices, archives, disclosures, recentActivity] = await Promise.all([
    getNotices(),
    getArchives(),
    getDisclosures(),
    getRecentActivity(5),
  ]);

  const stats = [
    {
      label: '공지사항',
      href: '/admin/notices',
      total: notices.length,
      monthCount: notices.filter((n) => n.createdAt?.startsWith(thisMonth)).length,
      highlight: false,
    },
    {
      label: '자료실',
      href: '/admin/archive',
      total: archives.length,
      monthCount: archives.filter((a) => a.createdAt?.startsWith(thisMonth)).length,
      highlight: false,
    },
    {
      label: '공시자료',
      href: '/admin/disclosures',
      total: disclosures.length,
      monthCount: disclosures.filter((d) => d.createdAt?.startsWith(thisMonth)).length,
      highlight: false,
    },
    {
      // Popups are not yet DB-backed. Show 0 until backend is implemented.
      label: '활성 팝업',
      href: '/admin/popups',
      total: 0,
      sub: '노출 중',
      highlight: false, // will become `total > 0` once popup DB is implemented
    },
  ];

  return (
    <main className="adm-main">
      <div className="adm-main__inner">
        <div className="adm-main__hd">
          <h1 className="adm-main__title">대시보드</h1>
          <p className="adm-main__sub">EJJ 홈페이지 콘텐츠 현황</p>
        </div>

        {/* Stats row */}
        <div className="adm-dash-stats">
          {stats.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`adm-dash-stat${s.highlight ? ' adm-dash-stat--highlight' : ''}`}
            >
              <span className="adm-dash-stat__label">{s.label}</span>
              <span className="adm-dash-stat__num">{s.total}</span>
              <span className="adm-dash-stat__sub">
                {s.sub ?? `이번 달 +${s.monthCount}`}
              </span>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <div className="adm-dash-recent">
          <div className="adm-dash-recent__hd">
            <span className="adm-dash-recent__title">최근 게시물</span>
          </div>
          {recentActivity.length === 0 ? (
            <p className="adm-dash-recent__empty">등록된 게시물이 없습니다.</p>
          ) : (
            <ul className="adm-dash-recent__list">
              {recentActivity.map((item, i) => (
                <li key={i} className="adm-dash-recent__item">
                  <span
                    className="adm-dash-recent__badge"
                    style={SECTION_BADGE_STYLE[item.section]}
                  >
                    {item.section}
                  </span>
                  <Link href={item.editHref} className="adm-dash-recent__name">
                    {item.title}
                  </Link>
                  <span className="adm-dash-recent__date">
                    {item.createdAt?.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="adm-dash-recent__ft">
            {[
              { label: '공지사항 →', href: '/admin/notices' },
              { label: '자료실 →', href: '/admin/archive' },
              { label: '공시자료 →', href: '/admin/disclosures' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="adm-dash-recent__more">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add adm-dash-* CSS to admin-layout.css**

Append the following to the end of `src/app/styles/admin-layout.css`:

```css
/* ── 대시보드 페이지 ──────────────────────────────────────── */
.adm-dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}

.adm-dash-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.125rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s var(--ease), box-shadow 0.15s var(--ease);
}

.adm-dash-stat:hover {
  border-color: var(--brand-mid);
  box-shadow: 0 2px 12px rgba(18, 79, 166, 0.08);
}

.adm-dash-stat--highlight {
  border-color: rgba(22, 163, 74, 0.25);
  background: rgba(22, 163, 74, 0.04);
}

.adm-dash-stat--highlight:hover {
  border-color: rgba(22, 163, 74, 0.5);
  box-shadow: 0 2px 12px rgba(22, 163, 74, 0.1);
}

.adm-dash-stat--highlight .adm-dash-stat__num {
  color: #16a34a;
}

.adm-dash-stat__label {
  font-size: 0.8125rem;
  color: var(--muted);
  font-weight: 500;
}

.adm-dash-stat__num {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--ink);
  line-height: 1;
}

.adm-dash-stat__sub {
  font-size: 0.75rem;
  color: var(--muted);
}

.adm-dash-recent {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
}

.adm-dash-recent__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--line);
}

.adm-dash-recent__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
}

.adm-dash-recent__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.adm-dash-recent__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  border-bottom: 1px solid var(--line);
}

.adm-dash-recent__item:last-child {
  border-bottom: none;
}

.adm-dash-recent__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.adm-dash-recent__name {
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  color: var(--ink);
  font-weight: 500;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.adm-dash-recent__name:hover {
  color: var(--brand);
}

.adm-dash-recent__date {
  font-size: 0.8125rem;
  color: var(--muted);
  flex-shrink: 0;
  white-space: nowrap;
}

.adm-dash-recent__empty {
  padding: 2rem 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--muted);
  margin: 0;
}

.adm-dash-recent__ft {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--line);
  background: var(--canvas);
}

.adm-dash-recent__more {
  font-size: 0.8125rem;
  color: var(--brand);
  text-decoration: none;
  font-weight: 500;
}

.adm-dash-recent__more:hover {
  text-decoration: underline;
}
```

- [ ] **Step 3: Check linter**

Verify no linter errors on both modified files.

- [ ] **Step 4: Verify in dev server**

Open http://localhost:3000/admin. Verify:
- [ ] Stats row shows 4 cards (공지사항, 자료실, 공시자료, 활성 팝업) with real counts
- [ ] Each stat card links to its section
- [ ] Recent activity table shows up to 5 most recent posts across all sections
- [ ] Each row has a section badge, clickable title (→ edit page), and date
- [ ] Footer shows links to all 3 sections

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/page.jsx src/app/styles/admin-layout.css
git commit -m "feat: rewrite admin dashboard with stats and recent activity"
```

---

## Task 7: Cleanup — Verify LogoutButton is no longer used in admin

**Files:**
- Read-only check: `src/components/LogoutButton.jsx`

`AdminSidebar` now renders its own logout button inline. The old `layout.jsx` was the only place that used `<LogoutButton compact />`. Since `layout.jsx` has been fully replaced, no further changes to `LogoutButton.jsx` are needed.

- [ ] **Step 1: Verify no remaining `compact` prop usage in admin**

Search the codebase for `LogoutButton compact`:

```bash
rg "LogoutButton" src/app/admin --include="*.jsx"
```

Expected output: no results (the old `layout.jsx` has been replaced).

If any result appears, remove the import and replace with an inline button matching the pattern in `AdminSidebar.jsx`.

- [ ] **Step 2: Commit if any cleanups were needed**

```bash
git add -A
git commit -m "chore: remove stale LogoutButton compact usage"
```

---

## Task 8: Final verification

- [ ] **Step 1: Confirm no regressions**

Navigate through all admin pages and verify:
- [ ] `/admin` — dashboard loads with real data
- [ ] `/admin/notices` — list page, sidebar shows "공지사항" active
- [ ] `/admin/notices/new` — editor, breadcrumb shows 3 levels
- [ ] `/admin/notices/[id]/edit` — editor, breadcrumb shows "게시물 수정"
- [ ] `/admin/archive` — list page loads
- [ ] `/admin/disclosures` — list page loads
- [ ] `/admin/popups` — list page loads
- [ ] Mobile (≤768px): hamburger visible, drawer opens, closes on nav click

- [ ] **Step 2: Final commit (only if there are uncommitted changes)**

```bash
git status
# If there are uncommitted changes:
git add -A
git commit -m "feat: admin navigation redesign complete"
```
