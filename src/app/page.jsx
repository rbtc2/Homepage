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
          <p className="main__lead">진행 예정</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
