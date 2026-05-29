import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '함께하는 사람들 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

/* 샘플 파트너 수: 8개 */
const PARTNER_COUNT = 8;

function PeopleOrgChart() {
  return (
    <figure className="pp-org">
      <figcaption className="pp-org__caption">
        조직도: 총회, 이사회, 자문위원, 감사, 대표, 사무국으로 구성됩니다.
      </figcaption>
      <div className="pp-org__chart" role="presentation">
        <div className="pp-org__cell pp-org__cell--spine pp-org__cell--r1">총회</div>
        <span className="pp-org__v pp-org__v--spine pp-org__v--r2" aria-hidden="true" />
        <div className="pp-org__cell pp-org__cell--spine pp-org__cell--r3">이사회</div>
        <span className="pp-org__v pp-org__v--spine pp-org__v--r4" aria-hidden="true" />

        <div className="pp-org__cell pp-org__cell--peer-a">자문위원</div>
        <span className="pp-org__h pp-org__h--ab" aria-hidden="true" />
        <div className="pp-org__cell pp-org__cell--peer-b">감사</div>
        <span className="pp-org__h pp-org__h--bc" aria-hidden="true" />
        <div className="pp-org__cell pp-org__cell--spine pp-org__cell--r5">대표</div>

        <span className="pp-org__v pp-org__v--spine pp-org__v--r6" aria-hidden="true" />
        <div className="pp-org__cell pp-org__cell--spine pp-org__cell--r7">사무국</div>
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
