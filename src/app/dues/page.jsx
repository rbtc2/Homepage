import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteFooterSettings } from '@/lib/site-settings';

export const metadata = {
  title: '회비납부 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description:
    '월드라이츠 회비 납부 안내. 납부 방법, 입금 시 유의사항, 문의처를 확인할 수 있습니다.',
};

function telHref(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return digits ? `tel:${digits}` : undefined;
}

export default async function DuesPage() {
  const { mainPhone, faxNumber } = await getSiteFooterSettings();
  const phoneHref = telHref(mainPhone);

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
          <section className="su-block" aria-labelledby="dues-intro-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                01
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Overview</p>
                <h2 id="dues-intro-heading" className="su-block-head__title">
                  회비 안내
                </h2>
              </div>
            </header>

            <article className="su-prose" lang="ko">
              <p className="su-prose__lead">
                회비는 국제인권연대 월드라이츠의 공익 활동을 안정적으로 이어가는 기반이 됩니다.
                가입이 승인된 회원께서는 아래 납부 방법을 참고하여 회비를 납부해 주시기 바랍니다.
              </p>
              <div className="su-prose__body">
                <p>
                  연회비 금액·납부 주기 및 회원 유형별 안내는 가입 승인 과정에서 사무국을 통해
                  개별적으로 안내될 수 있습니다. 절차 및 신청은{' '}
                  <Link href="/member" className="su-cta-link">
                    <span className="su-cta-link__label">회원가입 안내</span>
                  </Link>
                  에서 확인하실 수 있습니다.
                </p>
              </div>
            </article>
          </section>

          <section className="su-block" aria-labelledby="dues-method-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                02
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Payment</p>
                <h2 id="dues-method-heading" className="su-block-head__title">
                  납부 방법
                </h2>
              </div>
            </header>

            <article className="su-prose" lang="ko">
              <p className="su-prose__lead">
                계좌이체를 통해 납부해 주시기 바랍니다. 입금자명에는 회원 성함을 기입하고,
                확인이 어려울 경우를 대비해 연락처를 함께 남겨 주시면 처리에 도움이 됩니다.
              </p>
              <div className="su-prose__body">
                <p>
                  <strong>입금 계좌</strong>는 사무실 운영 및 보안상의 이유로 개별 안내 또는
                  사무국 문의를 통해 확인하실 수 있습니다. 공용 계좌로 입금하실 때는 반드시
                  안내받은 은행·계좌번호를 사용해 주시기 바랍니다.
                </p>
                <p>
                  <strong>납부 후</strong> 입금 확인이 필요하시면 아래 대표 전화로 연락 주시면
                  안내해 드리겠습니다.
                </p>
              </div>
            </article>
          </section>

          <section className="su-block" aria-labelledby="dues-contact-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                03
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Contact</p>
                <h2 id="dues-contact-heading" className="su-block-head__title">
                  문의
                </h2>
              </div>
            </header>

            <article className="su-prose" lang="ko">
              <div className="su-prose__body">
                <p>
                  <strong>대표 전화</strong>
                  {phoneHref ? (
                    <>
                      {' '}
                      <a href={phoneHref} className="su-cta-link">
                        <span className="su-cta-link__label">{mainPhone}</span>
                      </a>
                    </>
                  ) : (
                    <> {mainPhone}</>
                  )}
                </p>
                {faxNumber ? (
                  <p>
                    <strong>팩스</strong> {faxNumber}
                  </p>
                ) : null}
              </div>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
