import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/press/page';

export const metadata = { title: "Press" };
export const revalidate = 60;

export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
