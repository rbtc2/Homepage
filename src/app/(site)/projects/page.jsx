export const metadata = {
  title: '진행사업 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description: '월드라이츠가 현재 진행하고 있는 사업을 소개합니다.',
};

export default function ProjectsPage() {
  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">단체 사업</p>
          <h1 className="page-header__title" id="projects-heading">
            진행사업
          </h1>
        </div>
      </div>

      <article className="gt-wrap" aria-labelledby="projects-heading">
        <div className="gt-prose">
          <header className="gt-section-head">
            <p className="gt-section-head__eyebrow">Projects</p>
            <hr className="gt-section-head__rule" />
          </header>

          <div className="gt-prose__lead-wrap">
            <p className="gt-prose__lead">
              월드라이츠가 현재 진행하고 있는 사업을 소개합니다.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
