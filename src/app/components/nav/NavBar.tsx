export const revalidate = 0;
import Link from 'next/link';
import Container from '../Container';
import logo from '../../assets/images/Logo.png';
import { Redressed } from 'next/font/google';
import CartCount from './CartCount';
import UserMenu from './UserMenu';
import { getCurrentUser } from '@/actions/getCurrentUser';
import Categories from './Categories';

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
          <div className="flex sm:grid items-center justify-between gap-3 sm:grid-cols-3">
            <Link
              href="/"
              className={`${redressed.className} font-bold flex sm:col-span-1`}>
              <img
                className="w-7"
                src={logo.src}
                alt="eshopLogo"
              />
              fingerhut
            </Link>

            <div className="md:block sm:col-span-2">
              Search
            </div>
            <div className="flex items-center gap-8 md:gap-12 sm:col-span-2 sm:gap-16">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
          <Categories />
        </Container>
      </div>
    </div>
  );
};

export default NavBar;
