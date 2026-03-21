import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '오시는 길 | EJJ 홈페이지',
};

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

function SubwayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="13" rx="2.5" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" />
      <circle cx="8" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <line x1="9" y1="19" x2="7" y2="16.5" />
      <line x1="15" y1="19" x2="17" y2="16.5" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="2" width="18" height="15" rx="2.5" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="12" y1="2" x2="12" y2="8" />
      <circle cx="7.5" cy="19" r="1.5" />
      <circle cx="16.5" cy="19" r="1.5" />
      <line x1="7.5" y1="17" x2="7.5" y2="17" />
      <path d="M5 17H3v-2h18v2h-2" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: '0.8125rem', height: '0.8125rem' }}>
      <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7.5 8.5" />
    </svg>
  );
}

export default function DirectionsPage() {
  return (
    <>
      <Header />
      <main role="main">

        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">오시는 길</h1>
          </div>
        </div>

        <div className="dr-wrap">

          {/* ── 지도 ── */}
          <section aria-label="지도">
            <div className="dr-map">
              {/*
                카카오맵 연동 시 이 영역을 대체:
                <iframe
                  className="dr-map__iframe"
                  src="https://map.kakao.com/link/map/..."
                  title="오시는 길 지도"
                />
              */}
              <div className="dr-map__overlay" role="img" aria-label="카카오맵 지도 (준비 중)">
                <div className="dr-map__pin">
                  <PinIcon />
                </div>
                <span className="dr-map__note">카카오맵 연동 예정</span>
              </div>
            </div>
          </section>

          {/* ── 위치 정보 패널 ── */}
          <section aria-label="주소 및 연락처">
            <div className="dr-info-panel">

              {/* 주소 */}
              <div className="dr-address">
                <p className="dr-address__eyebrow">Location</p>
                <div className="dr-address__main">
                  <div>
                    <p className="dr-address__label">도로명 주소</p>
                    <div aria-label="주소 준비 중">
                      <span className="dr-address__skel-line dr-skel" style={{ width: '100%', display: 'block' }} />
                      <span className="dr-address__skel-line dr-skel" style={{ width: '65%', display: 'block', marginTop: '0.375rem' }} />
                    </div>
                  </div>
                </div>
                <div className="dr-address__actions">
                  <span className="dr-cta--skel dr-skel" aria-hidden="true" style={{ display: 'inline-block' }} />
                  <span className="dr-cta--skel dr-skel" aria-hidden="true" style={{ display: 'inline-block', width: '6.5rem' }} />
                </div>
              </div>

              {/* 세로 구분선 */}
              <div className="dr-info-divider" aria-hidden="true" />

              {/* 연락처 */}
              <div className="dr-contact">
                <p className="dr-contact__eyebrow">Contact</p>
                <ul className="dr-contact__list">
                  <li className="dr-contact__item">
                    <span className="dr-contact__sub">전화</span>
                    <span className="dr-contact__skel dr-skel" style={{ width: '55%', marginTop: '0.25rem' }} />
                  </li>
                  <li className="dr-contact__item">
                    <span className="dr-contact__sub">팩스</span>
                    <span className="dr-contact__skel dr-skel" style={{ width: '55%', marginTop: '0.25rem' }} />
                  </li>
                  <li className="dr-contact__item">
                    <span className="dr-contact__sub">운영시간</span>
                    <span className="dr-contact__skel dr-skel" style={{ width: '80%', marginTop: '0.25rem' }} />
                    <span className="dr-contact__skel dr-skel" style={{ width: '50%', marginTop: '0.375rem' }} />
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* ── 교통 정보 ── */}
          <section aria-label="대중교통 안내">
            <div className="dr-transport">

              <div className="dr-transport__header">
                <p className="dr-transport__eyebrow">대중교통</p>
                <hr className="dr-transport__rule" />
              </div>

              <ul className="dr-transport__list">

                {/* 지하철 */}
                <li className="dr-trow">
                  <div className="dr-trow__icon">
                    <SubwayIcon />
                  </div>
                  <h3 className="dr-trow__name">지하철</h3>
                  <div className="dr-trow__details" aria-label="지하철 안내 준비 중">
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">노선 / 역</span>
                      <div>
                        <span className="dr-trow__skel-val dr-trow__skel-val--wide dr-skel" style={{ display: 'block' }} />
                        <span className="dr-trow__skel-val dr-trow__skel-val--short dr-skel" style={{ display: 'block', marginTop: '0.35rem' }} />
                      </div>
                    </div>
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">출구 / 도보</span>
                      <span className="dr-trow__skel-val dr-trow__skel-val--wide dr-skel" style={{ display: 'block' }} />
                    </div>
                  </div>
                </li>

                {/* 버스 */}
                <li className="dr-trow">
                  <div className="dr-trow__icon">
                    <BusIcon />
                  </div>
                  <h3 className="dr-trow__name">버스</h3>
                  <div className="dr-trow__details" aria-label="버스 안내 준비 중">
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">버스 번호</span>
                      <div>
                        <span className="dr-trow__skel-val dr-trow__skel-val--wide dr-skel" style={{ display: 'block' }} />
                        <span className="dr-trow__skel-val dr-trow__skel-val--short dr-skel" style={{ display: 'block', marginTop: '0.35rem' }} />
                      </div>
                    </div>
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">정류장 / 도보</span>
                      <span className="dr-trow__skel-val dr-trow__skel-val--wide dr-skel" style={{ display: 'block' }} />
                    </div>
                  </div>
                </li>

              </ul>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
