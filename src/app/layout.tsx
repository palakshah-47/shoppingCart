import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import { CartProvider } from '../providers/CartProvider';
import { Toaster } from 'react-hot-toast';
import { ProductProvider } from '@/providers/ProductProvider';
import { PerformanceMonitor } from './components/PerformanceMonitor';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Online Shopping App - Fingerhut',
  description: 'Amazing e-shopping at your fingertips',
};

/**
 * Root layout for the application.
 *
 * Wraps page content with global providers, UI chrome, and the HTML/BODY root:
 * - applies the Poppins font
 * - renders a global Toaster for notifications
 * - wraps content with CartProvider and ProductProvider
 * - includes PerformanceMonitor, NavBar, a <main> region for `children`, and Footer
 *
 * @param children - Page content to render inside the layout's <main> element.
 * @returns The root HTML element containing the app layout.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">     
      <body
        className={`${poppins.className} text-slate=700`}>
        <Toaster
          toastOptions={{
            style: {
              background: 'rgb (51 65 85)',
              color: 'black',
            },
          }}
        />

        <CartProvider>
          <ProductProvider>
            <div className="flex flex-col min-h-screen min-w-[460px] md:min-w-[760px]">
              <PerformanceMonitor />
              <NavBar />
              <main>{children}</main>
              <Footer />
            </div>
          </ProductProvider>
        </CartProvider>
      </body>
    </html>
  );
}
