'use client';

import { useCallback, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import Avatar from '../ui/Avatar';
import Link from 'next/link';
import MenuItem from './MenuItem';
import { signOut } from 'next-auth/react';
import BackDrop from './BackDrop';
import { SafeUser } from '@/types';

interface UserMenuProps {
  currentUser: SafeUser;
}

const UserMenu = ({ currentUser }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  return (
    <>
      <div className="relative z-30">
        <div
          onClick={toggleOpen}
          className="p-2 border-[1px] border-slate-400
        flex flex-row items-center gap-2 rounded-full cursor-pointer hover:shadow-md transition text-slate-700">
          <Avatar
            height={25}
            width={25}
            src={currentUser?.image}
          />
          <AiFillCaretDown />
        </div>
        {isOpen && (
          <div
            className="absolute w-[170px] right-0 top-12 text-sm flex flex-col cursor-pointer
           overflow-hidden shadow-md rounded-md bg-white">
            {currentUser ? (
              <div>
                <Link href={'/orders'}>
                  <MenuItem onClick={toggleOpen}>
                    Your Orders
                  </MenuItem>
                </Link>
                {currentUser.role === 'ADMIN' && (
                  <Link href={'/admin/manage-orders'}>
                    <MenuItem onClick={toggleOpen}>
                      Manage Orders
                    </MenuItem>
                  </Link>
                )}
                <hr />
                <MenuItem
                  onClick={() => {
                    toggleOpen();
                    signOut();
                  }}>
                  Logout
                </MenuItem>
              </div>
            ) : (
              <div>
                <Link href={'/login'}>
                  <MenuItem onClick={toggleOpen}>
                    Login
                  </MenuItem>
                </Link>
                <Link href={'/register'}>
                  <MenuItem onClick={toggleOpen}>
                    Register
                  </MenuItem>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
    </>
  );
};

export default UserMenu;
