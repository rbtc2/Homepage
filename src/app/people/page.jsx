import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '함께하는 사람들 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

/* 샘플 파트너 수: 8개 */
const PARTNER_COUNT = 8;

function OrgCell({ children, branch = false }) {
  return (
    <div className={`pp-org__cell${branch ? ' pp-org__cell--branch' : ' pp-org__cell--spine'}`}>
      {children}
    </div>
  );
}

function PeopleOrgChart() {
  return (
    <figure className="pp-org">
      <figcaption className="pp-org__caption">
        조직도: 총회 아래 이사회, 이사회에서 자문위원·감사로 분기하며, 이사회 아래 대표와
        사무국이 연결됩니다.
      </figcaption>
      <div className="pp-org__chart" role="presentation">
        <OrgCell>총회</OrgCell>
        <span className="pp-org__v" aria-hidden="true" />
        <OrgCell>이사회</OrgCell>
        <span className="pp-org__v" aria-hidden="true" />

        <div className="pp-org__fork" role="presentation">
          <div className="pp-org__fork-side pp-org__fork-side--left">
            <span className="pp-org__h" aria-hidden="true" />
            <OrgCell branch>자문위원</OrgCell>
          </div>
          <span className="pp-org__fork-spine" aria-hidden="true" />
          <div className="pp-org__fork-side pp-org__fork-side--right">
            <span className="pp-org__h" aria-hidden="true" />
            <OrgCell branch>감사</OrgCell>
          </div>
        </div>

        <span className="pp-org__v" aria-hidden="true" />
        <OrgCell>대표</OrgCell>
        <span className="pp-org__v" aria-hidden="true" />
        <OrgCell>사무국</OrgCell>
      </div>
    </figure>
  );
}

export default function PeoplePage() {
  return (
    <>
      <Header />
      <main role="main">

        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">단체 소개</p>
            <h1 className="page-header__title">함께하는 사람들</h1>
          </div>
        </div>

        <div className="pp-wrap">

          {/* ── 조직도 ── */}
          <section className="pp-section" aria-labelledby="pp-org-heading">
            <div className="pp-section__header">
              <p className="pp-section__eyebrow">Organization</p>
              <h2 id="pp-org-heading" className="pp-section__title">조직도</h2>
              <hr className="pp-section__rule" />
            </div>
            <PeopleOrgChart />
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
