import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { CalendarIcon, ClockIcon, ListIcon, LinkIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getPostBySlug } from '@/lib/content-loader';
import { BlogPost as BlogPostType, TableOfContents } from '@/types/blog';
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
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries.find(entry => entry.isIntersecting);
                if (visibleEntry) {
                    setActiveId(visibleEntry.target.id);
                    const sidebarItem = navRef.current?.querySelector(`[data-header-id="${visibleEntry.target.id}"]`);
                    if (sidebarItem) {
                        const navContainer = navRef.current;
                        if (navContainer) {
                            const itemRect = sidebarItem.getBoundingClientRect();
                            const containerRect = navContainer.getBoundingClientRect();
                            if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
                                const scrollOffset = itemRect.top - containerRect.top - (containerRect.height / 2) + (itemRect.height / 2);
                                navContainer.scrollBy({ top: scrollOffset, behavior: 'smooth' });
                            }
                        }
                    }
                }
            },
            { rootMargin: '-100px 0px -66% 0px', threshold: 0.2 }
        );

        document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]').forEach(elem => observer.observe(elem));
        return () => observer.disconnect();
    }, [tocItems]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast({ title: "Link copied!", description: "URL copied to clipboard", duration: 2000 });
        } catch {
            toast({ title: "Failed to copy", description: "Please try again", variant: "destructive", duration: 2000 });
        }
    };

    const scrollToHeader = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 72;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className="h-[calc(100vh-56px)] flex flex-col sticky top-14">
            {isOpen && (
                <div className="flex-none border-b border-border p-3">
                    <button
                        onClick={handleShare}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        <LinkIcon size={14} />
                        Share post
                    </button>
                </div>
            )}

            <button
                onClick={onToggle}
                className="absolute right-0 top-16 -mr-7 p-1.5 rounded-r border border-l-0 border-border bg-card hover:bg-accent transition-colors"
                aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isOpen ? <ChevronLeftIcon size={14} /> : <ChevronRightIcon size={14} />}
            </button>

            <div
                ref={navRef}
                className={`flex-1 overflow-y-auto transition-opacity duration-150 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                {isOpen && tocItems.length > 0 && (
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            <ListIcon size={12} />
                            Contents
                        </div>
                        <nav className="space-y-0.5">
                            {tocItems.map(item => (
                                <button
                                    key={item.id}
                                    data-header-id={item.id}
                                    onClick={() => scrollToHeader(item.id)}
                                    className={`block w-full text-left py-1 pl-3 -ml-px border-l text-xs transition-colors ${
                                        activeId === item.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
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
    );
};

export const BlogPost: React.FC = () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const { slug } = useParams<{ slug: string }>();
    const post = getPostBySlug(slug || '') as BlogPostType | undefined;

    if (!post) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-sm text-muted-foreground">Post not found</p>
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
            <div className="min-h-screen flex">
                {/* Sidebar */}
                <aside className={`hidden lg:block flex-none border-r border-border bg-card transition-all duration-200 ${showSidebar ? 'w-60' : 'w-8'}`}>
                    <Sidebar
                        isOpen={showSidebar}
                        onToggle={() => setShowSidebar(!showSidebar)}
                        tocItems={post.tableOfContents}
                        shareUrl={window.location.href}
                    />
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                        {/* Hero image */}
                        <div className="mb-8 rounded-lg overflow-hidden border border-border aspect-[21/9]">
                            <img
                                src={post.frontmatter.image.url}
                                alt={post.frontmatter.image.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Post header */}
                        <div className="mb-8 space-y-4">
                            <div className="flex flex-wrap gap-1.5">
                                {post.frontmatter.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground border border-border"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-3xl font-bold text-foreground leading-tight">
                                {post.frontmatter.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <img
                                    src={post.frontmatter.authorImage.url}
                                    alt={post.frontmatter.authorImage.alt}
                                    className="w-8 h-8 rounded-full border border-border"
                                />
                                <div className="flex items-center gap-3">
                                    <span className="text-foreground font-medium">{post.frontmatter.author}</span>
                                    <span className="flex items-center gap-1">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {formattedDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        {post.frontmatter.ttr}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-border" />
                        </div>

                        {/* Article body */}
                        <div className="blog-post-content text-foreground">
                            <ReactMarkdown components={MarkdownComponents}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
