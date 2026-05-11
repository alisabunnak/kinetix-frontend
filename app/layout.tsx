import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kinetix — Premium Shoe Rental',
  description: 'เช่ารองเท้าวิ่งพรีเมียม Nike, Adidas, On Running',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-gray-900 text-gray-400 text-center py-8 mt-20 text-sm">
          © 2026 Kinetix Shoe Rental · Made with ❤️ in Bangkok
        </footer>
      </body>
    </html>
  );
}
