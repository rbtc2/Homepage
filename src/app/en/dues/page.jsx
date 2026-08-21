import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/dues/page';

export const metadata = { title: "Dues" };
export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
