export const metadata = {
  title: 'Ongoing projects',
  description: 'Programs WORLD RIGHTS is currently carrying out.',
};

export default function EnProjectsPage() {
  return (
    <main role="main">
      <div className="page-header">
        <div className="page-header__inner">
          <p className="page-header__label">What we do</p>
          <h1 className="page-header__title" id="projects-heading">
            Ongoing projects
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
              This page introduces the programs WORLD RIGHTS is currently carrying
              out.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
