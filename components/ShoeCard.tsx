'use client';

import { useRouter } from 'next/navigation';

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

const brandColors: Record<string, string> = {
  Nike: 'bg-orange-100 text-orange-700',
  Adidas: 'bg-blue-100 text-blue-700',
  'On Running': 'bg-green-100 text-green-700',
};

export default function ShoeCard({ shoe }: { shoe: ShoeModel }) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      {/* Image */}
      <div className="bg-gray-50 h-52 flex items-center justify-center overflow-hidden">
        {shoe.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shoe.image_url}
            alt={shoe.model_name}
            className="h-full w-full object-cover group-hover:scale-105 transition"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className="text-6xl">👟</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${brandColors[shoe.brand] || 'bg-gray-100 text-gray-600'}`}>
            {shoe.brand}
          </span>
          <span className="text-xs text-gray-400">{shoe.category}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1">{shoe.model_name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{shoe.description}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-black">฿{shoe.daily_rate.toLocaleString()}</div>
            <div className="text-xs text-gray-400">ต่อวัน</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 line-through">฿{shoe.retail_price.toLocaleString()}</div>
            <div className="text-xs text-green-600 font-medium">ราคาซื้อปกติ</div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/shoes/${shoe._id}`)}
          className="w-full mt-4 bg-black text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition text-sm"
        >
          เช่าเลย →
        </button>
      </div>
    </div>
  );
}
