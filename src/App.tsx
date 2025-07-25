import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from '@/components/layout';
import { HomePage, AboutPage, RSSFeedPage } from '@/components/common';
import { BlogPost, PostsPage } from '@/components/blog';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedBackground } from '@/components/effects';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';

// Not Found Page Component
const NotFoundPage: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Page Not Found</h2>
            <p className="text-slate-400 mb-8">Oops! The page you're looking for doesn't exist.</p>
            <motion.a
                href="/"
                className="inline-block px-6 py-3 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Return Home
            </motion.a>
        </motion.div>
    </div>
);

// Scroll to top component
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

interface PageTransitionProps {
    children: React.ReactNode;
}

interface FooterLinkProps {
    href: string;
    icon: string;
    label: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const FooterLink: React.FC<FooterLinkProps> = ({ href, icon, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
    >
        <img src={icon} className="w-5 h-5" alt={label} />
        <span>{label}</span>
    </motion.a>
);

const App: React.FC = () => {
    return (
        <HelmetProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Router>
                    <div className="flex flex-col min-h-screen">
                        <ScrollToTop />

                        <EnhancedBackground />

                        {/* Ambient Overlay Effects */}
                        <div className="fixed inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-purple-500/5" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                        </div>


                        {/* Main Content */}
                        <NavBar />
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={
                                    <PageTransition>
                                        <HomePage />
                                    </PageTransition>
                                } />
                                <Route path="/posts" element={
                                    <PageTransition>
                                        <PostsPage />
                                    </PageTransition>
                                } />
                                <Route path="/post/:slug" element={
                                    <PageTransition>
                                        <BlogPost />
                                    </PageTransition>
                                } />
                                <Route path="/about" element={
                                    <PageTransition>
                                        <AboutPage />
                                    </PageTransition>
                                } />
                                <Route path="/rss.xml" element={<RSSFeedPage />} />
                                {/* 404 catch-all route */}
                                <Route path="*" element={
                                    <PageTransition>
                                        <NotFoundPage />
                                    </PageTransition>
                                } />
                            </Routes>
                        </AnimatePresence>
                        <Toaster />

                        {/* Footer */}
                        <footer className="mt-auto border-t border-amber-500/10 bg-slate-950/50 backdrop-blur-md py-8">
                            <div className="container mx-auto max-w-7xl px-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    <motion.div
                                        className="text-center md:text-left"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <p className="text-sm text-slate-400">
                                            © 2024 Cooper Wallace. All rights reserved.
                                        </p>
                                    </motion.div>
                                    <div className="flex justify-center space-x-6">
                                        <FooterLink
                                            href="https://www.linkedin.com/in/cooper-wallace-0a572a158"
                                            icon="/linkedin.png"
                                            label="LinkedIn"
                                        />
                                        <FooterLink
                                            href="https://www.github.com/coopdloop"
                                            icon="/github.png"
                                            label="GitHub"
                                        />
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
