import Link from 'next/link';
import HighlightedText from './HighlightedText';

/**
 * 게시판 테이블 + 빈 결과 상태
 *
 * @param {object[]} rows        - rowNum 포함된 게시물 배열 (isPinned 필드 있으면 공지 뱃지 표시)
 * @param {string}   basePath    - 예: '/notices'
 * @param {boolean}  isSearching - 검색 중 여부
 * @param {string}   query       - 검색어
 * @param {string}   emptyText   - 검색 결과 없을 때 표시할 게시물 종류 (예: '공지사항을')
 */
export default function BoardTable({ rows, basePath, isSearching, query, emptyText }) {
  return (
    <table className="notice-table">
      <thead className="notice-table__head">
        <tr>
          <th className="notice-table__th notice-table__th--num">번호</th>
          <th className="notice-table__th notice-table__th--title">제목</th>
          <th className="notice-table__th notice-table__th--author">작성자</th>
          <th className="notice-table__th notice-table__th--date">작성일</th>
          <th className="notice-table__th notice-table__th--views">조회</th>
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
                  <p className="notice-table__empty-title">검색 결과가 없습니다</p>
                  <p className="notice-table__empty-desc">
                    &ldquo;{query}&rdquo;에 해당하는 {emptyText} 찾지 못했습니다.
                    <br />다른 검색어를 입력하거나{' '}
                    <Link href={basePath} className="notice-table__empty-link">전체 목록</Link>을 확인하세요.
                  </p>
                </>
              ) : (
                <p className="notice-table__empty-title">등록된 게시물이 없습니다</p>
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
                  {pinned ? <span className="notice-badge">공지</span> : post.rowNum}
                </td>
                <td className="notice-table__td notice-table__td--title">
                  <Link href={`${basePath}/${post.id}`} className="notice-table__link">
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
