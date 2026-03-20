'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ compact = false }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  if (compact) {
    return (
      <button
        type="button"
        className="adm-header__logout"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    );
  }

  return (
    <button
      type="button"
      className="login-modal__submit"
      style={{ marginTop: '1.5rem', maxWidth: '10rem' }}
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
}
