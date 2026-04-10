import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import WrNewsGrid from '@/components/wr-news/WrNewsGrid';
import { getWrNewsPage, searchWrNewsPage } from '@/lib/wr-news';
import { calcTotalPages } from '@/lib/paginate';

export const metadata = {
  title: 'WR뉴스 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description: '월드라이츠 WR뉴스 소식을 썸네일과 함께 확인합니다.',
};

export const revalidate = 60;

const BASE = '/wr-news';
const PER_PAGE = 12;

export default async function WrNewsPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page = Math.max(1, Number(pageParam) || 1);
  const isSearching = query.length > 0;

  let items;
  let totalCount;
  if (isSearching) {
    const r = await searchWrNewsPage({ query, page, itemsPerPage: PER_PAGE });
    items = r.items;
    totalCount = r.totalCount;
  } else {
    const r = await getWrNewsPage({ page, itemsPerPage: PER_PAGE });
    items = r.items;
    totalCount = r.totalCount;
  }

  const totalPages = calcTotalPages(totalCount, PER_PAGE);

  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">단체 활동</p>
            <h1 className="page-header__title">WR뉴스</h1>
          </div>
        </div>

        <div className="gallery-board wr-news-board">
          <div className="gallery-board__inner">
            <div className="notice-board__toolbar">
              <BoardMeta
                basePath={BASE}
                isSearching={isSearching}
                query={query}
                searchCount={totalCount}
                allCount={totalCount}
              />
              <BoardSearchForm basePath={BASE} ariaLabel="WR뉴스 검색" defaultValue={query} />
            </div>
            <WrNewsGrid
              items={items}
              page={page}
              totalPages={totalPages}
              basePath={BASE}
              query={query}
              isSearching={isSearching}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
