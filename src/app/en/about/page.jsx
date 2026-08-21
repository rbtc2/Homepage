export const metadata = {
  title: 'About',
  description:
    'World Rights goes first where the language of rights has yet to reach.',
};

const VISION_ITEMS = [
  {
    id: 'vision-diversity',
    index: '01',
    title: 'Possibility',
    description: 'Everyday life where difference becomes possibility',
  },
  {
    id: 'vision-agency',
    index: '02',
    title: 'Agency',
    description: 'A society where everyone is the author of their own life',
  },
  {
    id: 'vision-rights',
    index: '03',
    title: 'Common sense',
    description: 'A society where human rights are common sense',
  },
];

const CORE_VALUES = [
  {
    id: 'solidarity',
    index: '01',
    title: 'Solidarity',
    description: 'We create and share the language of rights together.',
  },
  {
    id: 'agency',
    index: '02',
    title: 'Agency',
    description: 'Everyone has the power to shape their own life.',
  },
  {
    id: 'inclusion',
    index: '03',
    title: 'Inclusion',
    description: 'Difference is not something to fix; it is a way to live together.',
  },
  {
    id: 'pioneer',
    index: '04',
    title: 'Pioneering',
    description: 'We go first where rights have yet to reach.',
  },
];

export default function EnAboutPage() {
  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">About</p>
          <h1 className="page-header__title">About</h1>
        </div>
      </div>

      <div className="ab-wrap">
        <section className="ab-section" aria-labelledby="mission-heading">
          <div className="ab-section__header">
            <p className="ab-section__eyebrow">Mission</p>
            <h2 id="mission-heading" className="ab-section__title">
              Mission
            </h2>
            <hr className="ab-section__rule" />
          </div>
          <p className="ab-mission-lead">
            World Rights goes first{' '}
            <span className="ab-mission-lead__emph">where the language of rights has yet to reach</span>.
          </p>
        </section>

        <section className="ab-section" aria-labelledby="vision-heading">
          <div className="ab-section__header">
            <p className="ab-section__eyebrow">Vision</p>
            <h2 id="vision-heading" className="ab-section__title">
              Vision
            </h2>
            <hr className="ab-section__rule" />
          </div>
          <ul className="ab-values">
            {VISION_ITEMS.map((v) => (
              <li key={v.id} className="ab-values__item">
                <article className="ab-value-card" aria-labelledby={`ab-vision-title-${v.id}`}>
                  <span className="ab-value-card__index" aria-hidden="true">
                    {v.index}
                  </span>
                  <div className="ab-value-card__main">
                    <h3 id={`ab-vision-title-${v.id}`} className="ab-value-card__title">
                      {v.title}
                    </h3>
                    <p className="ab-value-card__desc">{v.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="ab-section" aria-labelledby="values-heading">
          <div className="ab-section__header">
            <p className="ab-section__eyebrow">Core Value</p>
            <h2 id="values-heading" className="ab-section__title">
              Core values
            </h2>
            <hr className="ab-section__rule" />
          </div>
          <ul className="ab-values">
            {CORE_VALUES.map((v) => (
              <li key={v.id} className="ab-values__item">
                <article className="ab-value-card" aria-labelledby={`ab-value-title-${v.id}`}>
                  <span className="ab-value-card__index" aria-hidden="true">
                    {v.index}
                  </span>
                  <div className="ab-value-card__main">
                    <h3 id={`ab-value-title-${v.id}`} className="ab-value-card__title">
                      {v.title}
                    </h3>
                    <p className="ab-value-card__desc">{v.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="ab-section" aria-labelledby="ci-heading">
          <div className="ab-section__header">
            <p className="ab-section__eyebrow">CI</p>
            <h2 id="ci-heading" className="ab-section__title">
              Visual identity
            </h2>
            <hr className="ab-section__rule" />
          </div>

          <div className="ab-ci-b">
            <div className="ab-ci-b__story">
              <h3 className="ab-ci-b__heading">Logo</h3>
              <p className="ab-ci-b__p">
                The WORLD RIGHTS logo brings the W and R together in a single, flowing
                form inspired by the movement of a wave.
              </p>
              <p className="ab-ci-b__p">
                The seamless connection between the two letters represents our commitment
                to carrying the language of rights to places it has yet to reach. Like
                ripples spreading outward, the work of WORLD RIGHTS seeks to create
                positive change that extends across communities and beyond.
              </p>
            </div>

            <div className="ab-ci-b__logo-wrap">
              <div className="ab-ci-b__emblem">
                <img
                  className="ab-ci-b__emblem-img"
                  src="/images/ci-logo.svg"
                  width={329}
                  height={51}
                  alt="WORLD RIGHTS CI logo"
                  decoding="async"
                />
              </div>
            </div>

            <div className="ab-ci-b__palette">
              <h3 className="ab-ci-b__heading">Brand colors</h3>
              <ul className="ab-ci-b__colors">
                <li className="ab-ci-b__color">
                  <span
                    className="ab-ci-b__chip"
                    style={{ background: '#0071ce' }}
                    aria-hidden
                  />
                  <div className="ab-ci-b__color-body">
                    <p className="ab-ci-b__color-name">
                      Vivid Blue <span className="ab-ci-b__hex">#0071CE</span>
                    </p>
                    <p className="ab-ci-b__color-desc">
                      Vivid Blue represents the dignity and hope of the people at the heart
                      of our work, as well as the dynamic change WORLD RIGHTS strives to
                      create. Its clear, vibrant tone reflects our sincere commitment to
                      building a better world.
                    </p>
                  </div>
                </li>
                <li className="ab-ci-b__color">
                  <span
                    className="ab-ci-b__chip"
                    style={{ background: '#001c65' }}
                    aria-hidden
                  />
                  <div className="ab-ci-b__color-body">
                    <p className="ab-ci-b__color-name">
                      Deep Navy <span className="ab-ci-b__hex">#001C65</span>
                    </p>
                    <p className="ab-ci-b__color-desc">
                      Deep Navy represents unwavering conviction, professionalism, and
                      trust. Its deep, grounded tone symbolizes WORLD RIGHTS’
                      steadfast commitment to upholding the values of human rights.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
