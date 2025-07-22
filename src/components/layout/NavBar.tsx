import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { HomeIcon, InfoIcon, CodeIcon, MenuIcon, XIcon, BookOpenIcon, RssIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLinkProps {
    to: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export const NavBar: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [lastScrollY, setLastScrollY] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string): boolean => location.pathname === path;

    useEffect(() => {
        const handleScroll = (): void => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 20) {
                setIsVisible(false);
                setIsMenuOpen(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const NavLink: React.FC<NavLinkProps> = ({ to, icon, children }) => (
        <Link to={to}>
            <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                <Button
                    variant={isActive(to) ? "default" : "ghost"}
                    size="sm"
                    className={`relative w-full justify-start transition-all duration-300 border ${isActive(to)
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-purple-400/50 shadow-lg shadow-purple-500/25"
                        : "hover:bg-purple-500/10 text-slate-200 border-transparent hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10"
                        }`}
                >
                    {icon}
                    <span className="ml-2 font-medium">{children}</span>
                    {isActive(to) && (
                        <motion.div
                            className="absolute -bottom-1 left-1/2 w-4 h-0.5 bg-cyan-400 rounded-full"
                            layoutId="activeTab"
                            initial={false}
                            style={{ x: '-50%' }}
                        />
                    )}
                </Button>
            </motion.div>
        </Link>
    );

    return (
        <motion.nav
            className="bg-slate-950/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50 shadow-lg shadow-purple-500/5"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3 }}
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">
                    <motion.div
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
                                    <CodeIcon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="text-xl font-bold">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 font-mono">
                                    devsec-cooper.codes
                                </span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
                        <NavLink to="/about" icon={<InfoIcon className="h-4 w-4" />}>About</NavLink>
                        <NavLink to="/posts" icon={<BookOpenIcon className="h-4 w-4" />}>Posts</NavLink>
                        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                            <a
                                href="https://github.com/coopdloop/my-continuous-blog"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="border border-transparent hover:border-purple-500/30 hover:bg-purple-500/10 text-slate-200 hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300"
                                >
                                    <CodeIcon className="mr-2 h-4 w-4" />
                                    Source
                                </Button>
                            </a>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                            <ModeToggle />
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                            <Link to="/rss.xml" className="flex items-center p-2 rounded-md border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300">
                                <RssIcon className="h-4 w-4 text-cyan-400 hover:text-cyan-300" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="border border-transparent hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300"
                            >
                                <motion.div
                                    animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isMenuOpen ? <XIcon className="h-6 w-6 text-slate-200" /> : <MenuIcon className="h-6 w-6 text-slate-200" />}
                                </motion.div>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div ref={menuRef}>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden border-t border-purple-500/20 bg-slate-900/95 backdrop-blur-md shadow-lg"
                        >
                            <div className="px-4 py-4 space-y-3">
                                <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
                                <NavLink to="/about" icon={<InfoIcon className="h-4 w-4" />}>About</NavLink>
                                <NavLink to="/posts" icon={<BookOpenIcon className="h-4 w-4" />}>Posts</NavLink>
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <a
                                        href="https://github.com/coopdloop/my-continuous-blog"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start border border-transparent hover:border-purple-500/30 hover:bg-purple-500/10 text-slate-200 transition-all duration-300"
                                        >
                                            <CodeIcon className="mr-2 h-4 w-4" />
                                            Source
                                        </Button>
                                    </a>
                                </motion.div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <ModeToggle />
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.1 }}>
                                        <Link to="/rss.xml" className="flex items-center p-2 rounded-md border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all duration-300">
                                            <RssIcon className="h-4 w-4 text-cyan-400" />
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};
