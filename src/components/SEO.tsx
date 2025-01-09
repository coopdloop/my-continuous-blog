// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    article?: boolean;
    slug?: string;
    author?: string;
    publishDate?: string;
    readingTime?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = '/default-og-image.jpg',
    article = false,
    slug = '',
    author = 'Cooper Wallace',
    publishDate,
}) => {
    const siteUrl = 'https://www.devsec-cooper.codes';
    const extendedDescription = `${description} - Read more about ${title} and other engineering insights on Cooper Wallace's technical blog, covering topics in software development, security, and cloud architecture.`;


   return (
        <Helmet>
            {/* Basic */}
            <title>{`${title} | Cooper Wallace Blog`}</title>
            <meta name="description" content={extendedDescription} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={extendedDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content={article ? 'article' : 'website'} />
            <meta property="og:url" content={`${siteUrl}/post/${slug}`} />
            <meta property="article:published_time" content={publishDate} />
            <meta property="article:author" content={author} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={extendedDescription} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
