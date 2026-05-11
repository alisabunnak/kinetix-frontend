'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, getRole, clearAuth } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!!getToken());
    setRole(getRole());
  }, []);

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-black tracking-tight">
          KINETIX
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-black transition">รองเท้า</Link>
          {loggedIn && role === 'admin' && (
            <Link href="/admin" className="text-gray-600 hover:text-black transition">Dashboard</Link>
          )}
          {loggedIn ? (
            <button onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition">
              ออกจากระบบ
            </button>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black transition">เข้าสู่ระบบ</Link>
              <Link href="/register" className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
