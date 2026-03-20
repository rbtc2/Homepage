import Link from 'next/link';
import { getNotices } from '@/lib/notices';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
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
        <div className="ns__head">
          <div className="ns__labelWrap">
            <span className="ns__label">공지사항</span>
            <span className="ns__sub">최근 2건</span>
          </div>
          <Link href="/notices" className="ns__more" aria-label="공지사항 전체보기">
            전체보기
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <ul className="ns__list" role="list">
          {pinnedNotices.map((notice, i) => (
            <li key={notice.id} className="ns__item">
              {i > 0 && <div className="ns__divider" aria-hidden="true" />}
              <Link href={`/notices/${notice.id}`} className="ns__link">
                <span className="ns__badge" aria-label="고정 공지">공지</span>
                <span className="ns__title">{notice.title}</span>
                <time className="ns__date" dateTime={notice.createdAt}>
                  {formatDate(notice.createdAt)}
                </time>
                <span className="ns__arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
