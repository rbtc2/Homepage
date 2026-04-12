'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SETTINGS_NAV = [
  { href: '/admin/settings/account', label: '관리자 계정' },
  { href: '/admin/settings', label: '개요', exact: true },
  { href: '/admin/settings/site', label: '사이트 기본 정보' },
  { href: '/admin/settings/home', label: '홈페이지 노출' },
];

export default function SettingsLayoutClient({ children }) {
  const pathname = usePathname();

  return (
    <main className="adm-main">
      <div className="adm-main__inner adm-settings">
        <nav className="adm-settings-nav" aria-label="설정 하위 메뉴">
          <ul className="adm-settings-nav__list">
            {SETTINGS_NAV.map(({ href, label, exact }) => {
              const isActive = exact
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href} className="adm-settings-nav__item">
                  <Link
                    href={href}
                    className={`adm-settings-nav__link${isActive ? ' adm-settings-nav__link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="adm-settings__notice" role="status">
          「사이트 기본 정보」는 저장 시 반영됩니다. 「홈페이지 노출」 등 일부 메뉴는 아직 준비 중일 수 있습니다.
        </p>

        {children}
      </div>
    </main>
  );
}
