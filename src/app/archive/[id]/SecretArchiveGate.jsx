'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyArchiveSecretPassword } from './actions';

export default function SecretArchiveGate({ id }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    startTransition(async () => {
      try {
        await verifyArchiveSecretPassword({ id, password });
        router.refresh();
      } catch (error) {
        setErrorMessage(error?.message ?? '비밀번호 확인에 실패했습니다.');
      }
    });
  };

  return (
    <section className="nd-secret" aria-label="비밀글 확인">
      <div className="nd-secret__head">
        <span className="nd-secret__icon" aria-hidden="true">
          🔒
        </span>
        <h2 className="nd-secret__title">비밀 게시글입니다</h2>
      </div>
      <p className="nd-secret__desc">게시글 비밀번호를 입력하면 내용을 볼 수 있습니다.</p>
      <form className="nd-secret__form" onSubmit={onSubmit}>
        <input
          type="password"
          className="nd-secret__input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호 입력"
          autoComplete="current-password"
          maxLength={100}
          required
        />
        <button type="submit" className="nd-secret__btn" disabled={isPending}>
          {isPending ? '확인 중...' : '확인'}
        </button>
      </form>
      <p className="nd-secret__hint">작성자가 설정한 비밀번호로만 열람할 수 있습니다.</p>
      {errorMessage && <p className="nd-secret__error">{errorMessage}</p>}
    </section>
  );
}
