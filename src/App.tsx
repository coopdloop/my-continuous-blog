import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from '@/components/layout';
import { HomePage, AboutPage, RSSFeedPage } from '@/components/common';
import { BlogPost, PostsPage } from '@/components/blog';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';

const NotFoundPage: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="font-mono text-sm text-primary mb-2">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">
            ← Return home
        </a>
    </div>
);

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    return (
        <HelmetProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Router>
                    <div className="flex flex-col min-h-screen">
                        <ScrollToTop />
                        <NavBar />
                        <div className="flex-1">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/posts" element={<PostsPage />} />
                                <Route path="/post/:slug" element={<BlogPost />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/rss.xml" element={<RSSFeedPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </div>
                        <Toaster />
                        <footer className="mt-auto border-t border-border py-8">
                            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-muted-foreground">
                                        © 2026 Cooper Wallace
                                    </p>
                                    <p className="text-xs text-muted-foreground/50 font-mono">
                                        v{__APP_VERSION__}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <a
                                            href="https://www.linkedin.com/in/cooper-wallace-0a572a158"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            LinkedIn
                                        </a>
                                        <a
                                            href="https://www.github.com/coopdloop"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            GitHub
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </Router>
            </ThemeProvider>
        </HelmetProvider>
    );
};

export default App;
