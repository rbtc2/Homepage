'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginModal({ isOpen, onClose }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const closeBtnRef = useRef(null);
  const router = useRouter();

  const canSubmit = Boolean(id.trim() && password) && !isLoading;

  // 모달 열릴 때 스크롤 잠금 + 포커스 이동 + 필드 초기화
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeBtnRef.current?.focus({ preventScroll: true });
      setError('');
      setId('');
      setPassword('');
    } else {
      document.body.style.overflow = '';
      document.getElementById('login-open-btn')?.focus({ preventScroll: true });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim(), password }),
      });
      const data = await res.json();

      if (data.ok) {
        onClose();
        router.push('/admin');
        return;
      }

      setError(data.message || '아이디/비밀번호가 올바르지 않습니다.');
    } catch {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal" aria-hidden="false">
      <div
        className="login-modal__backdrop"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        className="login-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        id="login-dialog"
      >
        <button
          type="button"
          ref={closeBtnRef}
          className="login-modal__close"
          onClick={onClose}
          aria-label="로그인 창 닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="login-modal__title" id="login-modal-title">로그인</h2>
        <p className="login-modal__hint">아이디와 비밀번호를 입력해 로그인해 주세요.</p>
        {error && (
          <p className="login-modal__error" role="alert">{error}</p>
        )}
        <form className="login-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="login-modal__field">
            <label className="login-modal__label" htmlFor="login-modal-email">아이디</label>
            <input
              className="login-modal__input"
              id="login-modal-email"
              name="id"
              type="text"
              autoComplete="username"
              placeholder="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="login-modal__field">
            <label className="login-modal__label" htmlFor="login-modal-password">비밀번호</label>
            <input
              className="login-modal__input"
              id="login-modal-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="login-modal__submit"
            disabled={!canSubmit}
            aria-disabled={!canSubmit ? 'true' : 'false'}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
