import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryFilterBar from '@/components/gallery/GalleryFilterBar';
import { getGalleryPage, getGalleryYears } from '@/lib/gallery';
import { calcTotalPages } from '@/lib/paginate';

export const metadata = { title: '포토갤러리 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
export const revalidate = 60;

const BASE = '/gallery';
const PER_PAGE = 12;

export default async function GalleryPage({ searchParams }) {
  const { page: pageParam, year: yearParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const year = yearParam ?? null;

  const [{ items, totalCount }, years] = await Promise.all([
    getGalleryPage({ page, year, itemsPerPage: PER_PAGE }),
    getGalleryYears(),
  ]);

  const totalPages = calcTotalPages(totalCount, PER_PAGE);

  return (
    <>
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">포토갤러리</h1>
          </div>
        </div>

        <div className="gallery-board">
          <div className="gallery-board__inner">
            <GalleryFilterBar
              years={years}
              currentYear={year}
              totalCount={totalCount}
              basePath={BASE}
            />
            <GalleryGrid
              items={items}
              totalCount={totalCount}
              page={page}
              totalPages={totalPages}
              currentYear={year}
              basePath={BASE}
            />
          </div>
        </div>
      </main>
    </>
  );
}
