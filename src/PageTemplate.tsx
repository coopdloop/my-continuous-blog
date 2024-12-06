// src/PageTemplate.tsx
import React from "react";
import type { PageMetaData } from "./pageMetaMap";

const PageTemplate: React.FC<PageMetaData> = ({
    title,
    description,
    image,
    type,
    author
}) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://yourblog.com';

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <title>{title}</title>
                <meta name="description" content={description} />

                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content={type} />
                {image && <meta property="og:image" content={`${siteUrl}${image}`} />}

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                {image && <meta name="twitter:image" content={`${siteUrl}${image}`} />}

                {author && <meta name="author" content={author} />}
            </head>
            <body>
                <div id="root"></div>
            </body>
        </html>
    );
};

export default PageTemplate;
