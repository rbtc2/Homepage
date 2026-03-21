import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '함께하는 사람들 | EJJ 홈페이지',
};

/* 사람 실루엣 아이콘 */
function PersonSilhouette() {
  return (
    <div className="pp-person__photo-icon" aria-hidden="true">
      <svg viewBox="0 0 48 60" fill="none">
        <circle cx="24" cy="16" r="12" fill="currentColor" opacity="0.35" />
        <path
          d="M2 54c0-12.15 9.85-22 22-22h0c12.15 0 22 9.85 22 22"
          stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"
          fill="none" opacity="0.25"
        />
      </svg>
    </div>
  );
}

/* 샘플 인원 수: 이사 4명 */
const BOARD_COUNT = 4;

/* 샘플 파트너 수: 8개 */
const PARTNER_COUNT = 8;

export default function PeoplePage() {
  return (
    <>
      <Header />
      <main role="main">

        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">함께하는 사람들</h1>
          </div>
        </div>

        <div className="pp-wrap">

          {/* ── 이사회 ── */}
          <section className="pp-section" aria-label="이사회">
            <div className="pp-section__header">
              <p className="pp-section__eyebrow">Board</p>
              <h2 className="pp-section__title">이사회</h2>
              <hr className="pp-section__rule" />
            </div>

            <ul className="pp-board" aria-label="이사회 구성원 (준비 중)">
              {Array.from({ length: BOARD_COUNT }, (_, i) => (
                <li key={i} className="pp-person">
                  <div
                    className="pp-person__photo"
                    role="img"
                    aria-label="프로필 사진 준비 중"
                  >
                    <PersonSilhouette />
                  </div>
                  <div className="pp-person__meta" aria-hidden="true">
                    <span className="pp-person__name pp-skel" />
                    <span className="pp-person__role pp-skel" />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ── 파트너 ── */}
          <section className="pp-section" aria-label="파트너">
            <div className="pp-section__header">
              <p className="pp-section__eyebrow">Partners</p>
              <h2 className="pp-section__title">파트너</h2>
              <hr className="pp-section__rule" />
            </div>

            <ul className="pp-partners" aria-label="파트너사 로고 (준비 중)">
              {Array.from({ length: PARTNER_COUNT }, (_, i) => (
                <li key={i} className="pp-logo">
                  <div className="pp-logo__inner" aria-hidden="true">
                    <span className="pp-logo__bar pp-logo__bar--wide" />
                    <span className="pp-logo__bar pp-logo__bar--mid" />
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
