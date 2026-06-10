import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans pb-16">
      <header className="bg-gradient-to-b from-amber-100 to-[#faf8f5] px-4 text-center">
        {/* 네비게이션 바 */}
        <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-amber-200/40">
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
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-amber-700 hover:text-amber-800 text-sm font-bold mb-8 transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-stone-100">
          <header className="border-b border-stone-100 pb-6 mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md">
                {post.category}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                📅 {post.date}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-stone max-w-none prose-amber prose-headings:font-bold prose-a:text-amber-700 hover:prose-a:text-amber-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="border-t border-stone-100 mt-8 pt-6">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-stone-50 text-stone-500 text-xs px-2.5 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
