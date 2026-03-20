import { getDisclosures } from '@/lib/disclosures';
import DisclosuresClient from './DisclosuresClient';

export const metadata = { title: '공시자료 관리 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminDisclosuresPage() {
  const disclosures = await getDisclosures();
  return <DisclosuresClient initialDisclosures={disclosures} />;
}

