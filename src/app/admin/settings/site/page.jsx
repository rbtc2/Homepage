import SiteSettingsForm from './SiteSettingsForm';
import { getSiteFooterSettings } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export const metadata = { title: '사이트 기본 정보 | 사이트 설정 | 관리자' };

export default async function AdminSettingsSitePage() {
  const initial = await getSiteFooterSettings();

  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">사이트 기본 정보</h1>
        <p className="adm-main__sub">
          푸터에 노출되는 사무실 주소·대표자·연락처를 관리합니다. 저장 즉시 공개 페이지에 반영됩니다.
        </p>
      </header>

      <SiteSettingsForm initial={initial} />
    </>
  );
}
