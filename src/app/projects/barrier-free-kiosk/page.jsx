import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BarrierFreeKioskExplorer from '@/components/projects/BarrierFreeKioskExplorer';

export const metadata = {
  title: '배리어프리 키오스크 데이터 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description: '지역별 배리어프리 키오스크 접근성 공익 데이터를 데이터 패널에서 확인합니다.',
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
    physicalSpace: {
      kneeSpaceHeightCm: 72,
      frontActivityAreaSqm: 1.45,
    },
    operationVisual: {
      wheelchairSeatedReachable: true,
      brailleBlockAdequate: true,
    },
    digitalLanguage: {
      foreignLanguageAccurate: true,
      hasHighContrastMode: true,
      hasLargeTextMode: true,
    },
    voiceAlternative: {
      hasVoiceGuide: true,
      hasVolumeControl: true,
      hasSignLanguageSupport: false,
      hasTextAlternative: true,
      hasRemoteAssist: true,
    },
    interactionManagement: {
      callBellReachable: true,
      staffSupportConfirmed: true,
    },
  },
  {
    id: 'kiosk-2',
    facilityName: '강남구 보건소 안내 키오스크',
    region: '서울',
    district: '강남구',
    lat: 37.5172,
    lng: 127.0473,
    facilityType: '보건',
    physicalSpace: {
      kneeSpaceHeightCm: 69,
      frontActivityAreaSqm: 1.18,
    },
    operationVisual: {
      wheelchairSeatedReachable: true,
      brailleBlockAdequate: false,
    },
    digitalLanguage: {
      foreignLanguageAccurate: true,
      hasHighContrastMode: true,
      hasLargeTextMode: false,
    },
    voiceAlternative: {
      hasVoiceGuide: true,
      hasVolumeControl: true,
      hasSignLanguageSupport: false,
      hasTextAlternative: true,
      hasRemoteAssist: false,
    },
    interactionManagement: {
      callBellReachable: true,
      staffSupportConfirmed: false,
    },
  },
  {
    id: 'kiosk-3',
    facilityName: '수원시청 민원발급 키오스크',
    region: '경기',
    district: '수원시',
    lat: 37.2636,
    lng: 127.0286,
    facilityType: '공공기관',
    physicalSpace: {
      kneeSpaceHeightCm: 67,
      frontActivityAreaSqm: 1.04,
    },
    operationVisual: {
      wheelchairSeatedReachable: true,
      brailleBlockAdequate: false,
    },
    digitalLanguage: {
      foreignLanguageAccurate: false,
      hasHighContrastMode: true,
      hasLargeTextMode: false,
    },
    voiceAlternative: {
      hasVoiceGuide: true,
      hasVolumeControl: false,
      hasSignLanguageSupport: false,
      hasTextAlternative: true,
      hasRemoteAssist: false,
    },
    interactionManagement: {
      callBellReachable: false,
      staffSupportConfirmed: true,
    },
  },
  {
    id: 'kiosk-4',
    facilityName: '부산역 종합안내 키오스크',
    region: '부산',
    district: '동구',
    lat: 35.1151,
    lng: 129.0421,
    facilityType: '교통',
    physicalSpace: {
      kneeSpaceHeightCm: 68,
      frontActivityAreaSqm: 1.1,
    },
    operationVisual: {
      wheelchairSeatedReachable: true,
      brailleBlockAdequate: true,
    },
    digitalLanguage: {
      foreignLanguageAccurate: true,
      hasHighContrastMode: false,
      hasLargeTextMode: true,
    },
    voiceAlternative: {
      hasVoiceGuide: true,
      hasVolumeControl: true,
      hasSignLanguageSupport: false,
      hasTextAlternative: false,
      hasRemoteAssist: true,
    },
    interactionManagement: {
      callBellReachable: true,
      staffSupportConfirmed: false,
    },
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
            <h1 className="page-header__title">배리어프리 키오스크 데이터</h1>
          </div>
        </div>
        <BarrierFreeKioskExplorer initialPoints={MOCK_POINTS} />
      </main>
      <Footer />
    </>
  );
}
