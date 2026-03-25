import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '인사말 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export default function GreetingPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">인사말</h1>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
