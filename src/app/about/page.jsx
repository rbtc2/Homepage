import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '소개 | EJJ 홈페이지',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">조직 소개</p>
            <h1 className="page-header__title">소개</h1>
          </div>
        </div>
        <div className="main">
          <div className="about-intro">
            <div className="about-intro__stack">
              <section className="about-section" aria-label="비전">
                <div className="about-section__head">
                  <p className="about-section__label">VISION</p>
                  <h2 className="about-section__title">비전</h2>
                </div>
                <div className="about-placeholder about-placeholder--lg" aria-hidden="true" />
              </section>

              <section className="about-section" aria-label="미션">
                <div className="about-section__head">
                  <p className="about-section__label">MISSION</p>
                  <h2 className="about-section__title">미션</h2>
                </div>
                <div className="about-placeholder about-placeholder--md" aria-hidden="true" />
              </section>

              <section className="about-section" aria-label="핵심가치">
                <div className="about-section__head">
                  <p className="about-section__label">CORE VALUE</p>
                  <h2 className="about-section__title">핵심가치</h2>
                </div>

                <ul className="about-values" aria-hidden="true">
                  <li className="about-values__item">
                    <div className="about-placeholder about-placeholder--value" />
                  </li>
                  <li className="about-values__item">
                    <div className="about-placeholder about-placeholder--value" />
                  </li>
                  <li className="about-values__item">
                    <div className="about-placeholder about-placeholder--value" />
                  </li>
                  <li className="about-values__item">
                    <div className="about-placeholder about-placeholder--value" />
                  </li>
                </ul>
              </section>

              <section className="about-section" aria-label="CI 소개">
                <div className="about-section__head">
                  <p className="about-section__label">CI</p>
                  <h2 className="about-section__title">CI 소개</h2>
                </div>

                <div className="about-ci">
                  <div
                    className="about-ci__emblem about-placeholder"
                    aria-hidden="true"
                  />
                  <div className="about-ci__copy" aria-hidden="true">
                    <div className="about-placeholder about-placeholder--md" />
                    <div className="about-placeholder about-placeholder--sm" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
