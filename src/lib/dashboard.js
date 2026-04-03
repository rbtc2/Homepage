/**
 * Builds a recent activity list from pre-fetched content arrays.
 * Returns up to `limit` most recent items across all sections,
 * merged and sorted by createdAt descending.
 *
 * @param {Array} notices - pre-fetched notices array
 * @param {Array} archives - pre-fetched archives array
 * @param {Array} disclosures - pre-fetched disclosures array
 * @param {Array} gallery - pre-fetched gallery array
 * @param {Array} wrNews - pre-fetched WR뉴스 array
 * @param {number} limit - max items to return (default 5)
 * @returns {Array<{section: string, sectionHref: string, title: string, createdAt: string, editHref: string}>}
 */
export function buildRecentActivity(notices, archives, disclosures, gallery, wrNews, limit = 5) {
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
    ...gallery.map((g) => ({
      section: '갤러리',
      sectionHref: '/admin/gallery',
      title: g.title,
      createdAt: g.createdAt,
      editHref: `/admin/gallery/${g.id}/edit`,
    })),
    ...wrNews.map((w) => ({
      section: 'WR뉴스',
      sectionHref: '/admin/wr-news',
      title: w.title,
      createdAt: w.createdAt,
      editHref: `/admin/wr-news/${w.id}/edit`,
    })),
  ];

  return tagged
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, limit);
}
