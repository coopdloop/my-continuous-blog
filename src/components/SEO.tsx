import React from 'react';
import { BlogPost as BlogPostType } from '@/types/blog';

interface SEOProps {
  post: BlogPostType;
}

export const SEO: React.FC<SEOProps> = ({ post }) => {
  const url = `${window.location.origin}/post/${post.slug}`;

  return (
    <>
      <title>{post.frontmatter.title}</title>
      <meta name="description" content={post.frontmatter.description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.frontmatter.title} />
      <meta property="og:description" content={post.frontmatter.description} />
      <meta property="og:image" content={post.frontmatter.image.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.frontmatter.title} />
      <meta name="twitter:description" content={post.frontmatter.description} />
      <meta name="twitter:image" content={post.frontmatter.image.url} />
    </>
  );
};
