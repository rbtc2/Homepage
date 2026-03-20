import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '소개 | EJJ 홈페이지',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">소개</h1>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
