// src/utils/rss-generator.ts
import { BlogPost } from '@/types/blog';

export const generateRSSFeed = (posts: BlogPost[]): string => {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const today = new Date().toUTCString();

  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid>${siteUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.frontmatter.pubDate).toUTCString()}</pubDate>
      <description><![CDATA[${post.frontmatter.description}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <author>Cooper Wallace</author>
      ${post.frontmatter.tags.map(tag => `<category>${tag}</category>`).join('\n')}
    </item>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cooper Wallace Blog</title>
    <link>${siteUrl}</link>
    <description>Engineering insights and technical blog</description>
    <language>en</language>
    <lastBuildDate>${today}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
};
