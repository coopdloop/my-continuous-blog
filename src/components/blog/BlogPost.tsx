import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, ListIcon, LinkIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getPostBySlug } from '@/lib/content-loader';
import { BlogPost as BlogPostType, TableOfContents } from '@/types/blog';
import { motion } from 'framer-motion';
import MarkdownComponents from './MarkdownComponents';
import { useToast } from "@/hooks/use-toast";
import { SEO } from '../layout/SEO';

const Sidebar: React.FC<{
    isOpen: boolean;
    onToggle: () => void;
    tocItems: TableOfContents[];
    shareUrl: string;
}> = ({ isOpen, onToggle, tocItems, shareUrl }) => {
    const { toast } = useToast();
    const [activeId, setActiveId] = useState<string>('');
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Intersection Observer for tracking visible headers
        const observer = new IntersectionObserver(
            (entries) => {
                // Find the first visible header
                const visibleEntry = entries.find(entry => entry.isIntersecting);
                if (visibleEntry) {
                    setActiveId(visibleEntry.target.id);

                    // Find and scroll the sidebar item into view
                    const sidebarItem = navRef.current?.querySelector(`[data-header-id="${visibleEntry.target.id}"]`);
                    if (sidebarItem) {
                        const navContainer = navRef.current;
                        if (navContainer) {
                            // Calculate positions
                            const itemRect = sidebarItem.getBoundingClientRect();
                            const containerRect = navContainer.getBoundingClientRect();

                            // Check if item is outside visible area
                            if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
                                // Scroll with offset to center the item
                                const scrollOffset = itemRect.top - containerRect.top - (containerRect.height / 2) + (itemRect.height / 2);
                                navContainer.scrollBy({
                                    top: scrollOffset,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }
                }
            },
            {
                rootMargin: '-100px 0px -66% 0px',
                threshold: 0.2
            }
        );

        document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]').forEach((elem) => {
            observer.observe(elem);
        });

        return () => observer.disconnect();
    }, [tocItems]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast({
                title: "Link copied!",
                description: "URL copied to clipboard",
                duration: 2000,
            });
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please try again",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const scrollToHeader = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col sticky top-16">
            {/* Share button - fixed at top */}
            <div className={`flex-none border-b border-border bg-background/95 ${isOpen ? "" : "hidden"}`}>
                <div className="p-4">
                    <button
                        onClick={handleShare}
                        className="flex w-full items-center gap-2 p-2 rounded-lg
                               bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                        <LinkIcon size={16} /> Share post URL
                    </button>
                </div>
            </div>

            {/* Collapse button */}
            <button
                onClick={onToggle}
                className="absolute right-0 top-20 -mr-8 p-1.5 rounded-l-md bg-background
                          border border-r-0 border-border hover:bg-primary/10 transition-colors"
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isOpen ?

                    <ChevronLeftIcon size={20}
                        className={`transition-transform duration-200`}
                    />
                    :

                    <ChevronRightIcon size={20}
                        className={`transition-transform duration-200`}
                    />
                }

            </button>

            {/* Scrollable content area */}
            <div
                ref={navRef}
                className={`flex-1 overflow-y-auto transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="p-4">
                    {tocItems.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ListIcon size={18} /> Contents
                            </h3>
                            <nav className="space-y-1">
                                {tocItems.map((item) => (
                                    <button
                                        key={item.id}
                                        data-header-id={item.id}
                                        onClick={() => scrollToHeader(item.id)}
                                        className={`
                                            block w-full text-left py-1.5 pl-4 -ml-px border-l
                                            ${activeId === item.id
                                                ? 'border-primary text-primary font-medium'
                                                : 'border-transparent hover:border-primary/50 text-muted-foreground hover:text-foreground'
                                            }
                                            ${item.level === 1 ? 'text-base' : 'text-sm'}
                                            transition-colors duration-200
                                        `}
                                        style={{ paddingLeft: `${(item.level - 0.5) * 1}rem` }}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const BlogPost: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const { slug } = useParams<{ slug: string }>();
    const post = getPostBySlug(slug || '') as BlogPostType | undefined;
    // const location = useLocation();


    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    if (!post) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-lg text-muted-foreground">Post not found</p>
            </div>
        );
    }

    const formattedDate = new Date(post.frontmatter.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });


    return (
        <>
            <SEO
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                image={post.frontmatter.image.url}
                article={true}
                slug={post.slug}
                publishDate={post.frontmatter.pubDate}
                readingTime={post.frontmatter.ttr}
                author={post.frontmatter.author}
            />
            <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
                {/* Cyberpunk Background Effects */}
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black" />
                    {/* Animated Matrix Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                    {/* Binary Rain Effect */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-green-500/20 text-xs font-mono select-none"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                            }}
                            animate={{
                                y: ["0vh", "110vh"],
                            }}
                            transition={{
                                duration: Math.random() * 15 + 10,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 15,
                            }}
                        >
                            {Math.random() > 0.5 ? '1' : '0'}
                        </motion.div>
                    ))}

                    {/* Glowing Circuit Lines */}
                    <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                    <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                    {/* Floating Code Particles */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-purple-500/10 text-xs font-mono"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                x: [0, Math.random() * 10 - 5, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: Math.random() * 6 + 6,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        >
                            {['{}', '[]', '()', '<>', '/>', '&&', '||', '=>'][Math.floor(Math.random() * 8)]}
                        </motion.div>
                    ))}
                </div>

                {/* Terminal-Style Sidebar */}
                <div className={`fixed top-0 left-0 bottom-0 bg-slate-900/95 backdrop-blur-lg
                          border-r border-green-500/20 hidden lg:block transition-all duration-200 ${showSidebar ? 'w-64 z-40' : 'w-0'}`}>
                    <div className="h-full flex flex-col">
                        <Sidebar
                            isOpen={showSidebar}
                            onToggle={toggleSidebar}
                            tocItems={post.tableOfContents}
                            shareUrl={window.location.href}
                        />
                    </div>
                </div>

                {/* Main content area */}
                <main className={`flex-1 transition-all duration-200 ${showSidebar ? 'lg:pl-64' : 'lg:pl-16'}`}>
                    <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Cyberpunk Hero Section */}
                            <div className="relative mb-8 rounded-xl overflow-hidden border border-purple-500/20">
                                <div className="aspect-[21/9] relative">
                                    <img
                                        src={post.frontmatter.image.url}
                                        alt={post.frontmatter.image.alt}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-purple-900/30 to-transparent" />

                                    {/* Glitch Effect Overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
                                        animate={{
                                            opacity: [0, 0.3, 0, 0.1, 0],
                                            x: [0, 2, 0, -1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                                    <motion.h1
                                        className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-mono"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="text-green-400">$</span> {post.frontmatter.title}
                                    </motion.h1>

                                    <motion.div
                                        className="flex flex-wrap gap-2 mb-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {post.frontmatter.tags.map((tag, index) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-200 font-mono text-xs hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300"
                                                >
                                                    #{tag}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Terminal-Style Article Card */}
                            <Card className="bg-slate-900/90 backdrop-blur-lg border border-green-500/20 shadow-2xl">
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/20 bg-slate-800/50">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                </div>

                                <CardHeader className="bg-slate-800/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <motion.img
                                            src={post.frontmatter.authorImage.url}
                                            alt={post.frontmatter.authorImage.alt}
                                            className="w-12 h-12 rounded-full ring-2 ring-green-500/30 border border-cyan-500/20"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        />
                                        <div>
                                            <p className="font-medium text-lg text-green-400 font-mono">
                                                {post.frontmatter.author}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-slate-400 font-mono">
                                                <span className="flex items-center gap-1">
                                                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                                                    {formattedDate}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ClockIcon className="w-4 h-4 text-cyan-400" />
                                                    {post.frontmatter.ttr}
                                                </span>
                                                <span className="text-green-500">
                                                    [ACTIVE]
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="bg-slate-900/50">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                    >
                                        <ReactMarkdown
                                            className="blog-post-content text-slate-200"
                                            components={MarkdownComponents}
                                        >
                                            {post.content}
                                        </ReactMarkdown>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </main>
            </div>
        </>
    );
};
