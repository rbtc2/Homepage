import { getActiveSitePopups } from '@/lib/popups';
import SitePopups from './SitePopups';

/** 활성 팝업이 있을 때만 클라이언트 레이어를 렌더합니다. */
export default async function SitePopupsLoader() {
  let popups = [];
  try {
    popups = await getActiveSitePopups();
  } catch {
    return null;
  }

  if (!popups.length) return null;
  return <SitePopups popups={popups} />;
}
