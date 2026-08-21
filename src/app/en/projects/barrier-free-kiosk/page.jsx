import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/projects/barrier-free-kiosk/page';

export const metadata = { title: "Barrier-free kiosk data" };
export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
