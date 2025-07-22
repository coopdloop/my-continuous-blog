// src/components/RSSFeedPage.tsx
import { useEffect } from 'react';
import { getAllPosts } from '@/lib/content-loader';
import { generateRSSFeed } from '@/lib/rss-generator';

export const RSSFeedPage: React.FC = () => {
  useEffect(() => {
    const posts = getAllPosts();
    const rssFeed = generateRSSFeed(posts);

    // Set content type header
    new Response(rssFeed, {
      headers: { 'Content-Type': 'application/xml' },
    });

    // Download as file
    const blob = new Blob([rssFeed], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rss.xml';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return null;
};
