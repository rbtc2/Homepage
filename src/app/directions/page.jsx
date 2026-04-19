import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '오시는 길 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

/** 방문·우편용 전체 도로명 주소 */
const DR_ROAD_ADDRESS =
  '서울특별시 송파구 중대로 150 백암빌딩 6층 602-A23호';

/** 임베드 지도와 동일한 핀 (주소 문구만으로는 핀이 어긋날 수 있어 좌표 사용) */
const DR_MAP_COORDS = '37.49546910000825,127.11954328360882';

const DR_MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DR_MAP_COORDS)}`;
const DR_MAP_PLACE_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DR_MAP_COORDS)}`;

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
            <p className="page-header__label">단체 소개</p>
            <h1 className="page-header__title">오시는 길</h1>
          </div>
        </div>

        <div className="dr-wrap">

          {/* ── 지도 ── */}
          <section aria-label="지도">
            <div className="dr-map">
              <iframe
                className="dr-map__iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.527752832191!2d127.11954328360882!3d37.49546910000825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca57c8ccde613%3A0x26de1cb60c14b30a!2z6rWt7KCc7J246raM7Jew64yAIOyblOuTnOudvOydtOy4oA!5e0!3m2!1sko!2skr!4v1776595143300!5m2!1sko!2skr"
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
                    <p className="dr-address__value">{DR_ROAD_ADDRESS}</p>
                  </div>
                </div>
                <div className="dr-address__actions">
                  <a
                    className="dr-cta dr-cta--fill"
                    href={DR_MAP_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google 지도에서 길찾기. 새 창으로 열립니다."
                  >
                    길찾기
                  </a>
                  <a
                    className="dr-cta dr-cta--ghost"
                    href={DR_MAP_PLACE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google 지도에서 위치 보기. 새 창으로 열립니다."
                  >
                    지도
                  </a>
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
                  <div className="dr-trow__details" aria-label="버스 안내">
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">버스 번호</span>
                      <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                        간선 301번, 간선 401번, 지선 3319번
                      </p>
                    </div>
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">정류장 / 도보</span>
                      <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                        경찰병원역 앞 하차 후 도보 약 200m
                      </p>
                    </div>
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">버스 번호</span>
                      <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                        지선 3322번, 지선 3416번
                      </p>
                    </div>
                    <div className="dr-trow__detail">
                      <span className="dr-trow__detail-key">정류장 / 도보</span>
                      <p className="dr-trow__detail-val" style={{ margin: 0 }}>
                        경찰병원역 앞 하차 후 도보 약 250m
                      </p>
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
