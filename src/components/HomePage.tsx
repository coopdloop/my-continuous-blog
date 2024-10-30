import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    CalendarIcon,
    ClockIcon,
    SearchIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XIcon,
    TagIcon,
    FilterIcon,
    BinaryIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPosts } from '@/utils/markdown-loader';
import { BlogPost } from '@/types/blog';

const RECENT_SEARCHES_KEY = 'blog-recent-searches';
const MAX_RECENT_SEARCHES = 4;

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showTagPanel, setShowTagPanel] = useState(false);
    const [activeFilters, setActiveFilters] = useState(0);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const postsPerPage = 6;

    // Pagination function
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    // Calculate popular tags from posts
    useEffect(() => {
        const tagCounts = posts.reduce((acc, post) => {
            post.frontmatter.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        const sortedTags = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        setPopularTags(sortedTags);
    }, [posts]);

    useEffect(() => {
        const fetchedPosts = getAllPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post =>
            (selectedTags.length === 0 || selectedTags.every(tag => post.frontmatter.tags.includes(tag))) &&
            (post.frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.frontmatter.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPosts(filtered);
        setCurrentPage(1);
        setActiveFilters(selectedTags.length + (searchTerm ? 1 : 0));
    }, [selectedTags, searchTerm, posts]);

    const allTags = Array.from(new Set(posts.flatMap(post => post.frontmatter.tags)));
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const clearFilters = () => {
        setSelectedTags([]);
        setSearchTerm('');
        setShowTagPanel(false);
    };

    // Update recent searches when search is performed
    const handleSearch = (term: string) => {
        if (!term.trim()) return;

        setSearchTerm(term);

        // Update recent searches
        const updatedSearches = [
            term,
            ...recentSearches.filter(search => search !== term)
        ].slice(0, MAX_RECENT_SEARCHES);

        setRecentSearches(updatedSearches);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    };

    const SearchPanel = () => (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-background/95 backdrop-blur-lg rounded-lg border border-primary/20 shadow-lg z-50"
        >
            <div className="space-y-4">
                {/* Recent Searches Section */}
                {recentSearches.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <SearchIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">Recent Searches</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setRecentSearches([]);
                                    localStorage.removeItem(RECENT_SEARCHES_KEY);
                                }}
                                className="text-xs text-muted-foreground hover:text-primary"
                            >
                                Clear history
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {recentSearches.map((term) => (
                                <motion.div
                                    key={term}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-sm group"
                                        onClick={() => handleSearch(term)}
                                    >
                                        <SearchIcon className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary" />
                                        {term}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Tags Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <TagIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Popular Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map(({ tag, count }) => (
                            <motion.div
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => setSelectedTags(prev =>
                                        prev.includes(tag) ? prev : [...prev, tag]
                                    )}
                                >
                                    {tag}
                                    <span className="ml-1 text-xs text-muted-foreground">
                                        ({count})
                                    </span>
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screenrelative overflow-hidden">
            {/* Background elements */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    backgroundSize: ['100% 100%', '120% 120%']
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
                }}
            />

            <div className="relative p-4 md:p-8">
                <motion.div
                    className="max-w-7xl mx-auto space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Header */}
                    <motion.header
                        className="text-center space-y-6"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                    >
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary pb-2">
                            My Security Blog
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore the latest in cyber security, from cutting-edge research to practical tips for staying safe online.
                        </p>
                    </motion.header>

                    {/* Search and Filter Interface */}
                    <div className="relative z-20">
                        <motion.div
                            className="flex flex-col md:flex-row gap-4 items-stretch"
                            layout
                        >
                            {/* Search Bar */}
                            <motion.div
                                className="relative flex-grow"
                                layout
                            >
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                                    <Input
                                        type="text"
                                        placeholder="Search posts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(searchTerm);
                                            }
                                        }}
                                        onFocus={() => {
                                            setIsSearchFocused(true)
                                            setShowTagPanel(false)
                                        }}
                                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                        className="pl-10 pr-24 h-12 bg-background/50 border-primary/20 focus:border-primary/50 transition-all"
                                    />

                                    {searchTerm && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {isSearchFocused && <SearchPanel />}
                                </AnimatePresence>
                            </motion.div>

                            {/* Filter Button */}
                            <motion.div layout>
                                <Button
                                    variant="outline"
                                    className="h-12 relative border-primary/20"
                                    onClick={() => setShowTagPanel(!showTagPanel)}
                                >
                                    <FilterIcon className="w-5 h-5 mr-2" />
                                    Filters
                                    {activeFilters > 0 && (
                                        <Badge
                                            variant="default"
                                            className="ml-2 bg-primary text-primary-foreground"
                                        >
                                            {activeFilters}
                                        </Badge>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Active Filters */}
                        <AnimatePresence>
                            {(selectedTags.length > 0 || searchTerm) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-wrap items-center gap-2 mt-4"
                                >
                                    {selectedTags.map((tag) => (
                                        <motion.div
                                            key={tag}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Badge
                                                variant="default"
                                                className="pl-2 pr-1 py-1 bg-primary/20 text-primary flex items-center gap-1"
                                            >
                                                {tag}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto p-1 hover:bg-transparent"
                                                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                </Button>
                                            </Badge>
                                        </motion.div>
                                    ))}
                                    {searchTerm && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Badge
                                                variant="default"
                                                className="pl-2 pr-1 py-1 bg-primary/20 text-primary flex items-center gap-1"
                                            >
                                                Search: {searchTerm}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto p-1 hover:bg-transparent"
                                                    onClick={() => setSearchTerm('')}
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                </Button>
                                            </Badge>
                                        </motion.div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        Clear all
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Tag Panel */}
                        <AnimatePresence>
                            {showTagPanel && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute w-full mt-2 p-4 bg-background/95 backdrop-blur-lg rounded-lg border border-primary/20 shadow-lg z-40"
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
                                                    className="w-full justify-start gap-2 border-primary/20"
                                                    onClick={() => {
                                                        if (selectedTags.includes(tag)) {
                                                            setSelectedTags(prev => prev.filter(t => t !== tag));
                                                        } else {
                                                            setSelectedTags(prev => [...prev, tag]);
                                                        }
                                                    }}
                                                >
                                                    <BinaryIcon className="w-4 h-4" />
                                                    {tag}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Results Summary */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground text-center"
                    >
                        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                    </motion.div>

                    {/* Posts Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {currentPosts.map((post) => (
                                <motion.div
                                    key={post.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="h-full"
                                >
                                    <Link to={`/post/${post.slug}`} className="h-full">
                                        <Card className="h-full bg-background/50 backdrop-blur-lg border-primary/10 overflow-hidden group">
                                            <CardHeader className="p-0">
                                                <div className="relative h-48 overflow-hidden">
                                                    <motion.img
                                                        src={post.frontmatter.image.url}
                                                        alt={post.frontmatter.image.alt}
                                                        className="w-full h-full object-cover"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
                                                    <CardTitle className="absolute bottom-4 left-4 right-4 text-2xl font-bold">
                                                        {post.frontmatter.title}
                                                    </CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-4">
                                                <CardDescription className="text-muted-foreground">
                                                    {post.frontmatter.description}
                                                </CardDescription>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-primary" />
                                                        <span>{new Date(post.frontmatter.pubDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4 text-primary" />
                                                        <span>{post.frontmatter.ttr}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0">
                                                <div className="flex flex-wrap gap-2">
                                                    {post.frontmatter.tags.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <motion.div
                            className="flex justify-center items-center gap-2 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="border-primary/20 hover:bg-primary/10"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </Button>
                            </motion.div>

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <motion.div
                                    key={number}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button
                                        variant={currentPage === number ? "default" : "outline"}
                                        onClick={() => paginate(number)}
                                        className={`w-8 h-8 border-primary/20 ${currentPage === number
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-primary/10"
                                            }`}
                                    >
                                        {number}
                                    </Button>
                                </motion.div>
                            ))}

                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="border-primary/20 hover:bg-primary/10"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div >
        </div >
    );
};
