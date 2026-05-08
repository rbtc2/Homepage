import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  DEFAULT_SIGNUP_APPLICATION_URL,
  getSiteFooterSettings,
} from '@/lib/site-settings';

export const metadata = {
  title: '회원가입 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description:
    '월드라이츠 회원가입 안내. 단체 소개, 가입 절차 및 신청 링크, 회원 자격 및 혜택을 확인할 수 있습니다.',
};

function FlowArrow() {
  return (
    <span className="su-flow__arrow" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default async function MemberPage({ searchParams }) {
  const { signupApplicationUrl } = await getSiteFooterSettings();
  const resolvedSearchParams = await searchParams;
  const requestedStyle = Array.isArray(resolvedSearchParams?.tableStyle)
    ? resolvedSearchParams.tableStyle[0]
    : resolvedSearchParams?.tableStyle;
  const tableStyle = ['a', 'b', 'c'].includes(requestedStyle) ? requestedStyle : 'a';
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
            <h1 className="page-header__title">회원가입</h1>
          </div>
        </div>

        <div className="su-wrap" aria-label="회원가입 안내">
          <section className="su-block" aria-labelledby="su-intro-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                01
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Membership</p>
                <h2 id="su-intro-heading" className="su-block-head__title">
                  단체 소개
                </h2>
              </div>
            </header>

            <article className="su-prose" lang="ko">
              <p className="su-prose__lead">
                국제인권연대 월드라이츠는 상호문화 연대와 자립역량 강화를 통해 소수자와 취약계층의 인권 보호를 위한 활동을 수행하는 비영리단체입니다.
              </p>
              <div className="su-prose__body">
                <p>
                  본 단체는 인권의 보편적 가치에 대해 깊이 고민해 온 실무자 중심으로 설립되어, 현장의 목소리를 경청하고 이를 사회적 가치로 연결하기 위한 다양한 활동을 펼치고 있습니다.
                </p>
                <p>
                  월드라이츠의 발걸음을 완성할 수 있도록, 차별의 사각지대를 환대의 중심지로 바꿔나가는 이 여정에 여러분의 소중한 연대를 더해주시기를 바랍니다. 투명한 활동과 진정성 있는 행보로 회원 여러분의 신뢰에 보답하겠습니다.
                </p>
              </div>
            </article>
          </section>

          <section className="su-block" aria-labelledby="su-procedure-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                02
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Process</p>
                <h2 id="su-procedure-heading" className="su-block-head__title">
                  회원가입 절차
                </h2>
              </div>
            </header>

            <p className="su-procedure-lead">
              국제인권연대 월드라이츠의 목적과 취지에 동의하는 분이라면 누구나 월드라이츠의 회원이 되실 수 있습니다. 회원 신규가입을 원하시는 경우{' '}
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
              를 통해 신청서를 제출해 주시기 바랍니다.
            </p>

            <div className="su-flow" role="group" aria-label="회원가입 4단계 절차">
              <article className="su-flow__card" aria-labelledby="su-flow-step1-title">
                <div className="su-flow__card-top">
                  <span className="su-flow__badge" aria-hidden="true">
                    1
                  </span>
                  <h3 id="su-flow-step1-title" className="su-flow__card-title">
                    가입 신청
                  </h3>
                </div>
                <p className="su-flow__card-text">회원가입 신청서를 작성하여 제출합니다.</p>
              </article>

              <FlowArrow />

              <article className="su-flow__card" aria-labelledby="su-flow-step2-title">
                <div className="su-flow__card-top">
                  <span className="su-flow__badge" aria-hidden="true">
                    2
                  </span>
                  <h3 id="su-flow-step2-title" className="su-flow__card-title">
                    가입 승인
                  </h3>
                </div>
                <p className="su-flow__card-text">사무국 검토 및 이사회 승인 절차를 거칩니다.</p>
                <p className="su-flow__card-note">※ 영업일 기준 2~3일 소요됩니다.</p>
              </article>

              <FlowArrow />

              <article className="su-flow__card" aria-labelledby="su-flow-step3-title">
                <div className="su-flow__card-top">
                  <span className="su-flow__badge" aria-hidden="true">
                    3
                  </span>
                  <h3 id="su-flow-step3-title" className="su-flow__card-title">
                    회비 납부
                  </h3>
                </div>
                <p className="su-flow__card-text">선택한 결제 수단을 통해 회비를 납부합니다.</p>
              </article>

              <FlowArrow />

              <article className="su-flow__card" aria-labelledby="su-flow-step4-title">
                <div className="su-flow__card-top">
                  <span className="su-flow__badge" aria-hidden="true">
                    4
                  </span>
                  <h3 id="su-flow-step4-title" className="su-flow__card-title">
                    회원 확정
                  </h3>
                </div>
                <p className="su-flow__card-text">회원 자격이 부여되며, 월드라이츠 회원 안내를 발송합니다.</p>
              </article>
            </div>
          </section>

          <section className="su-block" aria-labelledby="su-eligibility-heading">
            <header className="su-block-head">
              <span className="su-block-head__mark" aria-hidden="true">
                03
              </span>
              <div className="su-block-head__meta">
                <p className="su-block-head__kicker">Membership</p>
                <h2 id="su-eligibility-heading" className="su-block-head__title">
                  회원 자격 및 혜택
                </h2>
              </div>
            </header>

            <div className="su-style-switch" role="group" aria-label="표 스타일 선택">
              <span className="su-style-switch__label">표 스타일</span>
              <Link
                href="/member?tableStyle=a#su-eligibility-heading"
                className={`su-style-switch__chip${tableStyle === 'a' ? ' is-active' : ''}`}
              >
                A안
              </Link>
              <Link
                href="/member?tableStyle=b#su-eligibility-heading"
                className={`su-style-switch__chip${tableStyle === 'b' ? ' is-active' : ''}`}
              >
                B안
              </Link>
              <Link
                href="/member?tableStyle=c#su-eligibility-heading"
                className={`su-style-switch__chip${tableStyle === 'c' ? ' is-active' : ''}`}
              >
                C안
              </Link>
            </div>

            <div
              className={`su-table-wrap su-table-wrap--${tableStyle}`}
              role="region"
              aria-label="회원 유형별 자격 및 혜택 표"
            >
              <table className="su-table">
                <caption className="su-table__caption">회원 유형별 자격 및 혜택 안내</caption>
                <thead>
                  <tr>
                    <th scope="col">회원 구분</th>
                    <th scope="col">회원 자격 및 의무</th>
                    <th scope="col">회원 혜택</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">정회원</th>
                    <td>
                      <ul className="su-table__list">
                        <li>가입신청서 작성 및 제출</li>
                        <li>월 2만 원 이상 회비 납부</li>
                      </ul>
                    </td>
                    <td>
                      <ul className="su-table__list">
                        <li>총회 의결권 및 운영 참여권</li>
                        <li>단체 제공 프로그램 우선 초대 및 무료 참가</li>
                        <li>단체 뉴스레터 발송</li>
                        <li>디지털 웰컴 키트 제공</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">후원회원</th>
                    <td>
                      <ul className="su-table__list">
                        <li>가입신청서 작성 및 제출</li>
                        <li>월 1만 원 이상 회비 납부</li>
                      </ul>
                    </td>
                    <td>
                      <ul className="su-table__list">
                        <li>단체 제공 프로그램 우선 초대 및 무료 참가</li>
                        <li>단체 뉴스레터 발송</li>
                        <li>디지털 웰컴 키트 제공</li>
                      </ul>
                      <p className="su-table__note">
                        ※ 총회 의결권 및 운영 참여권이 없습니다
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">준회원</th>
                    <td>
                      <ul className="su-table__list">
                        <li>가입신청서 작성 및 제출 또는 단체 제공 프로그램 수료</li>
                      </ul>
                    </td>
                    <td>
                      <ul className="su-table__list">
                        <li>단체 제공 프로그램 우선 초대</li>
                        <li>단체 뉴스레터 발송</li>
                        <li>디지털 웰컴 키트 제공</li>
                      </ul>
                      <p className="su-table__note">
                        ※ 총회 의결권 및 운영 참여권이 없습니다
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="su-extra-notes" aria-label="회원 안내 추가 고지">
              <p>
                ※ 1년 이상 회비를 납부하지 않는 경우에는 이사회를 거쳐 회원으로서의 자격이 상실될
                수 있습니다.
              </p>
              <p>
                ※ 기관 및 단체 후원/협력 문의는 사무국(
                <a href="mailto:official@worldrights.or.kr" className="su-cta-link">
                  <span className="su-cta-link__label">official@worldrights.or.kr</span>
                </a>
                )으로 연락 부탁드립니다.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
