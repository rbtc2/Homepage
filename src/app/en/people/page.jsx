import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/people/page';

export const metadata = { title: "People" };
export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
