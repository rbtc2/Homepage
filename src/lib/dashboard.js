import { getNotices } from './notices';
import { getArchives } from './archive';
import { getDisclosures } from './disclosures';

/**
 * Fetches up to `limit` most recent items across all three content sections,
 * merged and sorted by createdAt descending.
 *
 * @param {number} limit - max items to return (default 5)
 * @returns {Promise<Array<{section: string, sectionHref: string, title: string, createdAt: string, editHref: string}>>}
 */
export async function getRecentActivity(limit = 5) {
  const [notices, archives, disclosures] = await Promise.all([
    getNotices(),
    getArchives(),
    getDisclosures(),
  ]);

  const tagged = [
    ...notices.map((n) => ({
      section: '공지',
      sectionHref: '/admin/notices',
      title: n.title,
      createdAt: n.createdAt,
      editHref: `/admin/notices/${n.id}/edit`,
    })),
    ...archives.map((a) => ({
      section: '자료',
      sectionHref: '/admin/archive',
      title: a.title,
      createdAt: a.createdAt,
      editHref: `/admin/archive/${a.id}/edit`,
    })),
    ...disclosures.map((d) => ({
      section: '공시',
      sectionHref: '/admin/disclosures',
      title: d.title,
      createdAt: d.createdAt,
      editHref: `/admin/disclosures/${d.id}/edit`,
    })),
  ];

  return tagged
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, limit);
}
