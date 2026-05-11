'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken } from '@/lib/api';
import Link from 'next/link';

interface OrderItem {
  _id: string;
  brand: string;
  model_name: string;
  size_eu: number;
  rental_price: number;
  deposit_amount: number;
  status: string;
  rental_period?: { rental_start_at: string; due_at: string };
}

interface Order {
  _id: string;
  status: string;
  plan_days: number;
  ordered_at: string;
  items: OrderItem[];
}

const statusLabel: Record<string, { label: string; color: string }> = {
  pending:   { label: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700' },
  active:    { label: 'กำลังเช่า', color: 'bg-green-100 text-green-700' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-600' },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    api.get('/orders', token).then((res) => {
      setOrders(res.data || res || []);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 animate-pulse">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">คำสั่งเช่าของฉัน</h1>
          <p className="text-gray-500 text-sm mt-1">ประวัติการเช่ารองเท้าทั้งหมด</p>
        </div>
        <Link href="/" className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition">
          เช่าเพิ่ม →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium text-gray-600">ยังไม่มีคำสั่งเช่า</p>
          <p className="text-sm mt-2">เริ่มเช่ารองเท้าคู่แรกของคุณได้เลย!</p>
          <Link href="/" className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
            ดูรองเท้า
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusLabel[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' };
            const total = order.items.reduce((sum, i) => sum + i.rental_price + i.deposit_amount, 0);
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(order.ordered_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{order.plan_days} วัน
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
                </div>

                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item._id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👟</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{item.model_name || 'รองเท้า'}</p>
                          <p className="text-xs text-gray-400">Size EU {item.size_eu} · ฿{item.rental_price}/วัน</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">฿{(item.rental_price + item.deposit_amount).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">รวมมัดจำ</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-3 pt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500">ยอดรวม</p>
                  <p className="font-bold text-gray-900">฿{total.toLocaleString()}</p>
                </div>

                {order.items[0]?.rental_period?.due_at && (
                  <div className="mt-3 bg-orange-50 rounded-xl px-4 py-2 text-xs text-orange-700 flex items-center gap-2">
                    <span>⏰</span>
                    <span>กำหนดคืน: {new Date(order.items[0].rental_period.due_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
