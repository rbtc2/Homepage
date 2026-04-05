import Link from 'next/link';

export const metadata = { title: '개요 | 사이트 설정 | 관리자' };

const HUB_LINKS = [
  {
    href: '/admin/settings/account',
    title: '관리자 계정',
    desc: '비밀번호·로그인 정책(연동 예정)',
  },
  {
    href: '/admin/settings/site',
    title: '사이트 기본 정보',
    desc: '조직명, 연락처 등 공통 메타',
  },
  {
    href: '/admin/settings/home',
    title: '홈페이지 노출',
    desc: '메인 카피, 공지 띠 문구',
  },
];

export default function AdminSettingsHubPage() {
  return (
    <>
      <header className="adm-main__hd adm-settings-hub__hd">
        <h1 className="adm-main__title">사이트 설정</h1>
      </header>

      <ul className="adm-settings-hub">
        {HUB_LINKS.map(({ href, title, desc }) => (
          <li key={href} className="adm-settings-hub__item">
            <Link href={href} className="adm-settings-hub__card">
              <span className="adm-settings-hub__title">{title}</span>
              <span className="adm-settings-hub__desc">{desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
