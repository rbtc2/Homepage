import HeroBanner from '@/components/HeroBanner';
import NoticeStrip from '@/components/NoticeStrip';
import HomeWrNewsBlock from '@/components/home/HomeWrNewsBlock';
import EnComingSoonBanner from '@/components/en/EnComingSoonBanner';

export const revalidate = 60;

export const metadata = {
  title: 'WORLD RIGHTS',
  description:
    'WORLD RIGHTS works in solidarity, independent living support, and human-rights advocacy.',
};

export default function EnHomePage() {
  return (
    <>
      <EnComingSoonBanner />
      <HeroBanner />
      <NoticeStrip locale="en" />
      <main className="main main--flush" role="main">
        <HomeWrNewsBlock locale="en" />
      </main>
    </>
  );
}
