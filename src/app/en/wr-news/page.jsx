import BoardSearchForm from '@/components/board/BoardSearchForm';
import BoardMeta from '@/components/board/BoardMeta';
import WrNewsList from '@/components/wr-news/WrNewsList';
import {
  getWrNewsPage,
  searchWrNewsPage,
  localizeWrNewsPosts,
} from '@/lib/wr-news';
import { wrNewsUi } from '@/lib/wr-news-ui';
import { calcTotalPages } from '@/lib/paginate';

export const metadata = {
  title: 'WR News | WORLD RIGHTS',
  description: 'News from World Rights, with thumbnails.',
};

export const revalidate = 60;

const BASE = '/en/wr-news';
const PER_PAGE = 12;
const LOCALE = 'en';

export default async function EnWrNewsPage({ searchParams }) {
  const { page: pageParam, q: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const page = Math.max(1, Number(pageParam) || 1);
  const isSearching = query.length > 0;
  const ui = wrNewsUi(LOCALE);

  let items;
  let totalCount;
  if (isSearching) {
    const r = await searchWrNewsPage({ query, page, itemsPerPage: PER_PAGE });
    items = localizeWrNewsPosts(r.items, LOCALE);
    totalCount = r.totalCount;
  } else {
    const r = await getWrNewsPage({ page, itemsPerPage: PER_PAGE });
    items = localizeWrNewsPosts(r.items, LOCALE);
    totalCount = r.totalCount;
  }

  const totalPages = calcTotalPages(totalCount, PER_PAGE);

  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">{ui.sectionLabel}</p>
          <h1 className="page-header__title">{ui.title}</h1>
        </div>
      </div>

      <div className="wr-news-board">
        <div className="wr-news-board__inner">
          <div className="notice-board__toolbar">
            <BoardMeta
              locale={LOCALE}
              basePath={BASE}
              isSearching={isSearching}
              query={query}
              searchCount={totalCount}
              allCount={totalCount}
            />
            <BoardSearchForm
              locale={LOCALE}
              basePath={BASE}
              ariaLabel={ui.searchAria}
              placeholder={ui.searchPlaceholder}
              submitLabel={ui.searchSubmit}
              defaultValue={query}
            />
          </div>
          <WrNewsList
            locale={LOCALE}
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
  );
}
