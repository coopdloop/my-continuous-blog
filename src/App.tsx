import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from '@/components/NavBar';
import { HomePage } from '@/components/HomePage';
import { BlogPost } from '@/components/BlogPost';
import { AboutPage } from '@/components/AboutPage';
import { motion, AnimatePresence } from 'framer-motion';
import CosmiBackground from '@/components/CosmicBackground';
import { PostsPage } from './components/PostsPage';

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
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                {/* Cosmic Background as the first child */}
                <CosmiBackground />

                <div className="min-h-screen relative flex flex-col overflow-x-hidden">
                    {/* Ambient Overlay Effects */}
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-purple-500/5" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col min-h-screen">
                        <NavBar />
                        <main className="flex-grow container mx-auto px-4 py-4">
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
                                </Routes>
                            </AnimatePresence>
                        </main>

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
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;
