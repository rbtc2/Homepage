import Link from 'next/link';

export const metadata = { title: '개요 | 사이트 설정 | 관리자' };

const HUB_LINKS = [
  {
    href: '/admin/settings/site',
    title: '사이트 기본 정보',
    desc: '조직명, 대표 연락처 등 푸터·문의에 쓰일 공통 정보',
  },
  {
    href: '/admin/settings/home',
    title: '홈페이지 노출',
    desc: '메인 카피, 공지 띠 등 방문자 첫 화면 관련 설정',
  },
  {
    href: '/admin/settings/account',
    title: '관리자 계정',
    desc: '비밀번호 변경 등 (백엔드 연동 후)',
  },
];

export default function AdminSettingsHubPage() {
  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">사이트 설정</h1>
        <p className="adm-main__sub">
          항목별로 페이지가 나뉘어 있습니다. 왼쪽 상단 탭 또는 아래 카드에서 이동할 수 있습니다.
        </p>
      </header>

      <ul className="adm-settings-hub">
        {HUB_LINKS.map(({ href, title, desc }) => (
          <li key={href} className="adm-settings-hub__item">
            <Link href={href} className="adm-settings-hub__card">
              <span className="adm-settings-hub__title">{title}</span>
              <span className="adm-settings-hub__desc">{desc}</span>
              <span className="adm-settings-hub__cta">설정 열기</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
