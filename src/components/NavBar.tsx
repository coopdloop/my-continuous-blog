import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { HomeIcon, InfoIcon, CodeIcon, MenuIcon, XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import CoffeeButton from './coffee/BuyMeACoffeeButton';

export const NavBar: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
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

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close menu on location change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => (
        <Link to={to}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant={isActive(to) ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start transition-all duration-300 ${
                        isActive(to)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/10"
                    }`}
                >
                    {icon}
                    <span className="ml-2">{children}</span>
                </Button>
            </motion.div>
        </Link>
    );

    return (
        <motion.nav
            className="bg-background/60 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50"
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to="/" className="text-2xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
                                devsec-cooper.codes
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
                        <NavLink to="/about" icon={<InfoIcon className="h-4 w-4" />}>About</NavLink>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a
                                href="https://github.com/coopdloop/my-continuous-blog"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-primary/10"
                                >
                                    <CodeIcon className="mr-2 h-4 w-4" />
                                    Source
                                </Button>
                            </a>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <CoffeeButton />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <ModeToggle />
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="hover:bg-primary/10"
                            >
                                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
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
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-primary/10 bg-background/80 backdrop-blur-md"
                        >
                            <div className="px-4 py-3 space-y-3">
                                <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
                                <NavLink to="/about" icon={<InfoIcon className="h-4 w-4" />}>About</NavLink>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <a
                                        href="https://github.com/coopdloop/my-continuous-blog"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start hover:bg-primary/10"
                                        >
                                            <CodeIcon className="mr-2 h-4 w-4" />
                                            Source
                                        </Button>
                                    </a>
                                </motion.div>
                                <div className="flex justify-between items-center">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <CoffeeButton />
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <ModeToggle />
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
