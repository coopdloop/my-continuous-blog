import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface RecentPostsProps {
    posts: BlogPost[];
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
    return (
        <div className="space-y-3">
            {posts.slice(0, 3).map((post) => (
                <Link key={post.slug} to={`/post/${post.slug}`} className="block group">
                    <div className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors">
                        <div className="flex-none w-16 h-16 rounded overflow-hidden bg-muted">
                            <img
                                src={post.frontmatter.image.url}
                                alt={post.frontmatter.image.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {post.frontmatter.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {post.frontmatter.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    {new Date(post.frontmatter.pubDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {post.frontmatter.ttr}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
