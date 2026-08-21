'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyBoardSecretPassword } from '@/lib/verify-board-secret';

/**
 * 비밀글 비밀번호 입력 게이트 (게시판 공통)
 * @param {{ board: string, id: string | number, locale?: 'ko'|'en' }} props
 */
const GATE_UI = {
  ko: {
    aria: '비밀글 확인',
    title: '비밀 게시글입니다',
    desc: '게시글 비밀번호를 입력하면 내용을 볼 수 있습니다.',
    placeholder: '비밀번호 입력',
    submit: '확인',
    pending: '확인 중...',
    hint: '작성자가 설정한 비밀번호로만 열람할 수 있습니다.',
    fail: '비밀번호 확인에 실패했습니다.',
  },
  en: {
    aria: 'Private post',
    title: 'This post is private',
    desc: 'Enter the password to view this post.',
    placeholder: 'Password',
    submit: 'Unlock',
    pending: 'Checking...',
    hint: 'Only the password set by the author will open this post.',
    fail: 'Could not verify the password.',
  },
};

export default function SecretPostGate({ board, id, locale = 'ko' }) {
  const ui = GATE_UI[locale] ?? GATE_UI.ko;
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    startTransition(async () => {
      try {
        const result = await verifyBoardSecretPassword({ board, id, password });
        if (!result.ok) {
          setErrorMessage(result.error ?? ui.fail);
          return;
        }
        router.refresh();
      } catch {
        setErrorMessage(ui.fail);
      }
    });
  };

  return (
    <section className="nd-secret" aria-label={ui.aria}>
      <div className="nd-secret__head">
        <span className="nd-secret__icon" aria-hidden="true">
          🔒
        </span>
        <h2 className="nd-secret__title">{ui.title}</h2>
      </div>
      <p className="nd-secret__desc">{ui.desc}</p>
      <form className="nd-secret__form" onSubmit={onSubmit}>
        <input
          type="password"
          className="nd-secret__input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={ui.placeholder}
          autoComplete="current-password"
          maxLength={100}
          required
        />
        <button type="submit" className="nd-secret__btn" disabled={isPending}>
          {isPending ? ui.pending : ui.submit}
        </button>
      </form>
      <p className="nd-secret__hint">{ui.hint}</p>
      {errorMessage ? <p className="nd-secret__error">{errorMessage}</p> : null}
    </section>
  );
}
