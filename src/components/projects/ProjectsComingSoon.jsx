const COPY = {
  ko: {
    eyebrow: 'Coming soon',
    title: '개발 예정입니다',
    body: '진행사업 소개 페이지를 준비하고 있습니다. 단체의 활동이 쌓이는 대로 이곳에 하나씩 담아두겠습니다.',
    note: '조금만 기다려 주세요',
    ghosts: [
      { emoji: '🌱', label: '곧 공개' },
      { emoji: '✨', label: '준비 중' },
      { emoji: '🤝', label: '업데이트 예정' },
    ],
  },
  en: {
    eyebrow: 'Coming soon',
    title: 'Under development',
    body: 'We are preparing this page to share the programs WORLD RIGHTS is carrying out. Stories will appear here as the work takes shape.',
    note: 'Thank you for waiting with us',
    ghosts: [
      { emoji: '🌱', label: 'Coming soon' },
      { emoji: '✨', label: 'In progress' },
      { emoji: '🤝', label: 'To be updated' },
    ],
  },
};

export default function ProjectsComingSoon({ locale = 'ko' }) {
  const copy = COPY[locale] ?? COPY.ko;

  return (
    <div className="pj-wrap">
      <section className="pj-section" aria-labelledby="projects-soon-heading">
        <div className="pj-section__header">
          <p className="pj-section__eyebrow">{copy.eyebrow}</p>
          <hr className="pj-section__rule" />
        </div>

        <div className="pj-soon" role="status">
          <p className="pj-soon__marks" aria-hidden="true">
            <span>🚧</span>
            <span>🌱</span>
            <span>✨</span>
          </p>
          <h2 id="projects-soon-heading" className="pj-soon__title">
            {copy.title}
          </h2>
          <p className="pj-soon__body">{copy.body}</p>
          <p className="pj-soon__note">
            {copy.note}{' '}
            <span aria-hidden="true">🌿</span>
          </p>
        </div>

        <ul className="pj-ghosts" aria-hidden="true">
          {copy.ghosts.map((item) => (
            <li key={item.label} className="pj-ghost">
              <span className="pj-ghost__emoji">{item.emoji}</span>
              <span className="pj-ghost__label">{item.label}</span>
              <span className="pj-ghost__bar pj-ghost__bar--wide" />
              <span className="pj-ghost__bar pj-ghost__bar--mid" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
