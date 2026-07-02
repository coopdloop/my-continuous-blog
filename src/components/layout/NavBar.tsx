import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RssIcon, CodeIcon, MenuIcon, XIcon } from 'lucide-react';

export const NavBar: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/posts', label: 'Posts' },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    <Link
                        to="/"
                        className="font-mono text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        devsec-cooper.codes
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                                    isActive(to)
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/coopdloop/my-continuous-blog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <CodeIcon className="h-3.5 w-3.5" />
                            Source
                        </a>
                        <Link
                            to="/rss.xml"
                            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            aria-label="RSS feed"
                        >
                            <RssIcon className="h-4 w-4" />
                        </Link>
                    </div>

                    <button
                        className="md:hidden p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="max-w-4xl mx-auto px-4 py-2 space-y-1">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center px-3 py-2 rounded text-sm transition-colors ${
                                    isActive(to)
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                        <a
                            href="https://github.com/coopdloop/my-continuous-blog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <CodeIcon className="h-3.5 w-3.5" />
                            Source
                        </a>
                        <Link
                            to="/rss.xml"
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <RssIcon className="h-3.5 w-3.5" />
                            RSS
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
