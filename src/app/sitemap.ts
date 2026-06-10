import { MetadataRoute } from 'next';
import { getSortedPostsData } from '../lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-local-info-5c6.pages.dev';

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  try {
    const posts = getSortedPostsData();
    const postRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
    return [...routes, ...postRoutes];
  } catch (error) {
    console.error('Failed to generate sitemap for posts', error);
    return routes;
  }
}
