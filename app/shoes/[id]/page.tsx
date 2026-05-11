import { api } from '@/lib/api';
import OrderForm from '@/components/OrderForm';

interface ShoeModel {
  _id: string;
  brand: string;
  model_name: string;
  category: string;
  retail_price: number;
  daily_rate: number;
  description: string;
  image_url: string;
}

export default async function ShoeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let shoe: ShoeModel | null = null;

  try {
    const res = await api.get(`/shoes/${id}`);
    shoe = res.data || res;
  } catch { /* not found */ }

  if (!shoe) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <div className="text-center">
          <p className="text-5xl mb-4">👟</p>
          <p>ไม่พบรองเท้านี้</p>
        </div>
      </div>
    );
  }

  const planOptions = [
    { days: 1, price: shoe.daily_rate },
    { days: 3, price: shoe.daily_rate * 3 },
    { days: 7, price: shoe.daily_rate * 7 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-gray-50 rounded-3xl flex items-center justify-center h-80 md:h-auto">
          {shoe.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shoe.image_url} alt={shoe.model_name} className="h-full w-full object-cover rounded-3xl" />
          ) : (
            <span className="text-8xl">👟</span>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{shoe.brand}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{shoe.model_name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{shoe.description}</p>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl font-bold text-black">฿{shoe.daily_rate.toLocaleString()}</span>
            <span className="text-gray-400">/ วัน</span>
            <span className="text-sm text-gray-400 line-through ml-2">ราคาซื้อ ฿{shoe.retail_price.toLocaleString()}</span>
          </div>

          {/* Plan options preview */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {planOptions.map((p) => (
              <div key={p.days} className="border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{p.days} วัน</p>
                <p className="text-sm text-gray-500">฿{p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <OrderForm shoeId={shoe._id} dailyRate={shoe.daily_rate} modelName={shoe.model_name} />
        </div>
      </div>
    </div>
  );
}
