import SettingsLayoutClient from './SettingsLayoutClient';

/** 설정 하위 페이지 공통: 2차 네비 + 안내 배너 */
export default function AdminSettingsLayout({ children }) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
}
