import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from '@/components/NavBar';
import { HomePage } from '@/components/HomePage';
import { BlogPost } from '@/components/BlogPost';
import { AboutPage } from '@/components/AboutPage';
import { motion } from 'framer-motion';

const App: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <div className="min-h-screen bg-background text-foreground flex flex-col relative">
                    <NavBar />
                    <main className="flex-grow container mx-auto px-4 py-4 cyber-grid transition-all">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/post/:slug" element={<BlogPost />} />
                            <Route path="/about" element={<AboutPage />} />
                        </Routes>
                    </main>
                    <footer className="bg-background/80 backdrop-blur-md border-t border-primary/10 py-4">
                        <div className="container mx-auto max-w-7xl px-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div className="text-center md:text-left">
                                    <motion.p
                                        className="text-sm text-muted-foreground"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        © 2024 Cooper Wallace. All rights reserved.
                                    </motion.p>
                                </div>
                                <div className="flex justify-center space-x-6">
                                    <motion.a
                                        href='https://www.linkedin.com/in/cooper-wallace-0a572a158'
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img src="/public/linkedin.png" className='w-5 h-5' alt='linkedin' />
                                        <span>LinkedIn</span>
                                    </motion.a>
                                    <motion.a
                                        href='https://www.github.com/coopdloop'
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img src="/public/github.png" className='w-5 h-5' alt='github' />
                                        <span>GitHub</span>
                                    </motion.a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
