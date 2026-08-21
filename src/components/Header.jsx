'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from '@/components/LoginModal';
import {
  HEADER_UI,
  NAV_ITEMS,
  homeHref,
  hrefForNavItem,
  toEnPath,
  toKoPath,
} from '@/lib/i18n';

export default function Header({ locale = 'ko' }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ui = HEADER_UI[locale] ?? HEADER_UI.ko;
  const langHref = locale === 'en' ? toKoPath(pathname) : toEnPath(pathname);

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setIsAdmin(false);
    router.refresh();
  };

  return (
    <>
    <header className="header" role="banner">
      <div className="header__inner">
        <Link href={homeHref(locale)} className="header__brand" aria-label={ui.homeAria}>
          <img
            className="header__logo"
            src="/images/ci-logo.svg"
            width="329"
            height="51"
            alt=""
            decoding="async"
          />
        </Link>

        <nav className="header__nav" aria-label={ui.navAria}>
          <ul className="header__nav-grid">
            {NAV_ITEMS.map((section) => {
              const sectionLabel = section.label[locale];
              return (
                <li key={section.id} className="header__nav-cell">
                  <a href="#" className="header__nav-item">
                    {sectionLabel}
                  </a>
                  <div
                    className="header__mega-col"
                    role="group"
                    aria-label={`${sectionLabel} ${ui.submenuSuffix}`}
                  >
                    <ul className="header__mega-list">
                      {section.children.map((item) => {
                        const href = hrefForNavItem(item, locale);
                        const label = item.label[locale];
                        if (href === '#') {
                          return (
                            <li key={`${section.id}-${item.label.ko}`}>
                              <a href="#" className="header__mega-link">
                                {label}
                              </a>
                            </li>
                          );
                        }
                        return (
                          <li key={href}>
                            <Link href={href} className="header__mega-link">
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header__tools">
          {isAdmin ? (
            <>
              <Link href="/admin" className="header__action">
                <svg
                  className="header__glyph"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <span className="header__action-text">{ui.admin}</span>
              </Link>
              <button
                type="button"
                className="header__action"
                onClick={handleLogout}
                aria-label={ui.logoutAria}
              >
                <svg
                  className="header__glyph"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="header__action-text">{ui.logout}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="header__action header__action--login"
              id="login-open-btn"
              onClick={() => setIsLoginOpen(true)}
              aria-haspopup="dialog"
              aria-controls="login-dialog"
              aria-expanded={isLoginOpen ? 'true' : 'false'}
              aria-label={ui.loginAria}
            >
              <svg
                className="header__glyph"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span className="header__action-text">{ui.login}</span>
            </button>
          )}
          <Link
            href={langHref}
            className="header__lang-pill"
            aria-label={ui.langAria}
            hrefLang={locale === 'en' ? 'ko' : 'en'}
          >
            <span className="header__lang-pill-text">{ui.langLabel}</span>
          </Link>
        </div>
      </div>
    </header>
    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
