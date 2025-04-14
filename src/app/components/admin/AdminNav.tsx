'use client';
import Link from 'next/link';
import Container from '../Container';
import {
  MdDashboard,
  MdFormatListBulleted,
} from 'react-icons/md';
import AdminNavItem from './AdminNavItem';
import { usePathname } from 'next/navigation';

const AdminNav = () => {
  const pathname = usePathname();
  return (
    <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
      <Container>
        <div
          className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12
            overflow-x-auto flex-nowrap">
          <Link href="/admin/manage-orders">
            <AdminNavItem
              label="Manage Orders"
              icon={MdFormatListBulleted}
              selected={pathname === '/admin/manage-orders'}
            />
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default AdminNav;
