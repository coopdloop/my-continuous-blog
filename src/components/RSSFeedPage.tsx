import { getRSSFeed } from "@/api/rss";

const RSSFeedPage: React.FC = () => {
  const rssXml = getRSSFeed();

  return (
    <>
      <html>
        <head>
          <title>Engineering Insights RSS Feed</title>
          <meta charSet="UTF-8" />
          <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
        </head>
        <body>
          <pre>{rssXml}</pre>
        </body>
      </html>
    </>
  );
};

export default RSSFeedPage;
