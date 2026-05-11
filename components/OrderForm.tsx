'use client';

import { useState } from 'react';
import PaymentForm from './PaymentForm';

const API_BASE = 'https://kinetix-backend.onrender.com/api/v1';
const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const PLANS = [1, 3, 7];

export default function OrderForm({ shoeId, dailyRate, modelName }: {
  shoeId: string;
  dailyRate: number;
  modelName: string;
}) {
  const [planDays, setPlanDays] = useState(3);
  const [size, setSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [success, setSuccess] = useState(false);

  const rental = dailyRate * planDays;
  const deposit = Math.round(dailyRate * 5);
  const total = rental + deposit;

  const handleCreateOrder = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('kinetix_token') : null;
    if (!token) { window.location.href = '/login'; return; }
    if (!size) { setMsg('กรุณาเลือกไซส์ก่อนค่ะ'); return; }

    setLoading(true);
    setMsg('');
    try {
      // หา inventory
      const invRes = await fetch(`${API_BASE}/shoes/${shoeId}/inventory?size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const invData = await invRes.json();
      const inventory = (invData.data || invData || [])[0];

      if (!inventory) {
        setMsg(`ขออภัย ไม่มีไซส์ ${size} ว่างในขณะนี้`);
        setLoading(false);
        return;
      }

      // สร้าง order
      const orderRes = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          plan_days: planDays,
          payment_method: 'card',
          items: [{ inventory_id: inventory._id }],
        }),
      });
      const orderData = await orderRes.json();

      if (orderData.success && orderData.data?._id) {
        setOrderId(orderData.data._id);
        setTotalAmount(total);
      } else {
        setMsg(orderData.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch {
      setMsg('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-5xl mb-4">🎉</p>
        <h3 className="text-xl font-bold text-gray-900 mb-2">ชำระเงินสำเร็จ!</h3>
        <p className="text-gray-500 mb-6">รองเท้าจะถูกส่งถึงคุณภายใน 1 วันค่ะ</p>
        <a href="/orders" className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition inline-block">
          ดูคำสั่งเช่า →
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Payment Modal */}
      {orderId && (
        <PaymentForm
          orderId={orderId}
          totalAmount={totalAmount}
          onSuccess={() => { setOrderId(null); setSuccess(true); }}
          onCancel={() => setOrderId(null)}
        />
      )}

      <div className="space-y-5">
        {/* Size selector */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">เลือกไซส์ (EU)</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`w-12 h-12 rounded-xl border text-sm font-medium transition ${
                  size === s
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Plan selector */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">จำนวนวัน</p>
          <div className="flex gap-3">
            {PLANS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setPlanDays(d)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                  planDays === d
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                {d} วัน<br />
                <span className="text-xs opacity-70">฿{(dailyRate * d).toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>ค่าเช่า {planDays} วัน</span>
            <span>฿{rental.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>มัดจำ (คืนเมื่อส่งคืน)</span>
            <span>฿{deposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t mt-2">
            <span>รวมทั้งหมด</span>
            <span>฿{total.toLocaleString()}</span>
          </div>
        </div>

        {msg && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{msg}</p>}

        <button
          type="button"
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'กำลังดำเนินการ...' : `เช่า ${modelName} — ฿${total.toLocaleString()}`}
        </button>
        <p className="text-xs text-gray-400 text-center">🔒 ชำระผ่าน Omise · ส่งถึงบ้าน 1 วัน</p>
      </div>
    </>
  );
}
