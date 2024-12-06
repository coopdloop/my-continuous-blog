import React from "react";

interface PageTemplateProps {
  title: string;
  description: string;
  ogImage: string;
  ogType: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  ogImage,
  ogType,
}) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content={ogType} />
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  );
};

export default PageTemplate;
