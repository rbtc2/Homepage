import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '회원가입 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
};

export default function SignupPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">나의 후원</p>
            <h1 className="page-header__title">회원가입</h1>
          </div>
        </div>

        <section className="su-wrap" aria-label="회원가입 안내">
          <div className="su-intro">
            <h2 id="su-intro-heading" className="su-intro__title">
              <span className="su-intro__title-text">단체 소개</span>
              <hr className="su-intro__rule" />
            </h2>
            <article className="su-intro__article" lang="ko">
              <div className="su-intro__lead-wrap">
                <p className="su-intro__lead">
                  국제인권연대 월드라이츠는 상호문화 연대와 자립역량 강화를 통해 소수자와 취약계층의 인권 보호를
                  위한 활동을 수행하는 비영리단체입니다.
                </p>
              </div>
              <div className="su-intro__body">
                <p>
                  본 단체는 인권의 보편적 가치에 대해 깊이 고민해 온 실무자 중심으로 설립되어, 현장의 목소리를
                  경청하고 이를 사회적 가치로 연결하기 위한 다양한 활동을 펼치고 있습니다.
                </p>
                <p>
                  월드라이츠의 발걸음을 완성할 수 있도록, 차별의 사각지대를 환대의 중심지로 바꿔나가는 이 여정에
                  여러분의 소중한 연대를 더해주시기를 바랍니다. 투명한 활동과 진정성 있는 행보로 회원 여러분의
                  신뢰에 보답하겠습니다.
                </p>
              </div>
            </article>
          </div>

          <section className="su-procedure" aria-labelledby="su-procedure-heading">
            <h2 id="su-procedure-heading" className="su-procedure__title">
              <span className="su-procedure__title-text">회원가입 절차</span>
              <hr className="su-procedure__rule" />
            </h2>
            <div className="su-procedure__copy">
              <p className="su-procedure__text">
                국제인권연대 월드라이츠의 목적과 취지에 동의하는 개인 및 기관(단체) 누구나 회원 가입 신청을 할 수
                있습니다. 회원 신규가입을 원하시는 경우{' '}
                <a
                  href="https://example.com"
                  className="su-procedure__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  회원가입 신청 링크
                </a>
                를 통해 신청서를 제출해 주시기 바랍니다.
              </p>
            </div>

            <div className="su-flow" role="group" aria-label="회원가입 4단계 절차">
              <article className="su-flow__card" aria-labelledby="su-flow-step1-title">
                <div className="su-flow__card-head">
                  <p className="su-flow__step-label">
                    <span className="su-flow__step-num">STEP</span> 1
                  </p>
                  <h3 id="su-flow-step1-title" className="su-flow__card-title">
                    가입 신청
                  </h3>
                </div>
                <div className="su-flow__card-body">
                  <p>회원가입 신청서를 작성하여 제출합니다.</p>
                </div>
              </article>

              <span className="su-flow__arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <article className="su-flow__card" aria-labelledby="su-flow-step2-title">
                <div className="su-flow__card-head">
                  <p className="su-flow__step-label">
                    <span className="su-flow__step-num">STEP</span> 2
                  </p>
                  <h3 id="su-flow-step2-title" className="su-flow__card-title">
                    가입 승인
                  </h3>
                </div>
                <div className="su-flow__card-body">
                  <p>사무국 검토 및 이사회 승인 절차를 거칩니다.</p>
                </div>
                <p className="su-flow__card-note">※ 영업일 기준 2~3일 소요됩니다.</p>
              </article>

              <span className="su-flow__arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <article className="su-flow__card" aria-labelledby="su-flow-step3-title">
                <div className="su-flow__card-head">
                  <p className="su-flow__step-label">
                    <span className="su-flow__step-num">STEP</span> 3
                  </p>
                  <h3 id="su-flow-step3-title" className="su-flow__card-title">
                    회비 납부
                  </h3>
                </div>
                <div className="su-flow__card-body">
                  <p>선택한 결제 수단을 통해 회비를 납부합니다.</p>
                </div>
              </article>

              <span className="su-flow__arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <article className="su-flow__card" aria-labelledby="su-flow-step4-title">
                <div className="su-flow__card-head">
                  <p className="su-flow__step-label">
                    <span className="su-flow__step-num">STEP</span> 4
                  </p>
                  <h3 id="su-flow-step4-title" className="su-flow__card-title">
                    회원 확정
                  </h3>
                </div>
                <div className="su-flow__card-body">
                  <p>회원 자격이 부여되며, 월드라이츠 회원 안내를 발송합니다.</p>
                </div>
              </article>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
