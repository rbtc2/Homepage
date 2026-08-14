export const ITEMS_PER_PAGE = 10;

/**
 * DB 레벨 페이지네이션으로 가져온 items에 rowNum을 부여합니다.
 * @param {object[]} items - 이미 페이지 단위로 잘라온 항목 배열
 * @param {{ totalCount: number, page: number, itemsPerPage?: number }} options
 */
export function addRowNums(items, { totalCount, page, itemsPerPage = ITEMS_PER_PAGE }) {
  return items.map((item, i) => ({
    ...item,
    rowNum: totalCount - (page - 1) * itemsPerPage - i,
  }));
}

/**
 * totalCount 와 itemsPerPage 로 총 페이지 수를 계산합니다.
 */
export function calcTotalPages(totalCount, itemsPerPage = ITEMS_PER_PAGE) {
  return Math.max(1, Math.ceil(totalCount / itemsPerPage));
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
