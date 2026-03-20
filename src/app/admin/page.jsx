import Link from 'next/link';
import { getNotices } from '@/lib/notices';
import { getArchives } from '@/lib/archive';
import LogoutButton from '@/components/LogoutButton';

export const metadata = { title: '관리자 | EJJ 홈페이지' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const notices = await getNotices();
  const pinnedCount = notices.filter((n) => n.isPinned).length;
  const archives = await getArchives();
  const archivesThisMonth = archives.filter((a) => a.createdAt?.startsWith(new Date().toISOString().slice(0, 7))).length;

  return (
    <div className="adm-layout">
      <header className="adm-header">
        <div className="adm-header__inner">
          <span className="adm-header__brand">EJJ 관리자</span>
          <div className="adm-header__tools">
            <Link href="/" className="adm-header__site-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              사이트 보기
            </Link>
            <LogoutButton compact />
          </div>
        </div>
      </header>

      <main className="adm-main">
        <div className="adm-main__inner">
          <div className="adm-main__hd">
            <h1 className="adm-main__title">대시보드</h1>
            <p className="adm-main__sub">관리할 항목을 선택하세요.</p>
          </div>

          <div className="adm-cards">
            <Link href="/admin/notices" className="adm-card">
              <div className="adm-card__icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="adm-card__body">
                <span className="adm-card__name">공지사항 관리</span>
                <span className="adm-card__meta">
                  전체 {notices.length}건 · 공지 고정 {pinnedCount}건
                </span>
              </div>
              <svg
                className="adm-card__arrow"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link href="/admin/archive" className="adm-card">
              <div className="adm-card__icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 13h8M8 17h8M8 9h2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="adm-card__body">
                <span className="adm-card__name">자료실 관리</span>
                <span className="adm-card__meta">
                  전체 {archives.length}건 · 이번 달 {archivesThisMonth}건
                </span>
              </div>
              <svg
                className="adm-card__arrow"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
