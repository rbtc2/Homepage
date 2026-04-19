import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '소개 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

const VISION_ITEMS = [
  {
    id: 'vision-diversity',
    index: '01',
    titleKo: '다름과 가능성',
    titleEn: 'Possibility',
    description: '다름이 가능성이 되는 일상',
  },
  {
    id: 'vision-agency',
    index: '02',
    titleKo: '삶의 주체',
    titleEn: 'Agency',
    description: '누구나 자기 삶의 주인이 되는 사회',
  },
  {
    id: 'vision-rights',
    index: '03',
    titleKo: '인권의 상식',
    titleEn: 'Common sense',
    description: '인권이 상식이 되는 사회',
  },
];

const CORE_VALUES = [
  {
    id: 'solidarity',
    index: '01',
    titleKo: '연대',
    titleEn: 'Solidarity',
    description: '권리의 언어를 함께 만들고, 함께 전합니다.',
  },
  {
    id: 'agency',
    index: '02',
    titleKo: '주체',
    titleEn: 'Agency',
    description: '모든 사람은 자기 삶을 스스로 써나갈 힘이 있습니다.',
  },
  {
    id: 'inclusion',
    index: '03',
    titleKo: '포용',
    titleEn: 'Inclusion',
    description: '다름은 고쳐야 할 것이 아니라, 함께 살아갈 방식입니다.',
  },
  {
    id: 'pioneer',
    index: '04',
    titleKo: '개척',
    titleEn: 'Pioneer',
    description: '권리가 닿지 않는 곳을 먼저 찾아갑니다.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main role="main">

        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">단체 소개</p>
            <h1 className="page-header__title">소개</h1>
          </div>
        </div>

        <div className="ab-wrap">

          {/* ── 미션 (타이포: 회원가입 su-prose__lead와 동일 문법) ── */}
          <section className="ab-section" aria-labelledby="mission-heading">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">Mission</p>
              <h2 id="mission-heading" className="ab-section__title">
                미션
              </h2>
              <hr className="ab-section__rule" />
            </div>
            <p className="ab-mission-lead">
              월드라이츠는 <span className="ab-mission-lead__emph">권리의 언어가 닿지 않는 곳</span>에 먼저 갑니다.
            </p>
          </section>

          {/* ── 비전 ── */}
          <section className="ab-section" aria-labelledby="vision-heading">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">Vision</p>
              <h2 id="vision-heading" className="ab-section__title">
                비전
              </h2>
              <hr className="ab-section__rule" />
            </div>
            <ul className="ab-values" lang="ko">
              {VISION_ITEMS.map((v) => (
                <li key={v.id} className="ab-values__item">
                  <article className="ab-value-card" aria-labelledby={`ab-vision-title-${v.id}`}>
                    <span className="ab-value-card__index" aria-hidden="true">
                      {v.index}
                    </span>
                    <div className="ab-value-card__main">
                      <h3 id={`ab-vision-title-${v.id}`} className="ab-value-card__title">
                        {v.titleKo}{' '}
                        <span className="ab-value-card__en" lang="en" translate="no">
                          ({v.titleEn})
                        </span>
                      </h3>
                      <p className="ab-value-card__desc">{v.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          {/* ── 핵심가치 ── */}
          <section className="ab-section" aria-labelledby="values-heading">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">Core Value</p>
              <h2 id="values-heading" className="ab-section__title">
                핵심가치
              </h2>
              <hr className="ab-section__rule" />
            </div>
            <ul className="ab-values" lang="ko">
              {CORE_VALUES.map((v) => (
                <li key={v.id} className="ab-values__item">
                  <article className="ab-value-card" aria-labelledby={`ab-value-title-${v.id}`}>
                    <span className="ab-value-card__index" aria-hidden="true">
                      {v.index}
                    </span>
                    <div className="ab-value-card__main">
                      <h3 id={`ab-value-title-${v.id}`} className="ab-value-card__title">
                        {v.titleKo}{' '}
                        <span className="ab-value-card__en" lang="en" translate="no">
                          ({v.titleEn})
                        </span>
                      </h3>
                      <p className="ab-value-card__desc">{v.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          {/* ── CI 소개 ── */}
          <section className="ab-section" aria-label="CI 소개">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">CI</p>
              <h2 className="ab-section__title">CI 소개</h2>
              <hr className="ab-section__rule" />
            </div>
            <div className="ab-ci">
              <div className="ab-ci__emblem">
                <img
                  className="ab-ci__emblem-img"
                  src="/images/ci-logo.svg"
                  width={329}
                  height={51}
                  alt="국제인권연대 월드라이츠 CI 로고"
                  decoding="async"
                />
              </div>
              <div className="ab-ci__copy" aria-hidden="true">
                <div className="ab-ci__copy-block">
                  <span className="ab-line ab-skel" style={{ width: '45%', height: '0.8125rem' }} />
                  <span className="ab-line ab-skel" style={{ width: '100%' }} />
                  <span className="ab-line ab-skel" style={{ width: '88%' }} />
                  <span className="ab-line ab-skel" style={{ width: '72%' }} />
                </div>
                <div className="ab-ci__copy-block">
                  <span className="ab-line ab-skel" style={{ width: '45%', height: '0.8125rem' }} />
                  <span className="ab-line ab-skel" style={{ width: '95%' }} />
                  <span className="ab-line ab-skel" style={{ width: '80%' }} />
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
