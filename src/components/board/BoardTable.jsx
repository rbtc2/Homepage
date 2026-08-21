import Link from 'next/link';
import HighlightedText from './HighlightedText';

const TABLE_UI = {
  ko: {
    num: '번호',
    title: '제목',
    author: '작성자',
    date: '작성일',
    views: '조회',
    pin: '공지',
    emptyNone: '등록된 게시물이 없습니다',
    emptySearchTitle: '검색 결과가 없습니다',
    emptySearchDesc: (query, emptyText) => (
      <>
        &ldquo;{query}&rdquo;에 해당하는 {emptyText} 찾지 못했습니다.
        <br />다른 검색어를 입력하거나{' '}
      </>
    ),
    allList: '전체 목록',
    allListSuffix: '을 확인하세요.',
  },
  en: {
    num: 'No.',
    title: 'Title',
    author: 'Author',
    date: 'Date',
    views: 'Views',
    pin: 'Notice',
    emptyNone: 'No posts yet',
    emptySearchTitle: 'No matching posts',
    emptySearchDesc: (query, emptyText) => (
      <>
        No {emptyText} matching &ldquo;{query}&rdquo;.
        <br />
        Try another search or{' '}
      </>
    ),
    allList: 'all posts',
    allListSuffix: '.',
  },
};

/**
 * 게시판 테이블 + 빈 결과 상태
 *
 * @param {object[]} rows        - rowNum 포함된 게시물 배열 (isPinned 필드 있으면 공지 뱃지 표시)
 * @param {string}   basePath    - 예: '/notices'
 * @param {boolean}  isSearching - 검색 중 여부
 * @param {string}   query       - 검색어
 * @param {string}   emptyText   - 검색 결과 없을 때 표시할 게시물 종류 (예: '공지사항을' / 'notices')
 * @param {'ko'|'en'} [locale]
 */
export default function BoardTable({
  rows,
  basePath,
  isSearching,
  query,
  emptyText,
  locale = 'ko',
}) {
  const ui = TABLE_UI[locale] ?? TABLE_UI.ko;

  return (
    <table className="notice-table">
      <thead className="notice-table__head">
        <tr>
          <th className="notice-table__th notice-table__th--num">{ui.num}</th>
          <th className="notice-table__th notice-table__th--title">{ui.title}</th>
          <th className="notice-table__th notice-table__th--author">{ui.author}</th>
          <th className="notice-table__th notice-table__th--date">{ui.date}</th>
          <th className="notice-table__th notice-table__th--views">{ui.views}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td className="notice-table__empty" colSpan={5}>
              <span className="notice-table__empty-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="15" cy="15" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M22 22L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 15h6M15 12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              {isSearching ? (
                <>
                  <p className="notice-table__empty-title">{ui.emptySearchTitle}</p>
                  <p className="notice-table__empty-desc">
                    {ui.emptySearchDesc(query, emptyText)}
                    <Link href={basePath} className="notice-table__empty-link">{ui.allList}</Link>
                    {ui.allListSuffix}
                  </p>
                </>
              ) : (
                <p className="notice-table__empty-title">{ui.emptyNone}</p>
              )}
            </td>
          </tr>
        ) : (
          rows.map((post) => {
            const pinned = post.isPinned && !isSearching;
            return (
              <tr
                key={post.id}
                className={`notice-table__row${pinned ? ' notice-table__row--pinned' : ''}`}
              >
                <td className="notice-table__td notice-table__td--num">
                  {pinned ? <span className="notice-badge">{ui.pin}</span> : post.rowNum}
                </td>
                <td className="notice-table__td notice-table__td--title">
                  <Link href={`${basePath}/${post.id}`} className="notice-table__link">
                    {post.isSecret ? '🔒 ' : ''}
                    {isSearching
                      ? <HighlightedText text={post.title} query={query} />
                      : post.title}
                  </Link>
                </td>
                <td className="notice-table__td notice-table__td--author">{post.author}</td>
                <td className="notice-table__td notice-table__td--date">{post.createdAt}</td>
                <td className="notice-table__td notice-table__td--views">{post.views.toLocaleString()}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
