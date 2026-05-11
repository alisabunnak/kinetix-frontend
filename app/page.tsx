import { api } from '@/lib/api';
import ShoeCard from '@/components/ShoeCard';

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

export default async function HomePage() {
  let shoes: ShoeModel[] = [];
  try {
    const res = await api.get('/shoes');
    shoes = res.data || res || [];
  } catch {
    shoes = [];
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-24 px-4 text-center">
        <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">Premium Shoe Rental</p>
        <h1 className="text-5xl font-bold mb-4">KINETIX</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
          เช่ารองเท้าวิ่งพรีเมียม Nike · Adidas · On Running<br />
          ส่งถึงบ้าน รับคืนถึงที่
        </p>
        <a href="/register" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition inline-block">
          เริ่มเช่าเลย →
        </a>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-4xl mx-auto grid grid-cols-3 text-center gap-4">
          <div>
            <div className="text-3xl font-bold text-black">500+</div>
            <div className="text-gray-500 text-sm mt-1">คู่รองเท้า</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-black">3 แบรนด์</div>
            <div className="text-gray-500 text-sm mt-1">พรีเมียม</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-black">1 วัน</div>
            <div className="text-gray-500 text-sm mt-1">จัดส่งถึงบ้าน</div>
          </div>
        </div>
      </section>

      {/* Shoe Catalog */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">รองเท้าทั้งหมด</h2>
        <p className="text-gray-500 mb-8">เลือกรองเท้าที่ใช่สำหรับคุณ</p>
        {shoes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">👟</p>
            <p>กำลังโหลดข้อมูลรองเท้า...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shoes.map((shoe) => (
              <ShoeCard key={shoe._id} shoe={shoe} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">วิธีการเช่า</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '👟', step: '1', title: 'เลือกรองเท้า', desc: 'เลือกรุ่นและไซส์ที่ต้องการ' },
              { icon: '📦', step: '2', title: 'สั่งเช่า', desc: 'เลือกจำนวนวันและชำระเงิน' },
              { icon: '🚚', step: '3', title: 'รับของ', desc: 'ส่งถึงบ้านภายใน 1 วัน' },
              { icon: '↩️', step: '4', title: 'คืนรองเท้า', desc: 'เราไปรับถึงที่ ง่ายมาก' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ขั้นที่ {item.step}</div>
                <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
