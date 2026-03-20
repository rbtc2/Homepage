import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({ children }) {
  return (
    <div className="adm-layout">
      <header className="adm-header">
        <div className="adm-header__inner">
          <span className="adm-header__brand">EJJ 관리자</span>
          <div className="adm-header__tools">
            <Link href="/admin" className="adm-header__site-link">
              대시보드
            </Link>
            <Link href="/" className="adm-header__site-link">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              사이트 보기
            </Link>
            <LogoutButton compact />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

