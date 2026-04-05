import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import NoticeStrip from '@/components/NoticeStrip';
import Footer from '@/components/Footer';
import HomeWrNewsBlock from '@/components/home/HomeWrNewsBlock';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Header />
      <HeroBanner />
      <NoticeStrip />
      <main className="main main--flush" role="main">
        <HomeWrNewsBlock />
      </main>
      <Footer />
    </>
  );
}
