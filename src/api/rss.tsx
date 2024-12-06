import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/utils/markdown-loader';

export function generateRSSFeed(posts: BlogPost[]) {
  const siteUrl = 'https://your-site.com'; // Replace with your actual site URL
  const rssDescription = 'Engineering insights and articles';

  const rssItems = posts.map((post) => `
    <item>
      <title>${post.frontmatter.title}</title>
      <link>${siteUrl}/post/${post.slug}</link>
      <description>${post.frontmatter.description}</description>
      <pubDate>${new Date(post.frontmatter.pubDate).toUTCString()}</pubDate>
    </item>
  `).join('');

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Engineering Insights</title>
        <link>${siteUrl}</link>
        <description>${rssDescription}</description>
        ${rssItems}
      </channel>
    </rss>
  `;
}

export function getRSSFeed() {
  const posts = getAllPosts();
  return generateRSSFeed(posts);
}
