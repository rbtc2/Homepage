import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '오시는 길 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

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
              <iframe
                className="dr-map__iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d305.1195750166032!2d127.1241937522581!3d37.49543801957223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca594990dc2a3%3A0x99ea44589ae949ba!2z67Cx7JWU67mM65Sp!5e0!3m2!1sko!2skr!4v1775349506118!5m2!1sko!2skr"
                title="오시는 길 지도"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
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
                    <p className="dr-address__value">서울특별시 송파구 중대로 150 백암빌딩 6층 602-A23호</p>
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
                    <span className="dr-contact__val">070-8018-9232</span>
                  </li>
                  <li className="dr-contact__item">
                    <span className="dr-contact__sub">팩스</span>
                    <span className="dr-contact__val">0504-287-7334</span>
                  </li>
                  <li className="dr-contact__item">
                    <span className="dr-contact__sub">운영시간</span>
                    <span className="dr-contact__val">평일 08:30 ~ 17:30</span>
                    <span className="dr-contact__val dr-contact__val--note">토·일·공휴일 휴무</span>
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
                  <div className="dr-trow__details" aria-label="지하철 안내">
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">노선 / 역</span>
                      <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                        지하철{' '}
                        <span className="dr-line-badge dr-line-badge--3" title="3호선">
                          3
                        </span>
                        호선 경찰병원역
                      </p>
                    </div>
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">출구 / 도보</span>
                      <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                        3번 출구로 나와 우측으로 도보 약 1분 거리에 있습니다.
                      </p>
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
