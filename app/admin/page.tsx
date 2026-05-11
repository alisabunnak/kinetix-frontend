'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, getRole } from '@/lib/api';

interface DashboardData {
  totalOrders: number;
  activeOrders: number;
  pendingReturns: number;
  pendingCleaning: number;
}

interface OverdueOrder {
  _id: string;
  customer_id: { first_name: string; last_name: string; email: string };
  items: Array<{ rental_period: { due_at: string } }>;
}

export default function AdminPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [overdue, setOverdue] = useState<OverdueOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [dashRes, overdueRes] = await Promise.all([
          api.get('/staff/dashboard', token),
          api.get('/staff/dashboard/overdue', token),
        ]);
        setDashboard(dashRes.data || dashRes);
        setOverdue(overdueRes.data || []);
      } catch {
        console.error('Failed to fetch dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-lg animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  const stats = [
    { label: 'คำสั่งเช่าทั้งหมด', value: dashboard?.totalOrders ?? '-', icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'กำลังเช่าอยู่', value: dashboard?.activeOrders ?? '-', icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: 'รอรับคืน', value: dashboard?.pendingReturns ?? '-', icon: '↩️', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'รอซักทำความสะอาด', value: dashboard?.pendingCleaning ?? '-', icon: '🧹', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-500 mt-1">ภาพรวมการดำเนินงาน Kinetix</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4 ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overdue Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⚠️</span> คำสั่งเช่าที่เกินกำหนด
        </h2>
        {overdue.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🎉</p>
            <p>ไม่มีรายการที่เกินกำหนดค่ะ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">ลูกค้า</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">กำหนดคืน</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {overdue.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-gray-500">{o._id.slice(-8)}</td>
                    <td className="py-3 font-medium">{o.customer_id?.first_name} {o.customer_id?.last_name}</td>
                    <td className="py-3 text-gray-500">{o.customer_id?.email}</td>
                    <td className="py-3 text-red-600 font-medium">
                      {o.items?.[0]?.rental_period?.due_at
                        ? new Date(o.items[0].rental_period.due_at).toLocaleDateString('th-TH')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
