import React from 'react';
import AdminNav from '../components/admin/AdminNav';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';


export const metadata = {
  title: 'Fingerhut - Admin',
  description: 'Fingerhut Admin Dashboard',

}

const AdminLayout = async({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};
export default AdminLayout;
