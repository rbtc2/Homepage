'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

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
