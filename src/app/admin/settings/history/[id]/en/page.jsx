import { notFound } from 'next/navigation';
import { getHistoryEventById } from '@/lib/history';
import HistoryEnglishForm from '../../HistoryEnglishForm';

export const metadata = { title: '연혁 영문 | 사이트 설정 | 관리자' };
export const dynamic = 'force-dynamic';

export default async function AdminHistoryEnglishPage({ params }) {
  const { id } = await params;
  const event = await getHistoryEventById(id);
  if (!event) notFound();

  const hasEnglish = Boolean(event.hasEnglish);

  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">{hasEnglish ? '연혁 영문 수정' : '연혁 영문 작성'}</h1>
        <p className="adm-main__sub">
          한국어 연혁은 그대로 두고, 영문 사이트에 보일 내용만 작성합니다.
        </p>
      </header>

      <HistoryEnglishForm event={event} />
    </>
  );
}
