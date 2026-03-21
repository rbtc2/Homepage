import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '오시는 길 | EJJ 홈페이지',
};

/* 지하철 아이콘 */
function SubwayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="3" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="7.5" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16" r="1" fill="currentColor" stroke="none" />
      <line x1="8" y1="20" x2="6" y2="18" />
      <line x1="16" y1="20" x2="18" y2="18" />
    </svg>
  );
}

/* 버스 아이콘 */
function BusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="15" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="12" y1="3" x2="12" y2="9" />
      <circle cx="7.5" cy="17" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="17" r="1.25" fill="currentColor" stroke="none" />
      <line x1="7.5" y1="18.25" x2="7.5" y2="21" />
      <line x1="16.5" y1="18.25" x2="16.5" y2="21" />
    </svg>
  );
}

/* 핀 아이콘 */
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8.686 2 6 4.686 6 8c0 5 6 14 6 14s6-9 6-14c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2.25" />
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

        {/* 본문 */}
        <div className="dir-wrap">

          {/* ── 지도 + 정보 카드 ── */}
          <section aria-label="위치 및 주소 정보">
            <div className="dir-map">

              {/* 지도 스켈레톤 */}
              <div className="dir-map__frame dir-skeleton" role="img" aria-label="카카오맵 지도 (준비 중)">
                <div className="dir-map__frame-inner" />
                <div className="dir-map__badge" aria-hidden="true">
                  <div className="dir-map__badge-icon">
                    <PinIcon />
                  </div>
                  <span className="dir-map__badge-label">카카오맵 연동 예정</span>
                </div>
              </div>

              {/* 정보 카드 */}
              <div className="dir-info">

                {/* 주소 */}
                <div className="dir-info__row">
                  <p className="dir-info__row-label">주소</p>
                  <div aria-label="주소 정보 준비 중">
                    <div className="dir-info__skel-line dir-skeleton" style={{ width: '100%' }} />
                    <div className="dir-info__skel-line dir-skeleton" />
                  </div>
                </div>

                <hr className="dir-info__divider" />

                {/* 운영시간 */}
                <div className="dir-info__row">
                  <p className="dir-info__row-label">운영시간</p>
                  <div aria-label="운영시간 준비 중">
                    <div className="dir-info__skel-line dir-skeleton" style={{ width: '90%' }} />
                    <div className="dir-info__skel-line dir-skeleton" />
                  </div>
                </div>

                <hr className="dir-info__divider" />

                {/* 전화번호 */}
                <div className="dir-info__row">
                  <p className="dir-info__row-label">전화</p>
                  <div aria-label="전화번호 준비 중">
                    <div className="dir-info__skel-line dir-skeleton" style={{ width: '70%' }} />
                  </div>
                </div>

                <hr className="dir-info__divider" />

                {/* 길찾기 버튼 */}
                <div className="dir-info__actions">
                  <div className="dir-btn--skel dir-skeleton" aria-hidden="true" />
                  <div className="dir-btn--skel dir-skeleton" aria-hidden="true" />
                </div>

              </div>
            </div>
          </section>

          {/* ── 교통 정보 ── */}
          <section aria-label="대중교통 안내">
            <div className="dir-transport">

              <div className="dir-transport__heading">
                <p className="dir-transport__label">대중교통</p>
                <h2 className="dir-transport__title">교통 안내</h2>
              </div>

              <div className="dir-transport__grid">

                {/* 지하철 카드 */}
                <div className="dir-tcard">
                  <div className="dir-tcard__head">
                    <div className="dir-tcard__icon" aria-hidden="true">
                      <SubwayIcon />
                    </div>
                    <h3 className="dir-tcard__name">지하철</h3>
                  </div>
                  <div className="dir-tcard__body">
                    <div className="dir-tcard__item">
                      <span className="dir-tcard__item-label">노선 / 역</span>
                      <div aria-label="지하철 정보 준비 중">
                        <div className="dir-tcard__skel-line dir-tcard__skel-line--mid dir-skeleton" />
                        <div className="dir-tcard__skel-line dir-tcard__skel-line--short dir-skeleton" />
                      </div>
                    </div>
                    <div className="dir-tcard__item">
                      <span className="dir-tcard__item-label">출구 / 도보</span>
                      <div aria-label="출구 및 도보 정보 준비 중">
                        <div className="dir-tcard__skel-line dir-tcard__skel-line--mid dir-skeleton" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 버스 카드 */}
                <div className="dir-tcard">
                  <div className="dir-tcard__head">
                    <div className="dir-tcard__icon" aria-hidden="true">
                      <BusIcon />
                    </div>
                    <h3 className="dir-tcard__name">버스</h3>
                  </div>
                  <div className="dir-tcard__body">
                    <div className="dir-tcard__item">
                      <span className="dir-tcard__item-label">버스 번호</span>
                      <div aria-label="버스 노선 정보 준비 중">
                        <div className="dir-tcard__skel-line dir-tcard__skel-line--mid dir-skeleton" />
                        <div className="dir-tcard__skel-line dir-tcard__skel-line--short dir-skeleton" />
                      </div>
                    </div>
                    <div className="dir-tcard__item">
                      <span className="dir-tcard__item-label">정류장 / 도보</span>
                      <div aria-label="정류장 및 도보 정보 준비 중">
                        <div className="dir-tcard__skel-line dir-tcard__skel-line--mid dir-skeleton" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
