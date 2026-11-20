export const metadata = { title: '통계 | 관리자' };

const LOOKER_EMBED_SRC =
  'https://lookerstudio.google.com/embed/reporting/e2697d5d-d309-40bd-b03b-71e4f8ab8240/page/tq2DG';

export default function AdminStatsPage() {
  return (
    <main className="adm-main adm-main--embed">
      <div className="adm-stats-embed">
        <iframe
          className="adm-stats-embed__iframe"
          src={LOOKER_EMBED_SRC}
          title="Google Looker Studio 통계 보고서"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </main>
  );
}
