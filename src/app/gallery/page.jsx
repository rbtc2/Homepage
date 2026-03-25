import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryHero from '@/components/gallery/GalleryHero';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryFilterBar from '@/components/gallery/GalleryFilterBar';
import { getGalleryPage, getGalleryYears, getLatestGallery } from '@/lib/gallery';
import { calcTotalPages } from '@/lib/paginate';

export const metadata = { title: '포토갤러리 | 국제인권연대 월드라이츠(WORLD RIGHTS)' };
export const revalidate = 60;

const BASE = '/gallery';
const PER_PAGE = 12;

export default async function GalleryPage({ searchParams }) {
  const { page: pageParam, year: yearParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const year = yearParam ?? null;

  const showHero = page === 1 && !year;

  const [{ items, totalCount }, years, heroItems] = await Promise.all([
    getGalleryPage({ page, year, itemsPerPage: PER_PAGE }),
    getGalleryYears(),
    showHero ? getLatestGallery(3) : Promise.resolve([]),
  ]);

  const totalPages = calcTotalPages(totalCount, PER_PAGE);

  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">커뮤니티</p>
            <h1 className="page-header__title">포토갤러리</h1>
          </div>
        </div>

        {showHero && heroItems.length > 0 && (
          <GalleryHero items={heroItems} basePath={BASE} />
        )}

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
      <Footer />
    </>
  );
}
