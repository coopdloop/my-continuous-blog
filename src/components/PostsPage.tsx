import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    SearchIcon,
    XIcon,
    TagIcon,
    CalendarIcon,
    ClockIcon,
    BookOpenIcon,
    SparklesIcon,
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/utils/markdown-loader';

interface FilterState {
    tags: string[];
    search: string;
}

interface TagPanelProps {
    allTags: string[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    onTagRemove: (tag: string) => void;
}

const TagPanel: React.FC<TagPanelProps> = ({
    allTags,
    selectedTags,
    onTagSelect,
    onTagRemove
}) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute w-full mt-2 p-4 bg-slate-900/95 backdrop-blur-lg rounded-lg border border-amber-500/20 shadow-lg z-40"
    >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allTags.map((tag) => (
                <motion.div
                    key={tag}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`w-full justify-start gap-2 ${selectedTags.includes(tag)
                            ? "bg-amber-500 text-slate-900"
                            : "border-amber-500/20 text-slate-200 hover:bg-amber-500/10"
                            }`}
                        onClick={() => {
                            selectedTags.includes(tag) ? onTagRemove(tag) : onTagSelect(tag);
                        }}
                    >
                        <TagIcon className="w-4 h-4" />
                        {tag}
                    </Button>
                </motion.div>
            ))}
        </div>
    </motion.div>
);

export const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filters, setFilters] = useState<FilterState>({ tags: [], search: '' });
    const [showTagPanel, setShowTagPanel] = useState(false);

    // Calculate all unique tags and their counts
    const { allTags, tagStats } = useMemo(() => {
        const stats = new Map<string, number>();
        posts.forEach(post => {
            post.frontmatter.tags.forEach(tag => {
                stats.set(tag, (stats.get(tag) || 0) + 1);
            });
        });
        return {
            allTags: Array.from(new Set(posts.flatMap(post => post.frontmatter.tags))),
            tagStats: stats
        };
    }, [posts]);

    // Filter posts based on current filters
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
        const fetchedPosts = getAllPosts();
        setPosts(fetchedPosts);
    }, []);

    // Add back tag filtering functionality
    const handleTagSelect = (tag: string) => {
        if (!filters.tags.includes(tag)) {
            setFilters(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    };

    const handleTagRemove = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };

    const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            className="group"
        >
            <Link to={`/post/${post.slug}`}>
                <Card className="h-full bg-slate-900/50 backdrop-blur-lg border-amber-500/20 hover:border-amber-500/40 transition-all">
                    <CardHeader className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                            <img
                                src={post.frontmatter.image.url}
                                alt={post.frontmatter.image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <CardTitle className="text-xl text-slate-100 group-hover:text-amber-300 transition-colors">
                                {post.frontmatter.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400 line-clamp-2">
                                {post.frontmatter.description}
                            </CardDescription>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-amber-500/70" />
                                <span>{new Date(post.frontmatter.pubDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-amber-500/70" />
                                <span>{post.frontmatter.ttr}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-0">
                        <div className="flex flex-wrap gap-2">
                            {post.frontmatter.tags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-amber-500/10 text-amber-300 group-hover:bg-amber-500/20 transition-colors"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen relative">
            {/* Header Section */}
            <div className="relative mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 pt-4 text-center space-y-2"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <SparklesIcon className="h-8 w-8 text-amber-400" />
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-400 to-amber-200">
                            Engineering Insights
                        </h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Explore the intersection of innovation and engineering excellence
                    </p>
                    <div className="flex justify-center gap-8 text-slate-300">
                        <div>
                            <span className="text-xl font-bold text-amber-400">{posts.length}</span>
                            <p className="text-sm text-slate-400">Articles</p>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-amber-400">{allTags.length}</span>
                            <p className="text-sm text-slate-400">Topics</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Enhanced Search and Filter Bar */}
            <div className="container mx-auto px-4">
                <motion.div
                    className="relative z-10 mb-8"
                    layout
                >
                    <div className="bg-slate-900/50 backdrop-blur-lg rounded-lg border border-amber-500/20 p-6">
                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="pl-10 h-12 bg-slate-800/50 border-amber-500/20 focus:border-amber-500/50"
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="h-12 border-amber-500/20 hover:bg-amber-500/10"
                                onClick={() => setShowTagPanel(!showTagPanel)}
                            >
                                <TagIcon className="mr-2 h-4 w-4" />
                                Filter by Tags ({filters.tags.length})
                            </Button>
                        </div>

                        {/* Popular Tags */}
                        <div className="flex flex-wrap gap-2">
                            {Array.from(tagStats)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 8)
                                .map(([tag, count]) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className={`cursor-pointer transition-all ${filters.tags.includes(tag)
                                            ? "bg-amber-500 text-slate-900"
                                            : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                            }`}
                                        onClick={() => {
                                            filters.tags.includes(tag)
                                                ? handleTagRemove(tag)
                                                : handleTagSelect(tag);
                                        }}
                                    >
                                        {tag} ({count})
                                    </Badge>
                                ))}
                        </div>

                        {/* Tag Panel */}
                        <AnimatePresence>
                            {showTagPanel && (
                                <TagPanel
                                    allTags={allTags}
                                    selectedTags={filters.tags}
                                    onTagSelect={handleTagSelect}
                                    onTagRemove={handleTagRemove}
                                />
                            )}
                        </AnimatePresence>

                        {/* Active Filters */}
                        <AnimatePresence>
                            {(filters.tags.length > 0 || filters.search) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4 flex items-center gap-2 flex-wrap"
                                >
                                    <span className="text-sm text-slate-400">Active filters:</span>
                                    {filters.tags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="bg-amber-500/10 text-amber-300"
                                        >
                                            {tag}
                                            <XIcon
                                                className="ml-2 h-3 w-3 cursor-pointer"
                                                onClick={() => handleTagRemove(tag)}
                                            />
                                        </Badge>
                                    ))}
                                    {filters.search && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-amber-500/10 text-amber-300"
                                        >
                                            "{filters.search}"
                                            <XIcon
                                                className="ml-2 h-3 w-3 cursor-pointer"
                                                onClick={() => setFilters({ ...filters, search: '' })}
                                            />
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFilters({ tags: [], search: '' })}
                                        className="text-slate-400 hover:text-amber-300"
                                    >
                                        Clear all
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 mb-6"
                >
                    Found {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                    {(filters.tags.length > 0 || filters.search) && ' matching your criteria'}
                </motion.div>

                {/* Posts Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No Results Message */}
                {filteredPosts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <BookOpenIcon className="mx-auto h-12 w-12 text-slate-500" />
                        <h3 className="mt-4 text-lg font-medium text-slate-300">No posts found</h3>
                        <p className="mt-2 text-slate-400">Try adjusting your search or filter criteria</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
