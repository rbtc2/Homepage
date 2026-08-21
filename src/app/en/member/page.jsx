import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/member/page';

export const metadata = { title: "Membership" };
export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
