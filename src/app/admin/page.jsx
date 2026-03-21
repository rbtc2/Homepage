import Link from 'next/link';
import { getNotices } from '@/lib/notices';
import { getArchives } from '@/lib/archive';
import { getDisclosures } from '@/lib/disclosures';

export const metadata = { title: '관리자 | EJJ 홈페이지' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const notices = await getNotices();
  const pinnedCount = notices.filter((n) => n.isPinned).length;
  const archives = await getArchives();
  const archivesThisMonth = archives.filter((a) => a.createdAt?.startsWith(new Date().toISOString().slice(0, 7))).length;
  const disclosures = await getDisclosures();
  const disclosuresThisMonth = disclosures.filter((d) => d.createdAt?.startsWith(new Date().toISOString().slice(0, 7))).length;

  return (
    <>
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

            <Link href="/admin/popups" className="adm-card">
              <div className="adm-card__icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3" y="4" width="18" height="14" rx="2"
                    stroke="currentColor" strokeWidth="1.7"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path
                    d="M8 20h8M12 18v2"
                    stroke="currentColor" strokeWidth="1.7"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path
                    d="M15 8.5l-4.5 3L15 14.5"
                    stroke="currentColor" strokeWidth="1.7"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="adm-card__body">
                <span className="adm-card__name">팝업 관리</span>
                <span className="adm-card__meta">
                  전체 0건 · 노출 중 0건
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

            <Link href="/admin/disclosures" className="adm-card">
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
                    d="M8 13h8M8 17h6M8 9h2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="adm-card__body">
                <span className="adm-card__name">공시자료 관리</span>
                <span className="adm-card__meta">
                  전체 {disclosures.length}건 · 이번 달 {disclosuresThisMonth}건
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
    </>
  );
}
