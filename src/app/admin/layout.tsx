import React from 'react';
import AdminNav from '../components/admin/AdminNav';

export const metadata = {
  title: 'Fingerhut - Admin',
  description: 'Fingerhut Admin Dashboard',
};
const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
