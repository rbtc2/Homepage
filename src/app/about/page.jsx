import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '소개 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

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
          <section className="ab-section" aria-label="비전">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">Vision</p>
              <h2 className="ab-section__title">비전</h2>
              <hr className="ab-section__rule" />
            </div>
            <div className="ab-lines" aria-hidden="true">
              <span className="ab-line ab-skel" style={{ width: '78%' }} />
              <span className="ab-line ab-skel" style={{ width: '92%' }} />
              <span className="ab-line ab-skel" style={{ width: '65%' }} />
              <span className="ab-line ab-skel" style={{ width: '85%', marginTop: '0.5rem' }} />
              <span className="ab-line ab-skel" style={{ width: '70%' }} />
            </div>
          </section>

          {/* ── 핵심가치 ── */}
          <section className="ab-section" aria-label="핵심가치">
            <div className="ab-section__header">
              <p className="ab-section__eyebrow">Core Value</p>
              <h2 className="ab-section__title">핵심가치</h2>
              <hr className="ab-section__rule" />
            </div>
            <ul className="ab-values" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="ab-values__item">
                  <div className="ab-value-card">
                    <span className="ab-value-card__num">0{n}</span>
                    <div className="ab-value-card__lines">
                      <span className="ab-value-card__line ab-skel" style={{ width: '60%' }} />
                      <span className="ab-value-card__line ab-skel" style={{ width: '85%' }} />
                      <span className="ab-value-card__line ab-skel" style={{ width: '50%' }} />
                    </div>
                  </div>
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
              <div className="ab-ci__emblem" role="img" aria-label="CI 엠블럼 (준비 중)">
                <span className="ab-ci__emblem-note">Emblem</span>
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
