import HistoryClient from './HistoryClient';
import { getHistoryEvents } from '@/lib/history';

export const metadata = { title: '연혁 | 사이트 설정 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsHistoryPage() {
  let initialEvents = [];
  try {
    initialEvents = await getHistoryEvents();
  } catch {
    initialEvents = [];
  }

  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">연혁</h1>
        <p className="adm-main__sub">
          단체 소개 연혁 페이지에 보이는 항목을 추가·수정·삭제합니다. 영문은 각 항목의 EN으로 작성합니다. 저장 즉시 반영됩니다.
        </p>
      </header>

      <HistoryClient initialEvents={initialEvents} />
    </>
  );
}
