
export const metadata = {
  title: '인사말 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description:
    '정체성이 가능성을 제한하지 않는 사회를 향해, 월드라이츠가 함께하겠습니다.',
};

export default function GreetingPage() {
  return (
    <>
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
                  정체성이 가능성을 제한하지 않는 사회를 향해, 월드라이츠가
                  함께하겠습니다.
                </p>
              </div>

              <div className="gt-prose__body">
                <p>
                  우리 사회의 다양성은 갈수록 깊어지고 있지만, 누군가는 여전히
                  자신의 정체성으로 인해 정해진 역할과 제한된 선택지 안에서
                  살아가도록 요구받습니다. 월드라이츠는 사회적 소수자에게 무엇이
                  부족한지를 묻기보다, 그들이 이미 가진 경험과 가능성이 왜 우리
                  사회에서 충분한 기회가 되지 못하는지를 먼저 살피고자 합니다.
                </p>
                <p>
                  우리는 당사자가 자신의 경험과 지식을 바탕으로 사회에 참여하고,
                  스스로 새로운 역할과 선택지를 만들어갈 수 있는 작은 기회를
                  만듭니다. 현재는 이주여성과 함께 그 첫걸음을 시작하며, 앞으로
                  다양한 사회적 소수자와 만나고 연대하며 활동의 지평을
                  넓혀가겠습니다.
                </p>
                <p>
                  누구도 자신의 정체성 때문에 가능성을 제한받지 않고, 서로 다른
                  삶과 경험이 동등하게 존중받는 사회. 보편적 인권이 특별한 요구가
                  아닌 당연한 상식이 되는 사회를 향해, 월드라이츠는 작지만
                  구체적인 변화를 꾸준히 만들어가겠습니다.
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
    </>
  );
}
