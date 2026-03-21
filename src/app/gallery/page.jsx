import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: '포토갤러리 | EJJ 홈페이지' };

export default function GalleryPage() {
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
      </main>
      <Footer />
    </>
  );
}
