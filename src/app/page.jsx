import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import NoticeStrip from '@/components/NoticeStrip';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <HeroBanner />
      <NoticeStrip />
      <main className="main" role="main">
        <div className="main__surface">
          <p className="main__lead">본문 영역</p>
          <p className="main__note">하단 콘텐츠는 이후 단계에서 구성됩니다.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
