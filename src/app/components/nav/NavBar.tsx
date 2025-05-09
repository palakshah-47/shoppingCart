export const revalidate = 0;
import Link from 'next/link';
import Container from '../Container';
import logo from '../../assets/images/Logo.png';
import { Redressed } from 'next/font/google';
import CartCount from './CartCount';
import UserMenu from './UserMenu';
import { getCurrentUser } from '@/actions/getCurrentUser';
import Categories from './Categories';
import { Suspense } from 'react';
import SearchBar from './SearchBar';

const redressed = Redressed({
  subsets: ['latin'],
  weight: ['400'],
});

const NavBar = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm pl-2 pr-2">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="md:flex items-center md:gap-8 grid grid-cols-6 sm:grid justify-between gap-2 sm:grid-cols-5 sm:gap-1">
            <Link
              href="/"
              className={`${redressed.className} font-bold flex sm:col-span-1`}>
              <img
                className="md:w-7 md:h-7 w-5 h-5"
                src={logo.src}
                alt="eshopLogo"
              />
              fingerhut
            </Link>

            <div className="md:flex sm:col-span-1">
              <Suspense
                fallback={<div>Loading Search..</div>}>
                <SearchBar />
              </Suspense>
            </div>
            <div className="flex items-center gap-4  ml-48 md:gap-8 sm:col-span-1 sm:gap-4 sm:ml-40">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
          <Suspense
            fallback={<div>Loading Categories..</div>}>
            <Categories />
          </Suspense>
        </Container>
      </div>
    </div>
  );
};

export default NavBar;
