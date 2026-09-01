import ProjectsComingSoon from '@/components/projects/ProjectsComingSoon';

export const metadata = {
  title: '진행사업 | 국제인권연대 월드라이츠(WORLD RIGHTS)',
  description: '월드라이츠 진행사업 소개 페이지는 개발 예정입니다.',
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

      <ProjectsComingSoon locale="ko" />
    </main>
  );
}
