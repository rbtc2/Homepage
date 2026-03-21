import Link from 'next/link';
import { getNotices } from '@/lib/notices';
import { getArchives } from '@/lib/archive';
import { getDisclosures } from '@/lib/disclosures';
import { buildRecentActivity } from '@/lib/dashboard';

export const metadata = { title: '대시보드 | EJJ 관리자' };
export const dynamic = 'force-dynamic';

const SECTION_BADGE_STYLE = {
  공지: { background: 'var(--brand)', color: '#fff' },
  자료: { background: 'var(--canvas)', color: 'var(--muted)', border: '1px solid var(--line)' },
  공시: { background: 'rgba(18,79,166,0.08)', color: 'var(--brand)' },
};

export default async function AdminPage() {
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [notices, archives, disclosures] = await Promise.all([
    getNotices(),
    getArchives(),
    getDisclosures(),
  ]);
  const recentActivity = buildRecentActivity(notices, archives, disclosures, 5);

  const stats = [
    {
      label: '공지사항',
      href: '/admin/notices',
      total: notices.length,
      monthCount: notices.filter((n) => n.createdAt?.startsWith(thisMonth)).length,
      highlight: false,
    },
    {
      label: '자료실',
      href: '/admin/archive',
      total: archives.length,
      monthCount: archives.filter((a) => a.createdAt?.startsWith(thisMonth)).length,
      highlight: false,
    },
    {
      label: '공시자료',
      href: '/admin/disclosures',
      total: disclosures.length,
      monthCount: disclosures.filter((d) => d.createdAt?.startsWith(thisMonth)).length,
      highlight: false,
    },
    {
      // Popups are not yet DB-backed. Show 0 until backend is implemented.
      label: '활성 팝업',
      href: '/admin/popups',
      total: 0,
      sub: '노출 중',
      highlight: false, // will become `total > 0` once popup DB is implemented
    },
  ];

  return (
    <main className="adm-main">
      <div className="adm-main__inner">
        <div className="adm-main__hd">
          <h1 className="adm-main__title">대시보드</h1>
          <p className="adm-main__sub">EJJ 홈페이지 콘텐츠 현황</p>
        </div>

        {/* Stats row */}
        <div className="adm-dash-stats">
          {stats.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`adm-dash-stat${s.highlight ? ' adm-dash-stat--highlight' : ''}`}
            >
              <span className="adm-dash-stat__label">{s.label}</span>
              <span className="adm-dash-stat__num">{s.total}</span>
              <span className="adm-dash-stat__sub">
                {s.sub ?? `이번 달 +${s.monthCount}`}
              </span>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <div className="adm-dash-recent">
          <div className="adm-dash-recent__hd">
            <span className="adm-dash-recent__title">최근 게시물</span>
          </div>
          {recentActivity.length === 0 ? (
            <p className="adm-dash-recent__empty">등록된 게시물이 없습니다.</p>
          ) : (
            <ul className="adm-dash-recent__list">
              {recentActivity.map((item, i) => (
                <li key={i} className="adm-dash-recent__item">
                  <span
                    className="adm-dash-recent__badge"
                    style={SECTION_BADGE_STYLE[item.section]}
                  >
                    {item.section}
                  </span>
                  <Link href={item.editHref} className="adm-dash-recent__name">
                    {item.title}
                  </Link>
                  <span className="adm-dash-recent__date">
                    {item.createdAt?.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="adm-dash-recent__ft">
            {[
              { label: '공지사항 →', href: '/admin/notices' },
              { label: '자료실 →', href: '/admin/archive' },
              { label: '공시자료 →', href: '/admin/disclosures' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="adm-dash-recent__more">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
