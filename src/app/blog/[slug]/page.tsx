import { getPostData, getSortedPostsData } from '../../../lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import AdBanner from '../../../components/AdBanner';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | 성남나우 블로그`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `https://my-local-info-5c6.pages.dev/blog/${slug}`,
      publishedTime: post.date,
    },
  };
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.summary,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "성남나우"
            },
            "publisher": {
              "@type": "Organization",
              "name": "성남나우",
              "logo": {
                "@type": "ImageObject",
                "url": "https://my-local-info-5c6.pages.dev/favicon.ico"
              }
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "홈",
                "item": "https://my-local-info-5c6.pages.dev"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "블로그",
                "item": "https://my-local-info-5c6.pages.dev/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://my-local-info-5c6.pages.dev/blog/${slug}`
              }
            ]
          })
        }}
      />
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
            <Link href="/about" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors">
              소개
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
                📅 {post.date} (최종 업데이트: {post.date})
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

          <AdBanner />

          <footer className="border-t border-stone-100 mt-8 pt-6 space-y-4">
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

            {post.link && (
              <div className="text-xs text-stone-500 border-t border-stone-50 pt-4">
                <strong>원문 출처:</strong>{' '}
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 underline font-semibold">
                  공공데이터포털 바로가기
                </a>
              </div>
            )}

            <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-500 leading-relaxed border border-stone-100">
              💡 이 글은 공공데이터포털(data.go.kr)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
