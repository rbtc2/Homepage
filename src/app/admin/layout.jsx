import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';

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
