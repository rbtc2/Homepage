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
          푸터 연락처와 단체 후원(회원가입 신청 링크) 등 공개 페이지에 노출되는 값을 관리합니다. 저장 즉시 반영됩니다.
        </p>
      </header>

      <SiteSettingsForm initial={initial} />
    </>
  );
}
