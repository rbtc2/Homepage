import HeroBanner from '@/components/HeroBanner';
import NoticeStrip from '@/components/NoticeStrip';
import HomeWrNewsBlock from '@/components/home/HomeWrNewsBlock';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <HeroBanner />
      <NoticeStrip />
      <main className="main main--flush" role="main">
        <HomeWrNewsBlock />
      </main>
    </>
  );
}
