const COPY = {
  ko: {
    lang: 'ko',
    eyebrow: 'Projects',
    title: '준비 중',
    lead: '개발 예정입니다.',
    body: '진행사업 소개 페이지를 준비하고 있습니다. 단체의 활동이 쌓이는 대로 이곳에 하나씩 담아두겠습니다.',
    closing: '조금만 기다려 주세요.',
  },
  en: {
    lang: 'en',
    eyebrow: 'Projects',
    title: 'Coming soon',
    lead: 'This page is under development.',
    body: 'We are preparing this page to share the programs WORLD RIGHTS is carrying out. Stories will appear here as the work takes shape.',
    closing: 'Thank you for waiting with us.',
  },
};

export default function ProjectsComingSoon({ locale = 'ko' }) {
  const copy = COPY[locale] ?? COPY.ko;

  return (
    <div className="ab-wrap" lang={copy.lang}>
      <section className="ab-section" aria-labelledby="projects-soon-heading">
        <div className="ab-section__header">
          <p className="ab-section__eyebrow">{copy.eyebrow}</p>
          <h2 id="projects-soon-heading" className="ab-section__title">
            {copy.title}
          </h2>
          <hr className="ab-section__rule" />
        </div>

        <p className="ab-mission-lead">
          <span aria-hidden="true">🚧 </span>
          {copy.lead}
        </p>
        <p className="ab-ci-b__p">{copy.body}</p>
        <p className="ab-ci-b__p">
          {copy.closing} <span aria-hidden="true">🌱</span>
        </p>
      </section>
    </div>
  );
}
