import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: '인사말 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description:
    '존엄을 잇고 내일의 자립을 만드는 월드라이츠의 여정. 전문 자립 지원과 인권 옹호 활동을 소개합니다.',
};

export default function GreetingPage() {
  return (
    <>
      <Header />
      <main role="main">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="page-header__label">단체 소개</p>
            <h1 className="page-header__title" id="greeting-heading">
              인사말
            </h1>
          </div>
        </div>

        <article
          className="gt-wrap"
          aria-labelledby="greeting-heading"
          lang="ko"
        >
          <div className="gt-layout gt-layout--with-photo">
            <div className="gt-prose">
              <header className="gt-section-head">
                <p className="gt-section-head__eyebrow">Greeting</p>
                <hr className="gt-section-head__rule" />
              </header>

              <div className="gt-prose__lead-wrap">
                <p className="gt-prose__lead">
                  존엄을 잇고 내일의 자립을 만드는 월드라이츠의 여정에
                  함께해주십시오.
                </p>
              </div>

              <div className="gt-prose__body">
                <p>
                  우리 사회의 다양성은 갈수록 깊어지고 있지만, 그 이면의 소외와
                  차별 또한 여전히 존재합니다. 월드라이츠는 모든 사회적 소수자가
                  우리 공동체의 주체적인 일원으로 바로 설 수 있도록 전문적인
                  자립 지원 프로그램과 인권 옹호 활동을 전개합니다.
                </p>
                <p>
                  월드라이츠가 제안하는 상호문화의 가치가 우리 사회의 새로운
                  표준이 될 수 있도록, 투명하고 진정성 있는 행보로 증명해
                  보이겠습니다. 보편적 인권이 상식이 되는 세상을 위해 멈추지
                  않고 걷겠습니다.
                </p>
              </div>

              <footer className="gt-prose__closing">
                <p>감사합니다.</p>
              </footer>
            </div>

            <aside className="gt-aside" aria-label="인사말 본문과 함께하는 이미지">
              <figure className="gt-portrait">
                <img
                  src="/images/greeting/representative.webp"
                  alt="국제인권연대 월드라이츠 대표 이미지"
                  width={1200}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
