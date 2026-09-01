const COPY = {
  ko: {
    lang: 'ko',
    eyebrow: 'Projects',
    lead: '개발 예정입니다.',
    body: '진행사업 소개 페이지를 준비하고 있습니다. 단체의 활동이 쌓이는 대로 이곳에 하나씩 담아두겠습니다.',
    closing: '조금만 기다려 주세요.',
  },
  en: {
    lang: 'en',
    eyebrow: 'Projects',
    lead: 'This page is under development.',
    body: 'We are preparing this page to share the programs WORLD RIGHTS is carrying out. Stories will appear here as the work takes shape.',
    closing: 'Thank you for waiting with us.',
  },
};

export default function ProjectsComingSoon({ locale = 'ko' }) {
  const copy = COPY[locale] ?? COPY.ko;

  return (
    <article className="gt-wrap" aria-labelledby="projects-heading" lang={copy.lang}>
      <div className="gt-prose">
        <header className="gt-section-head">
          <p className="gt-section-head__eyebrow">{copy.eyebrow}</p>
          <hr className="gt-section-head__rule" />
        </header>

        <div className="gt-prose__lead-wrap">
          <p className="gt-prose__lead">
            <span aria-hidden="true">🚧 </span>
            {copy.lead}
          </p>
        </div>

        <div className="gt-prose__body">
          <p>{copy.body}</p>
        </div>

        <footer className="gt-prose__closing">
          <p>
            {copy.closing} <span aria-hidden="true">🌱</span>
          </p>
        </footer>
      </div>
    </article>
  );
}
