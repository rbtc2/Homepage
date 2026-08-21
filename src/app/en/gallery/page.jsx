import GalleryHero from '@/components/gallery/GalleryHero';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryFilterBar from '@/components/gallery/GalleryFilterBar';
import {
  getGalleryPage,
  getGalleryYears,
  getLatestGallery,
  localizeGalleryPosts,
} from '@/lib/gallery';
import { galleryUi } from '@/lib/gallery-ui';
import { calcTotalPages } from '@/lib/paginate';

export const metadata = { title: 'Gallery | WORLD RIGHTS' };
export const revalidate = 60;

const BASE = '/en/gallery';
const PER_PAGE = 12;
const LOCALE = 'en';

export default async function EnGalleryPage({ searchParams }) {
  const { page: pageParam, year: yearParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const year = yearParam ?? null;
  const ui = galleryUi(LOCALE);

  const showHero = page === 1 && !year;

  const [{ items: rawItems, totalCount }, years, rawHero] = await Promise.all([
    getGalleryPage({ page, year, itemsPerPage: PER_PAGE }),
    getGalleryYears(),
    showHero ? getLatestGallery(3) : Promise.resolve([]),
  ]);

  const items = localizeGalleryPosts(rawItems, LOCALE);
  const heroItems = localizeGalleryPosts(rawHero, LOCALE);
  const totalPages = calcTotalPages(totalCount, PER_PAGE);

  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">{ui.sectionLabel}</p>
          <h1 className="page-header__title">{ui.title}</h1>
        </div>
      </div>

      {showHero && heroItems.length > 0 ? (
        <GalleryHero items={heroItems} basePath={BASE} locale={LOCALE} />
      ) : null}

      <div className="gallery-board">
        <div className="gallery-board__inner">
          <GalleryFilterBar
            locale={LOCALE}
            years={years}
            currentYear={year}
            totalCount={totalCount}
            basePath={BASE}
          />
          <GalleryGrid
            locale={LOCALE}
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
  );
}
