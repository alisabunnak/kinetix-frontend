import { api } from '@/lib/api';

interface Post {
  _id: string;
  title: string;
  content: string;
  likes: number;
  created_at: string;
  customer_id: { first_name: string; last_name: string };
}

interface Event {
  _id: string;
  title: string;
  location: string;
  event_date: string;
  description: string;
  max_participants: number;
  members: unknown[];
}

interface Leader {
  _id: string;
  rank: number;
  total_km: number;
  total_runs: number;
  month_year: string;
  customer_id: { first_name: string; last_name: string };
}

export default async function RunClubPage() {
  let posts: Post[] = [];
  let events: Event[] = [];
  let leaders: Leader[] = [];

  try {
    const [postsRes, eventsRes, leadersRes] = await Promise.all([
      api.get('/runclub/posts'),
      api.get('/runclub/events'),
      api.get('/runclub/leaderboard'),
    ]);
    posts = postsRes.data || [];
    events = eventsRes.data || [];
    leaders = leadersRes.data || [];
  } catch { /* use empty arrays */ }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm tracking-widest text-gray-400 uppercase mb-2">Community</p>
        <h1 className="text-3xl font-bold text-gray-900">🏃 Kinetix Run Club</h1>
        <p className="text-gray-500 mt-2">ชุมชนนักวิ่งที่รักรองเท้าดีๆ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">โพสต์ล่าสุด</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              <p className="text-3xl mb-2">✍️</p>
              <p>ยังไม่มีโพสต์</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {post.customer_id?.first_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {post.customer_id?.first_name} {post.customer_id?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>
                <div className="mt-3 flex items-center gap-1 text-gray-400 text-sm">
                  <span>❤️</span>
                  <span>{post.likes} likes</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span> Leaderboard
            </h2>
            {leaders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-3">
                {leaders.slice(0, 5).map((l, i) => (
                  <div key={l._id} className="flex items-center gap-3">
                    <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {l.customer_id?.first_name} {l.customer_id?.last_name}
                      </p>
                      <p className="text-xs text-gray-400">{l.total_km} km · {l.total_runs} วิ่ง</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📅</span> Events
            </h2>
            {events.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">ยังไม่มี event</p>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 3).map((e) => (
                  <div key={e._id} className="border-b pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-sm text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-500 mt-1">📍 {e.location}</p>
                    <p className="text-xs text-gray-500">
                      📅 {new Date(e.event_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(e.members || []).length}/{e.max_participants || '∞'} คน
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
