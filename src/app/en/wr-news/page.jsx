import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/wr-news/page';

export const metadata = { title: "WR News" };
export const revalidate = 60;

export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
