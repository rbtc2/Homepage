import { getActiveSitePopups } from '@/lib/popups';
import SitePopups from './SitePopups';

/** 활성 팝업이 있을 때만 클라이언트 레이어를 렌더합니다. 조회 실패 시 사이트를 막지 않습니다. */
export default async function SitePopupsLoader({ locale = 'ko' }) {
  if (locale === 'en') return null;

  let popups = [];
  try {
    popups = await getActiveSitePopups();
  } catch (err) {
    console.error('[SitePopupsLoader]', err);
    return null;
  }

  if (!popups.length) return null;
  return <SitePopups popups={popups} />;
}
