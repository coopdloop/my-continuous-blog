import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import {
    SearchIcon,
    XIcon,
    CalendarIcon,
    ClockIcon,
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/lib/content-loader';
import { SEO } from '../layout/SEO';

interface FilterState {
    tags: string[];
    search: string;
}

export const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filters, setFilters] = useState<FilterState>({ tags: [], search: '' });

    const { tagStats } = useMemo(() => {
        const stats = new Map<string, number>();
        posts.forEach(post => {
            post.frontmatter.tags.forEach(tag => {
                stats.set(tag, (stats.get(tag) || 0) + 1);
            });
        });
        return { tagStats: stats };
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesTags = filters.tags.length === 0 ||
                filters.tags.every(tag => post.frontmatter.tags.includes(tag));
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = !filters.search ||
                post.frontmatter.title.toLowerCase().includes(searchLower) ||
                post.frontmatter.description.toLowerCase().includes(searchLower) ||
                post.frontmatter.tags.some(tag => tag.toLowerCase().includes(searchLower));
            return matchesTags && matchesSearch;
        });
    }, [filters, posts]);

    useEffect(() => {
        setPosts(getAllPosts());
    }, []);

    const handleTagToggle = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const clearFilters = () => setFilters({ tags: [], search: '' });
    const hasFilters = filters.tags.length > 0 || filters.search;

    return (
        <>
            <SEO
                title="Posts"
                description="Writing about DevSecOps, cloud architecture, and security engineering"
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground">Posts</h1>
                    <p className="text-muted-foreground text-sm">
                        {posts.length} articles on DevSecOps, cloud, and security engineering
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search articles..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="pl-9 bg-card border-border focus:border-primary/50 h-9 text-sm"
                        />
                        {filters.search && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                            >
                                <XIcon className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Array.from(tagStats)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 10)
                            .map(([tag]) => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                                        filters.tags.includes(tag)
                                            ? 'bg-primary/15 border-primary/40 text-primary'
                                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                    </div>

                    {hasFilters && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}</span>
                            <button
                                onClick={clearFilters}
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {filteredPosts.map((post) => (
                        <Link key={post.slug} to={`/post/${post.slug}`} className="block group">
                            <div className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors">
                                <div className="flex-none w-20 h-20 rounded overflow-hidden bg-muted">
                                    <img
                                        src={post.frontmatter.image.url}
                                        alt={post.frontmatter.image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <h2 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                                        {post.frontmatter.title}
                                    </h2>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
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
                                        <div className="hidden sm:flex flex-wrap gap-1">
                                            {post.frontmatter.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            No posts match your search.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
