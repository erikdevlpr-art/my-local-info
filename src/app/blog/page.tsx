import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogListPage() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans pb-16">
      <header className="bg-gradient-to-b from-amber-100 to-[#faf8f5] pb-8 px-4 text-center">
        {/* 네비게이션 바 */}
        <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 mb-8 border-b border-amber-200/40">
          <Link href="/" className="text-xl font-bold text-stone-900 flex items-center gap-1">
            🏡 성남나우
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors">
              홈
            </Link>
            <Link href="/blog" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors">
              블로그
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-amber-500/10 text-amber-700 font-bold text-xs px-3 py-1 rounded-full mb-3">
            📝 로컬 에디터 스토리
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            우리 동네 블로그
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            인공지능이 매일 전하는 알차고 유용한 지역 소식과 꿀팁을 전해드려요.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-stone-500">아직 등록된 블로그 글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md hover:border-amber-300/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      📅 {post.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    {post.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-stone-50 text-stone-500 text-xs px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="border-t border-stone-50 pt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block text-amber-700 hover:text-amber-800 text-sm font-bold transition-colors"
                  >
                    더 읽어보기 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
