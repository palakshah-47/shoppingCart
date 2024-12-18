import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import { CartProvider } from '../providers/CartProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Online Shopping App - Fingerhut',
  description: 'Amazing e-shopping at your fingertips',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate=700`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen min-w-full">
            <NavBar />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
