import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/wr-news/[id]/page';

export const revalidate = 3600;
export { generateMetadata } from '@/app/(site)/wr-news/[id]/page';

export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
