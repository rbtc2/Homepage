import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';

/** 새 관리자 라우트 추가 시: AdminSidebar NAV_ITEMS + AdminBreadcrumb SECTION_LABELS 동기화 */

export default function AdminLayout({ children }) {
  return (
    <div className="adm-layout">
      <AdminSidebar />
      <div className="adm-content">
        <AdminBreadcrumb />
        {children}
      </div>
    </div>
  );
}
