import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/archive/page';

export const metadata = { title: "Archive" };
export const revalidate = 60;

export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
