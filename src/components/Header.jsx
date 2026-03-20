'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginModal from '@/components/LoginModal';

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
    <header className="header" role="banner">
      <div className="header__inner">
        <Link href="/" className="header__brand" aria-label="홈으로 이동">
          <img
            className="header__logo"
            src="/images/logo-sample.svg"
            width="32"
            height="32"
            alt=""
            decoding="async"
          />
          <span className="header__wordmark">EJJ</span>
        </Link>

        <nav className="header__nav" aria-label="주 메뉴">
          <ul className="header__nav-grid">
            <li className="header__nav-cell">
              <a href="#" className="header__nav-item">조직 소개</a>
              <div className="header__mega-col" role="group" aria-label="조직 소개 하위 메뉴">
                <ul className="header__mega-list">
                  <li><Link href="/about" className="header__mega-link">소개</Link></li>
                  <li><Link href="/greeting" className="header__mega-link">인사말</Link></li>
                  <li><Link href="/history" className="header__mega-link">연혁</Link></li>
                  <li><Link href="/people" className="header__mega-link">함께하는 사람들</Link></li>
                  <li><Link href="/directions" className="header__mega-link">오시는 길</Link></li>
                </ul>
              </div>
            </li>
            <li className="header__nav-cell">
              <a href="#" className="header__nav-item">조직 사업</a>
              <div className="header__mega-col" role="group" aria-label="조직 사업 하위 메뉴">
                <ul className="header__mega-list">
                  <li><a href="#" className="header__mega-link">임시메뉴1</a></li>
                  <li><a href="#" className="header__mega-link">임시메뉴2</a></li>
                  <li><a href="#" className="header__mega-link">임시메뉴3</a></li>
                </ul>
              </div>
            </li>
            <li className="header__nav-cell">
              <a href="#" className="header__nav-item">조직 활동</a>
              <div className="header__mega-col" role="group" aria-label="조직 활동 하위 메뉴">
                <ul className="header__mega-list">
                  <li><a href="#" className="header__mega-link">임시메뉴1</a></li>
                  <li><a href="#" className="header__mega-link">임시메뉴2</a></li>
                  <li><a href="#" className="header__mega-link">임시메뉴3</a></li>
                </ul>
              </div>
            </li>
            <li className="header__nav-cell">
              <a href="#" className="header__nav-item">나의 기부</a>
              <div className="header__mega-col" role="group" aria-label="나의 기부 하위 메뉴">
                <ul className="header__mega-list">
                  <li><a href="#" className="header__mega-link">임시메뉴1</a></li>
                  <li><a href="#" className="header__mega-link">임시메뉴2</a></li>
                  <li><a href="#" className="header__mega-link">임시메뉴3</a></li>
                </ul>
              </div>
            </li>
            <li className="header__nav-cell">
              <a href="#" className="header__nav-item">커뮤니티</a>
              <div className="header__mega-col" role="group" aria-label="커뮤니티 하위 메뉴">
                <ul className="header__mega-list">
                  <li><Link href="/notices" className="header__mega-link">공지사항</Link></li>
                  <li><Link href="/disclosures" className="header__mega-link">공시자료</Link></li>
                  <li><Link href="/archive" className="header__mega-link">자료실</Link></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        <div className="header__tools">
          <button
            type="button"
            className="header__action header__action--login"
            id="login-open-btn"
            onClick={() => setIsLoginOpen(true)}
            aria-haspopup="dialog"
            aria-controls="login-dialog"
            aria-expanded={isLoginOpen ? 'true' : 'false'}
            aria-label="로그인 창 열기"
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
            <span className="header__action-text">로그인</span>
          </button>
          <button
            type="button"
            className="header__lang-pill is-skeleton"
            aria-label="영문 사이트 (준비 중)"
            aria-disabled="true"
          >
            <span className="header__lang-pill-text">ENG</span>
          </button>
        </div>
      </div>
    </header>
    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
