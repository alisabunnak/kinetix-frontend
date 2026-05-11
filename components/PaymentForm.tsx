'use client';

import { useEffect, useState } from 'react';

const API_BASE = 'https://kinetix-backend.onrender.com/api/v1';
const OMISE_PUBLIC_KEY = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || 'pkey_test_67n5149bqm1vh83f1pb';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Omise: any;
  }
}

interface PaymentFormProps {
  orderId: string;
  totalAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ orderId, totalAmount, onSuccess, onCancel }: PaymentFormProps) {
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiration_month: '',
    expiration_year: '',
    security_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [omiseReady, setOmiseReady] = useState(false);

  useEffect(() => {
    // Load Omise.js
    const script = document.createElement('script');
    script.src = 'https://cdn.omise.co/omise.js';
    script.onload = () => {
      window.Omise.setPublicKey(OMISE_PUBLIC_KEY);
      setOmiseReady(true);
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const handlePay = async () => {
    if (!omiseReady) { setError('กำลังโหลด Omise...'); return; }
    setLoading(true);
    setError('');

    try {
      // Tokenize card with Omise.js
      const token = await new Promise<string>((resolve, reject) => {
        window.Omise.createToken('card', {
          name: card.name,
          number: card.number.replace(/\s/g, ''),
          expiration_month: parseInt(card.expiration_month),
          expiration_year: parseInt(card.expiration_year),
          security_code: card.security_code,
        }, (statusCode: number, response: { id?: string; message?: string }) => {
          if (statusCode === 200 && response.id) {
            resolve(response.id);
          } else {
            reject(new Error(response.message || 'บัตรไม่ถูกต้อง'));
          }
        });
      });

      // Charge via backend
      const token_id = localStorage.getItem('kinetix_token');
      const res = await fetch(`${API_BASE}/payments/${orderId}/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token_id}`,
        },
        body: JSON.stringify({ token_id: token }),
      });
      const data = await res.json();

      if (data.success && data.status === 'paid') {
        onSuccess();
      } else {
        setError(data.message || 'การชำระเงินไม่สำเร็จ กรุณาลองใหม่');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">ชำระเงิน</h2>
            <p className="text-sm text-gray-500 mt-0.5">ยอดรวม ฿{totalAmount.toLocaleString()}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {/* Card preview */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-5 text-white mb-6">
          <p className="text-xs opacity-60 mb-3 tracking-widest">KINETIX RENTAL</p>
          <p className="font-mono text-lg tracking-widest mb-4">
            {card.number || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between text-sm">
            <span>{card.name || 'CARDHOLDER NAME'}</span>
            <span>{card.expiration_month || 'MM'}/{card.expiration_year?.slice(-2) || 'YY'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">หมายเลขบัตร</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">ชื่อบนบัตร</label>
            <input
              type="text"
              placeholder="SOMCHAI JAIDEE"
              value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">เดือน</label>
              <input
                type="text"
                placeholder="MM"
                maxLength={2}
                value={card.expiration_month}
                onChange={(e) => setCard({ ...card, expiration_month: e.target.value.replace(/\D/g, '') })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">ปี</label>
              <input
                type="text"
                placeholder="YYYY"
                maxLength={4}
                value={card.expiration_year}
                onChange={(e) => setCard({ ...card, expiration_year: e.target.value.replace(/\D/g, '') })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">CVV</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                value={card.security_code}
                onChange={(e) => setCard({ ...card, security_code: e.target.value.replace(/\D/g, '') })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Test card hint */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-700">
            <p className="font-semibold mb-1">🧪 Test Card (ทดสอบ)</p>
            <p>เลขบัตร: 4242 4242 4242 4242</p>
            <p>หมดอายุ: 12/2030 · CVV: 123</p>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

          <button
            type="button"
            onClick={handlePay}
            disabled={loading || !omiseReady}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? '⏳ กำลังชำระเงิน...' : `ชำระ ฿${totalAmount.toLocaleString()}`}
          </button>
          <p className="text-xs text-gray-400 text-center">🔒 ปลอดภัยด้วย Omise Payment</p>
        </div>
      </div>
    </div>
  );
}
