import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { getPostBySlug } from '@/utils/markdown-loader';
import { BlogPost as BlogPostType } from '@/types/blog';


export const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const post: BlogPostType | undefined = getPostBySlug(slug || '');

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <Card className="max-w-4xl mx-auto bg-background/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
                <img src={post.frontmatter.image.url} alt={post.frontmatter.image.alt} className="w-full object-cover rounded-t-lg" />
                <CardTitle className="text-3xl font-bold mt-4 text-primary">{post.frontmatter.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                    <img src={post.frontmatter.authorImage.url} alt={post.frontmatter.authorImage.alt} className="w-10 h-10 rounded-full" />
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
                        a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                        img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg shadow-md my-4" {...props} />
                    }}
                >
                    {post.content}
                </ReactMarkdown>
            </CardContent>
        </Card>
    );
};
