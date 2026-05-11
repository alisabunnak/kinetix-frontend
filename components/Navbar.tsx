'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, getRole, getUserName, clearAuth } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!!getToken());
    setRole(getRole());
    setUserName(getUserName());
  }, []);

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
    setUserName(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-black tracking-tight">
          KINETIX
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-black transition">รองเท้า</Link>
          <Link href="/runclub" className="text-gray-600 hover:text-black transition">Run Club</Link>
          {loggedIn && (
            <Link href="/orders" className="text-gray-600 hover:text-black transition">คำสั่งเช่า</Link>
          )}
          {loggedIn && role === 'admin' && (
            <Link href="/admin" className="text-gray-600 hover:text-black transition">Dashboard</Link>
          )}
          {loggedIn ? (
            <div className="flex items-center gap-3">
              {userName && (
                <span className="text-gray-700 font-medium">👋 {userName}</span>
              )}
              <button onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition text-sm">
                ออกจากระบบ
              </button>
            </div>
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
