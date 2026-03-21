# Admin Navigation Redesign — Design Spec

**Date:** 2026-03-21  
**Status:** Approved  

---

## 1. Problem Statement

The current admin layout has no secondary navigation. Once inside a section (e.g. `/admin/notices`), reaching another section (e.g. `/admin/archive`) requires navigating back to the dashboard and clicking again — an unnecessary 2-step detour. There is also no breadcrumb, so the user has no visual context of where they are.

The dashboard home (`/admin`) is a pure navigation menu (4 link cards) that becomes redundant once a sidebar exists. It provides no at-a-glance operational information.

---

## 2. Goals

1. Allow the admin to move between any section in one click from anywhere in the admin area.
2. Show the user's current location clearly at all times (active nav item + breadcrumb).
3. Replace the dashboard home with a genuinely useful summary page.
4. Support occasional mobile access with a collapsible drawer.

---

## 3. Design Decisions

| Question | Decision | Rationale |
|---|---|---|
| Navigation pattern | Left sidebar (fixed, dark) | Standard admin pattern; always-visible on desktop; no extra click to navigate |
| Mobile behavior | Hamburger button → slide-in overlay drawer | Sidebar is too wide for mobile; overlay keeps content readable |
| Dashboard home | Converted to summary page | 4 nav cards become redundant; real data makes the home page worth visiting |
| Sidebar collapsible on desktop? | No (icon-only collapse out of scope) | Only 4–5 sections; fixed width is simpler and sufficient |

---

## 4. Layout Structure

```
┌─────────────────────────────────────────────┐
│  [Sidebar 180px]  │  [Breadcrumb bar]        │
│                   │─────────────────────────│
│  EJJ 관리자       │  Page content             │
│  ─────────────    │                           │
│  대시보드  ◀ active│                           │
│  공지사항          │                           │
│  자료실            │                           │
│  공시자료          │                           │
│  팝업 관리         │                           │
│  ─────────────    │                           │
│  사이트 보기       │                           │
│  로그아웃          │                           │
└────────────────────┴──────────────────────────┘
```

### Sidebar specs
- **Width:** 180px (fixed, never collapses on desktop)
- **Background:** `#0c1424` (`--ink`)
- **Active indicator:** 2px left border `#1e62c4` (`--brand-mid`) + subtle background highlight
- **Section label:** uppercase muted category label above nav items ("콘텐츠")
- **Icons:** Each nav item has a unique 13×13 SVG icon (grid, document, list, clock, monitor)
- **Footer items:** 사이트 보기 (with home icon), 로그아웃

### Breadcrumb bar specs
- **Height:** ~32px
- **Background:** `#ffffff`
- **Border-bottom:** `1px solid var(--line)`
- **Depth rules:**
  - 2 levels on section root pages: `관리자 / 공지사항 관리`
  - 3 levels on sub-pages (new/edit): `관리자 / 공지사항 관리 / 새 게시물` or `관리자 / 공지사항 관리 / 게시물 수정`
  - The second crumb always links back to the section list page (e.g. `/admin/notices`)
- The breadcrumb bar is rendered inside `AdminLayout` (server component), driven by `usePathname()` in a thin client wrapper `AdminBreadcrumb`

### Mobile behavior (breakpoint: ≤ 768px)
- Sidebar hidden by default
- Top bar: `full-width`, shows hamburger button (left) + brand name (center) + logout (right)
- Hamburger click: sidebar slides in from left as an overlay (z-index 300)
- Overlay backdrop: `rgba(12,20,36,0.5)` behind sidebar, clicking it closes the drawer
- Sidebar drawer closes automatically on nav item click

---

## 5. Dashboard Home Redesign (`/admin`)

Replaces the 4-card navigation grid with a summary page containing:

### 5a. Summary Stats Row (4 cards)
Each card shows: section name, total count, this-month count.

| Card | Data | Highlight color |
|---|---|---|
| 공지사항 | total + this month | default |
| 자료실 | total + this month | default |
| 공시자료 | total + this month | default |
| 활성 팝업 | active count | green (`#16a34a`) if > 0 |

### 5b. Recent Activity Table
- Last 5 posts across **all sections** (공지사항 + 자료실 + 공시자료), merged and sorted by `createdAt` descending
- Columns: section badge (공지 / 자료 / 공시), title (truncated, links to edit page), date
- "전체 보기" link → routes to the section's list page

---

## 6. Files Changed

| File | Change type | Description |
|---|---|---|
| `src/app/admin/layout.jsx` | Rewrite | Replace header-only layout with sidebar + main 2-column layout. Add mobile hamburger state (client component or use a separate client wrapper). |
| `src/app/styles/admin-layout.css` | Rewrite | Add sidebar styles (`adm-sidebar`, `adm-sidebar__nav`, `adm-sidebar__item`, `adm-sidebar__item--active`, `adm-breadcrumb`). Add mobile drawer + overlay styles. Remove old header-only styles. |
| `src/app/admin/page.jsx` | Rewrite | Replace 4-card grid with stats row + recent activity table. Add `getRecentActivity()` data fetch. |

### Files NOT changed
- `src/app/admin/notices/*`
- `src/app/admin/archive/*`
- `src/app/admin/disclosures/*`
- `src/app/admin/popups/*`
- `src/app/styles/admin-board.css`
- All editor components

---

## 7. Component Architecture

### `layout.jsx` split
Because the sidebar needs client-side state (mobile open/close), we split into:
- `AdminLayout` (Server Component) — renders `<AdminSidebar>` + `{children}`
- `AdminSidebar` (`'use client'`) — handles mobile toggle state, renders sidebar + mobile top bar

### `AdminSidebar` props
```ts
// No props needed — nav items are hardcoded (not data-driven)
```

### `usePathname` for active state
`AdminSidebar` uses Next.js `usePathname()` to determine the active nav item. Active if `pathname === item.href` or `pathname.startsWith(item.href + '/')`.

Special case: dashboard item is active only on exact `/admin` match.

---

## 8. CSS Namespace

New classes added under existing `adm-*` namespace:

```
adm-layout          (updated: flex-row instead of flex-col)
adm-sidebar         (new)
adm-sidebar__brand  (new)
adm-sidebar__nav    (new)
adm-sidebar__section-label (new)
adm-sidebar__item   (new)
adm-sidebar__item--active (new)
adm-sidebar__icon   (new)
adm-sidebar__footer (new)
adm-topbar          (new, mobile only)
adm-topbar__hamburger (new)
adm-overlay         (new, mobile backdrop)
adm-breadcrumb      (new)
adm-breadcrumb__inner (new)
```

Dashboard page uses new `adm-dash-*` namespace:
```
adm-dash-stats      (stats row grid)
adm-dash-stat       (individual stat card)
adm-dash-recent     (recent activity table wrapper)
```

---

## 9. Out of Scope

- Sidebar icon-only collapsed mode (desktop)
- Per-section notification badges in the sidebar
- User profile / avatar in sidebar
- Search bar in sidebar
- Dark mode

---

## 10. Success Criteria

1. **Desktop:** From any admin page, the user can reach any other section in exactly **1 click** (sidebar is always visible).
2. **Mobile (≤768px):** From any admin page, the user can reach any other section in **2 interactions** (hamburger tap → nav item tap). This is accepted and intentional; the 1-click criterion applies to desktop only.
3. The active sidebar item is always highlighted.
4. Breadcrumb correctly reflects the current section and depth (2-level on list pages, 3-level on new/edit pages).
5. On mobile (≤768px), the sidebar is hidden by default and opens via hamburger tap; clicking a nav item or the backdrop closes it.
6. The dashboard home shows real data (stats + recent posts), not static cards.
7. No regressions in existing notice/archive/disclosure/popup management pages.
