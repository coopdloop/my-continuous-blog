import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/lib/content-loader';
import { BlogPost } from '@/types/blog';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <Link to={`/post/${post.slug}`} className="block group">
        <div className="rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-300 overflow-hidden">
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                <div className="overflow-hidden">
                    <div className="aspect-[3/1] w-full bg-muted">
                        <img
                            src={post.frontmatter.image.url}
                            alt={post.frontmatter.image.alt}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>
            <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                    {post.frontmatter.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.frontmatter.title}
                </h3>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                    <div className="overflow-hidden">
                        <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                            {post.frontmatter.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-1">
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
                    <span className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Read post <ArrowRightIcon className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </div>
    </Link>
);

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        setPosts(getAllPosts().slice(0, 4));
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">
            <section className="space-y-5">
                <p className="font-mono text-sm text-primary">Cooper Wallace</p>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    DevSecOps Engineer &amp; Cloud Security Architect
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                    Building secure, scalable systems. Writing about Kubernetes, cloud architecture, and security engineering.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {['Kubernetes', 'Docker', 'AWS', 'Python', 'Go', 'TypeScript'].map(tech => (
                        <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded border border-border"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-4 pt-1">
                    <a
                        href="https://www.github.com/coopdloop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        GitHub
                    </a>
                    <span className="text-border">·</span>
                    <a
                        href="https://www.linkedin.com/in/cooper-wallace-0a572a158"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        LinkedIn
                    </a>
                    <span className="text-border">·</span>
                    <a
                        href="/rss.xml"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        RSS
                    </a>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
                    <Link
                        to="/posts"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        All posts →
                    </Link>
                </div>
                <div className="space-y-3">
                    {posts.map(post => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
