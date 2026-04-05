import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import NoticeStrip from '@/components/NoticeStrip';
import Footer from '@/components/Footer';
import HomeWrNewsSpotlight from '@/components/home/HomeWrNewsSpotlight';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Header />
      <HeroBanner />
      <NoticeStrip />
      <main className="main" role="main">
        <div className="main__surface">
          <HomeWrNewsSpotlight />
        </div>
      </main>
      <Footer />
    </>
  );
}
