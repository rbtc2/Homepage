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

          {/* ── CI 소개 (옵션 B: 스토리 → 로고 블록 → 브랜드 컬러) ── */}
          <section className="ab-section" aria-labelledby="ci-heading">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">CI</p>
              <h2 id="ci-heading" className="ab-section__title">
                CI 소개
              </h2>
              <hr className="ab-section__rule" />
            </div>

            <div className="ab-ci-b">
              <div className="ab-ci-b__story">
                <h3 className="ab-ci-b__heading">로고</h3>
                <p className="ab-ci-b__p">
                  World Rights의 W와 R을 하나로 이어 굽이치는 물결처럼 시각화했습니다.
                </p>
                <p className="ab-ci-b__p">
                  두 글자가 끊김 없이 연결된 형태는 권리의 언어가 닿지 않는 곳까지 월드라이츠의
                  활동이 파동처럼 넓게 확산되어 세상의 긍정적인 변화를 이끌어내겠다는 의지를 담고
                  있습니다.
                </p>
              </div>

              <div className="ab-ci-b__logo-wrap">
                <div className="ab-ci-b__emblem">
                  <img
                    className="ab-ci-b__emblem-img"
                    src="/images/ci-logo.svg"
                    width={329}
                    height={51}
                    alt="국제인권연대 월드라이츠 CI 로고"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="ab-ci-b__palette">
                <h3 className="ab-ci-b__heading">브랜드 컬러</h3>
                <ul className="ab-ci-b__colors">
                  <li className="ab-ci-b__color">
                    <span
                      className="ab-ci-b__chip"
                      style={{ background: '#001c65' }}
                      aria-hidden
                    />
                    <div className="ab-ci-b__color-body">
                      <p className="ab-ci-b__color-name" lang="en">
                        Deep Navy <span className="ab-ci-b__hex">#001c65</span>
                      </p>
                      <p className="ab-ci-b__color-desc">
                        흔들리지 않는 신념과 전문성, 그리고 조직의 신뢰감을 나타냅니다. 깊고 묵직한
                        색감은 월드라이츠가 인권의 가치를 지켜나가는 일관된 의지를 상징합니다.
                      </p>
                    </div>
                  </li>
                  <li className="ab-ci-b__color">
                    <span
                      className="ab-ci-b__chip"
                      style={{ background: '#0071ce' }}
                      aria-hidden
                    />
                    <div className="ab-ci-b__color-body">
                      <p className="ab-ci-b__color-name" lang="en">
                        Vivid Blue <span className="ab-ci-b__hex">#0071ce</span>
                      </p>
                      <p className="ab-ci-b__color-desc">
                        당사자의 존엄과 희망, 월드라이츠가 지향하는 변화의 역동성을 의미합니다. 맑고
                        선명한 색감은 더 나은 세상을 향한 진정성 있는 활동을 표현합니다.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
