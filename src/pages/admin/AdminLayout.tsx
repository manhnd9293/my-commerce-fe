import { Outlet } from 'react-router-dom';
import AdminHeader from '@/pages/admin/components/AdminHeader.tsx';

function AdminLayout() {
  return (
    <div>
      <AdminHeader/>
      <div className={'mt-4 max-w-screen-2xl px-4 mx-auto'}>
        <Outlet/>
      </div>
    </div>
  );
}

export default AdminLayout;