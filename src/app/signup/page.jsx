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

        <section className="su-wrap" aria-labelledby="su-intro-heading">
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
              </div>
              <div className="su-intro__closing">
                <p>
                  월드라이츠의 발걸음을 완성할 수 있도록, 차별의 사각지대를 환대의 중심지로 바꿔나가는 이 여정에
                  여러분의 소중한 연대를 더해주시기를 바랍니다. 투명한 활동과 진정성 있는 행보로 회원 여러분의
                  신뢰에 보답하겠습니다.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
