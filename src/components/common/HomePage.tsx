import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/lib/content-loader';
import { BlogPost } from '@/types/blog';
import { RecentPosts } from '../blog/RecentPosts';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        setPosts(getAllPosts().slice(0, 3));
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
                <RecentPosts posts={posts} />
            </section>
        </div>
    );
};

export default HomePage;
