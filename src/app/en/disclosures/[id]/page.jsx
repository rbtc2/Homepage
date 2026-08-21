import EnPendingPage from '@/components/en/EnPendingPage';
import SourcePage from '@/app/(site)/disclosures/[id]/page';

export const revalidate = 3600;
export { generateMetadata } from '@/app/(site)/disclosures/[id]/page';

export default async function Page(props) {
  return (
    <EnPendingPage>
      <SourcePage {...props} />
    </EnPendingPage>
  );
}
