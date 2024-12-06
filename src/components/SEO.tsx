// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    article?: boolean;
    slug?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = '/default-og-image.jpg',
    article = false,
    slug = ''
}) => {
    const siteUrl = 'https://www.devsec-cooper.codes';
    const siteTitle = 'Cooper Wallace Blog';
    const twitterHandle = '@BeenBashed';

    return (
        <Helmet>
            {/* Basic */}
            <title>{`${title} | ${siteTitle}`}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${siteUrl}${image}`} />
            <meta property="og:url" content={`${siteUrl}${slug ? `/post/${slug}` : ''}`} />
            <meta property="og:type" content={article ? 'article' : 'website'} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={twitterHandle} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${image}`} />

            {/* Additional for blog posts */}
            {article && (
                <>
                    <link rel="canonical" href={`${siteUrl}/post/${slug}`} />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": title,
                            "image": [`${siteUrl}${image}`],
                            "url": `${siteUrl}/post/${slug}`,
                            "description": description,
                            "author": {
                                "@type": "Person",
                                "name": "Cooper Wallace"
                            }
                        })}
                    </script>
                </>
            )}
        </Helmet>
    );
};
