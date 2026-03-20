import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '오시는 길 | EJJ 홈페이지',
};

export default function DirectionsPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">찾아오시는 방법</p>
            <h1 className="page-header__title">오시는 길</h1>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
