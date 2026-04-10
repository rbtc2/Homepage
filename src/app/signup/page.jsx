import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '회원가입 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export default function SignupPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">나의 후원</p>
            <h1 className="page-header__title">회원가입</h1>
          </div>
        </div>

        <section className="su-wrap" aria-label="회원가입" />
      </main>
      <Footer />
    </>
  );
}
