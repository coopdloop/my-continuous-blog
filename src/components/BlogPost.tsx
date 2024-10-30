import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { getPostBySlug } from '@/utils/markdown-loader';
import { BlogPost as BlogPostType } from '@/types/blog';

// Helper function to safely convert children to string
const childrenToString = (children: React.ReactNode): string => {
  if (Array.isArray(children)) {
    return children.map(child => {
      if (typeof child === 'string') return child;
      if (typeof child === 'number') return child.toString();
      return '';
    }).join('');
  }
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return children.toString();
  return '';
};

// Create slug from string
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/\s+/g, '-');
};

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post: BlogPostType | undefined = getPostBySlug(slug || '');

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto bg-background/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <img
          src={post.frontmatter.image.url}
          alt={post.frontmatter.image.alt}
          className="w-full object-cover rounded-t-lg"
        />
        <CardTitle className="text-3xl font-bold mt-4 text-primary">
          {post.frontmatter.title}
        </CardTitle>
        <div className="flex items-center space-x-4 mt-2">
          <img
            src={post.frontmatter.authorImage.url}
            alt={post.frontmatter.authorImage.alt}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{post.frontmatter.author}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(post.frontmatter.pubDate).toLocaleDateString()}</span>
              <ClockIcon className="w-4 h-4 ml-2" />
              <span>{post.frontmatter.ttr}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ReactMarkdown
          className="prose dark:prose-invert max-w-none blog-post-content"
          components={{
            h1: ({ node, children, ...props }) => {
              const id = createSlug(childrenToString(children));
              return <h1 id={id} {...props}>{children}</h1>;
            },
            h2: ({ node, children, ...props }) => {
              const id = createSlug(childrenToString(children));
              return <h2 id={id} {...props}>{children}</h2>;
            },
            h3: ({ node, children, ...props }) => {
              const id = createSlug(childrenToString(children));
              return <h3 id={id} {...props}>{children}</h3>;
            },
            h4: ({ node, children, ...props }) => {
              const id = createSlug(childrenToString(children));
              return <h4 id={id} {...props}>{children}</h4>;
            },
            a: ({ node, href, children, ...props }) => {
              // Check if it's an internal anchor link
              if (href?.startsWith('#')) {
                return (
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(href.slice(1));
                      if (element) {
                        element.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }}
                    className="text-primary hover:text-primary/80 no-underline hover:underline"
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
              // External links
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 no-underline hover:underline"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            img: ({ node, ...props }) => (
              <img
                className="max-w-full h-auto rounded-lg shadow-md my-4"
                {...props}
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};
