import ProjectsComingSoon from '@/components/projects/ProjectsComingSoon';

export const metadata = {
  title: 'Ongoing projects',
  description: 'The WORLD RIGHTS ongoing projects page is under development.',
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

      <ProjectsComingSoon locale="en" />
    </main>
  );
}
