import LogoutButton from '@/components/LogoutButton';

export const metadata = {
  title: '관리자 페이지',
};

export default function AdminPage() {
  return (
    <main className="main" role="main">
      <div className="main__surface">
        <h1 className="main__lead">관리자 페이지</h1>
        <p className="main__note">관리자 전용 영역입니다.</p>
        <LogoutButton />
      </div>
    </main>
  );
}
