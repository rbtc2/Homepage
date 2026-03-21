import PopupsClient from './PopupsClient';

export const metadata = { title: '팝업 관리 | 관리자' };
export const dynamic = 'force-dynamic';

// TODO: 실제 구현 시 DB에서 팝업 목록을 조회합니다.
const DUMMY_POPUPS = [
  {
    id: 1,
    title: '신년 이벤트 안내',
    imageUrl: '',
    linkUrl: '/notices/1',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    position: 'center',
    showCloseForDay: true,
    isActive: false,
    createdAt: '2025-12-28',
  },
  {
    id: 2,
    title: '서비스 점검 안내 팝업',
    imageUrl: '',
    linkUrl: '',
    startDate: '2026-03-20',
    endDate: '2026-03-21',
    position: 'center',
    showCloseForDay: false,
    isActive: false,
    createdAt: '2026-03-19',
  },
  {
    id: 3,
    title: '봄맞이 프로모션',
    imageUrl: '',
    linkUrl: '/archive/5',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    position: 'bottom-left',
    showCloseForDay: true,
    isActive: false,
    createdAt: '2026-03-21',
  },
];

export default async function AdminPopupsPage() {
  return <PopupsClient initialPopups={DUMMY_POPUPS} />;
}
