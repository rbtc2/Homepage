import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '함께하는 사람들 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

/* 샘플 파트너 수: 8개 */
const PARTNER_COUNT = 8;

const ORG_CHART_CAPTION =
  '조직도: 총회 아래 이사회, 이사회에서 자문위원·감사로 분기하며, 이사회 아래 대표와 사무국이 연결됩니다.';

const ORG_VARIANT_SAMPLES = [
  { id: 'a', label: 'A', note: '카드형 · 현행' },
  { id: 'b', label: 'B', note: '에디토리얼 · 라인' },
  { id: 'c', label: 'C', note: '브랜드 · 계층 강조' },
];

function OrgCell({ children, branch = false }) {
  return (
    <div className={`pp-org__cell${branch ? ' pp-org__cell--branch' : ' pp-org__cell--spine'}`}>
      {children}
    </div>
  );
}

function PeopleOrgChart({ variant = 'a', hideCaption = false }) {
  return (
    <figure className={`pp-org pp-org--${variant}`}>
      {!hideCaption ? (
        <figcaption className="pp-org__caption">{ORG_CHART_CAPTION}</figcaption>
      ) : null}
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

function PeopleOrgChartSamples() {
  return (
    <div className="pp-org-samples" aria-describedby="pp-org-samples-desc">
      <p id="pp-org-samples-desc" className="pp-org-samples__desc">
        조직도 디자인 샘플입니다. 마음에 드는 안을 알려주시면 나머지는 제거하겠습니다.
      </p>
      <ul className="pp-org-samples__grid">
        {ORG_VARIANT_SAMPLES.map(({ id, label, note }) => (
          <li key={id} className="pp-org-samples__item">
            <div className="pp-org-samples__meta">
              <span className="pp-org-samples__tag">{label}</span>
              <span className="pp-org-samples__note">{note}</span>
            </div>
            <PeopleOrgChart variant={id} hideCaption />
          </li>
        ))}
      </ul>
    </div>
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
            <PeopleOrgChartSamples />
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
