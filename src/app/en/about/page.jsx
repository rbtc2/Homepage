export const metadata = {
  title: 'About',
  description:
    'WORLD RIGHTS goes first to places the language of rights has not yet reached.',
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
    description: 'Every person has the power to write their own life.',
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
    title: 'Pioneer',
    description: 'We go first to places rights have not yet reached.',
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
            WORLD RIGHTS goes first to{' '}
            <span className="ab-mission-lead__emph">places the language of rights has not yet reached</span>.
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
                We visualized the W and R of World Rights as one unbroken, flowing wave.
              </p>
              <p className="ab-ci-b__p">
                The letters stay connected without a break — a sign that WORLD RIGHTS work
                will travel like a ripple to places the language of rights has not yet
                reached, and help bring positive change.
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
                      Vivid Blue <span className="ab-ci-b__hex">#0071ce</span>
                    </p>
                    <p className="ab-ci-b__color-desc">
                      Dignity and hope for the people we work with, and the energy of the
                      change WORLD RIGHTS seeks. The clear, vivid color expresses sincere
                      work toward a better world.
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
                      Deep Navy <span className="ab-ci-b__hex">#001c65</span>
                    </p>
                    <p className="ab-ci-b__color-desc">
                      Steady conviction, expertise, and trust in the organization. The deep
                      tone stands for WORLD RIGHTS’ consistent will to uphold human rights.
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
