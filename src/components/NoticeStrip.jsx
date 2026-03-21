import Link from 'next/link';
import { getNotices } from '@/lib/notices';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function NoticeStrip() {
  const allNotices = await getNotices();
  const pinnedNotices = allNotices
    .filter((n) => n.isPinned)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  if (pinnedNotices.length === 0) return null;

  return (
    <section className="ns" aria-label="주요 공지사항">
      <div className="ns__inner">

        {/* 헤더: eyebrow + rule + 전체보기 */}
        <div className="ns__head">
          <p className="ns__eyebrow">공지사항</p>
          <hr className="ns__rule" />
          <Link href="/notices" className="ns__more" aria-label="공지사항 전체보기">
            전체보기
            <ArrowIcon />
          </Link>
        </div>

        {/* 공지 목록 */}
        <ul className="ns__list" role="list">
          {pinnedNotices.map((notice) => (
            <li key={notice.id} className="ns__item">
              <Link href={`/notices/${notice.id}`} className="ns__link">
                <time className="ns__date" dateTime={notice.createdAt}>
                  {formatDate(notice.createdAt)}
                </time>
                <span className="ns__badge" aria-label="고정 공지">Notice</span>
                <span className="ns__title">{notice.title}</span>
                <span className="ns__arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
