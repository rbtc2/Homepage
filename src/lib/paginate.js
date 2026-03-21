const ITEMS_PER_PAGE = 10;

/**
 * 이미 정렬된 배열을 페이지 단위로 자르고 rowNum을 부여합니다.
 * @param {object[]} sortedItems - 내림차순 정렬된 항목 배열
 * @param {{ page: number, itemsPerPage?: number }} options
 * @returns {{ rows: object[], totalCount: number, totalPages: number }}
 */
export function paginateSorted(sortedItems, { page, itemsPerPage = ITEMS_PER_PAGE }) {
  const totalCount = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paged = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const rows = paged.map((item, i) => ({
    ...item,
    rowNum: totalCount - (page - 1) * itemsPerPage - i,
  }));
  return { rows, totalCount, totalPages };
}

/**
 * 게시판 URL을 생성합니다.
 * @param {string} basePath - 예: '/notices'
 * @param {number} page
 * @param {string} query
 */
export function buildBoardHref(basePath, page, query) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
