import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/notices/page';

export const metadata = { title: "Notices" };
export const revalidate = 60;

export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
