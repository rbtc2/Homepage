import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  DEFAULT_SIGNUP_APPLICATION_URL,
  getSiteFooterSettings,
} from '@/lib/site-settings';

export const metadata = {
  title: '회비납부 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description:
    '월드라이츠 회비 납부 안내. 회비의 사용처와 기부금 영수증 발급 관련 안내를 확인할 수 있습니다.',
};

export default async function DuesPage() {
  const { signupApplicationUrl } = await getSiteFooterSettings();
  const applicationHref =
    signupApplicationUrl && /^https?:\/\//i.test(signupApplicationUrl.trim())
      ? signupApplicationUrl.trim()
      : DEFAULT_SIGNUP_APPLICATION_URL;

  return (
    <>
      <Header />
      <main className="su-main" role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">단체 후원</p>
            <h1 className="page-header__title">회비납부</h1>
          </div>
        </div>

        <div className="su-wrap" aria-label="회비 납부 안내">
          <section className="su-block" aria-labelledby="dues-usage-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                01
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Usage</p>
                <h2 id="dues-usage-heading" className="su-block-head__title">
                  회비의 사용처
                </h2>
              </div>
            </header>

            <article className="su-prose" lang="ko">
              <p className="su-prose__lead">
                여러분이 보내주시는 소중한 회비는 월드라이츠가 독립적인 인권 활동을 지속할 수
                있는 가장 큰 원동력입니다. 회원님의 회비는 인권 사각지대 발굴 및 현장 연대,
                자립역량 강화 프로그램, 기술 및 데이터 기반 옹호 활동, 단체 운영 및 인프라
                구축 활동을 위해 사용됩니다.
              </p>
              <div className="su-prose__body">
                <p>
                  월드라이츠는 단단하고 투명한 조직을 지향하며, 단 1원의 회비도 허투루
                  사용하지 않습니다. 매년 초 홈페이지를 통해 전년도 수입 및 지출 내역을
                  투명하게 보고하며, 회비가 투입된 프로젝트의 성과를 뉴스레터와 연간 보고서를
                  통해 회원님께 가장 먼저 보고드립니다.{' '}
                  <a
                    href={applicationHref}
                    className="su-cta-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="su-cta-link__label">회원가입 신청 링크</span>
                    <span className="su-cta-link__icon" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </p>
              </div>
            </article>
          </section>

          <section className="su-block" aria-labelledby="dues-receipt-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                02
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Receipt</p>
                <h2 id="dues-receipt-heading" className="su-block-head__title">
                  기부금 영수증 발급 관련 안내
                </h2>
              </div>
            </header>

            <article className="su-prose" lang="ko">
              <p className="su-prose__lead">
                국제인권연대 월드라이츠는 현재 고유번호증을 보유한 비영리임의단체로, 현행법상
                세액공제용 기부금 영수증 발급은 준비 단계에 있습니다.
              </p>
              <div className="su-prose__body">
                <p>
                  회원 여러분의 소중한 회비가 보다 투명하게 관리되고 세제 혜택으로 이어질 수
                  있도록, 향후 1년 이내 공익법인(지정기부금단체) 지정을 완료할 계획입니다.
                  지금은 비록 세법상의 영수증을 발급드릴 수 없으나, 월드라이츠의 시작을
                  함께해주시는 그 귀한 마음에 더 큰 변화와 책임감 있는 활동으로
                  보답하겠습니다.
                </p>
              </div>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
