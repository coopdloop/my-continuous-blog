import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, ListIcon, LinkIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getPostBySlug } from '@/utils/markdown-loader';
import { BlogPost as BlogPostType, TableOfContents } from '@/types/blog';
import { motion } from 'framer-motion';
import MarkdownComponents from './MarkdownComponents';
import { useToast } from "@/hooks/use-toast";
import { SEO } from './SEO';

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
  const location = useLocation();


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


  useEffect(() => {
    if (post) {
      document.title = `${post.frontmatter.title} | Cooper Wallace Blog`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', post.frontmatter.description);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', post.frontmatter.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', post.frontmatter.description);
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', post.frontmatter.image.url);
    }
  }, [post, location]);

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={post.frontmatter.image.url}
        article={true}
        slug={post.slug}
      />
      <div className="min-h-screen flex flex-col relative">
        {/* Sidebar - hidden on mobile */}
        <div className={`fixed top-0 left-0 bottom-0 bg-background/95
                          backdrop-blur-sm border-r border-border
                          hidden lg:block transition-all duration-200 ${showSidebar ? 'w-64 z-40' : 'w-0'}`}>
          <Sidebar
            isOpen={showSidebar}
            onToggle={toggleSidebar}
            tocItems={post.tableOfContents}
            shareUrl={window.location.href}
          />
        </div>
        {/* Main content area */}
        <main className={`flex-1 transition-all duration-200
                            ${showSidebar ? 'lg:pl-64' : 'lg:pl-16'}`}>
          <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <div className="relative mb-4 rounded-xl overflow-hidden">
                <div className="aspect-[21/9] relative">
                  <img
                    src={post.frontmatter.image.url}
                    alt={post.frontmatter.image.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {post.frontmatter.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.frontmatter.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={post.frontmatter.authorImage.url}
                      alt={post.frontmatter.authorImage.alt}
                      className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-medium text-lg">{post.frontmatter.author}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {post.frontmatter.ttr}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReactMarkdown
                    className="blog-post-content"
                    components={MarkdownComponents}
                  >
                    {post.content}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};
