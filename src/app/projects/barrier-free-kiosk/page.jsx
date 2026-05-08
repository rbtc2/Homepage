import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BarrierFreeKioskExplorer from '@/components/projects/BarrierFreeKioskExplorer';

export const metadata = {
  title: '배리어프리 키오스크 지도 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description: '지역별 배리어프리 키오스크 접근성 공익 데이터를 지도와 목록으로 확인합니다.',
};

const MOCK_POINTS = [
  {
    id: 'kiosk-1',
    facilityName: '송파구청 민원실 키오스크',
    region: '서울',
    district: '송파구',
    lat: 37.5145,
    lng: 127.1068,
    facilityType: '공공기관',
    overallScore: 86,
    accessPhysical: 90,
    accessVisual: 80,
    accessHearing: 88,
  },
  {
    id: 'kiosk-2',
    facilityName: '강남구 보건소 안내 키오스크',
    region: '서울',
    district: '강남구',
    lat: 37.5172,
    lng: 127.0473,
    facilityType: '보건',
    overallScore: 79,
    accessPhysical: 82,
    accessVisual: 74,
    accessHearing: 81,
  },
  {
    id: 'kiosk-3',
    facilityName: '수원시청 민원발급 키오스크',
    region: '경기',
    district: '수원시',
    lat: 37.2636,
    lng: 127.0286,
    facilityType: '공공기관',
    overallScore: 72,
    accessPhysical: 77,
    accessVisual: 66,
    accessHearing: 73,
  },
  {
    id: 'kiosk-4',
    facilityName: '부산역 종합안내 키오스크',
    region: '부산',
    district: '동구',
    lat: 35.1151,
    lng: 129.0421,
    facilityType: '교통',
    overallScore: 75,
    accessPhysical: 78,
    accessVisual: 71,
    accessHearing: 76,
  },
];

export default function BarrierFreeKioskPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">공익 데이터 프로젝트</p>
            <h1 className="page-header__title">배리어프리 키오스크 지도</h1>
          </div>
        </div>
        <BarrierFreeKioskExplorer initialPoints={MOCK_POINTS} />
      </main>
      <Footer />
    </>
  );
}
