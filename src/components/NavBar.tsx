import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { HomeIcon, InfoIcon, TagIcon, CodeIcon, MenuIcon, XIcon } from 'lucide-react'
import CoffeeButton from './coffee/BuyMeACoffeeButton';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => (
    <Link to={to}>
      <Button variant={isActive(to) ? "default" : "ghost"} size="sm" className="w-full justify-start">
        {icon}
        <span className="ml-2">{children}</span>
      </Button>
    </Link>
  );

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-blue-500">
                Cooper's Blog
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
            <NavLink to="/tags" icon={<TagIcon className="h-4 w-4" />}>Tags</NavLink>
            <NavLink to="/about" icon={<InfoIcon className="h-4 w-4" />}>About</NavLink>
            <a href="https://github.com/coopdloop/my-continuous-blog" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <CodeIcon className="mr-2 h-4 w-4" />
                Source
              </Button>
            </a>
            <CoffeeButton />
            <ModeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />}>Home</NavLink>
          <NavLink to="/tags" icon={<TagIcon className="h-4 w-4" />}>Tags</NavLink>
          <NavLink to="/about" icon={<InfoIcon className="h-4 w-4" />}>About</NavLink>
          <a href="https://github.com/coopdloop/my-continuous-blog" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <CodeIcon className="mr-2 h-4 w-4" />
              Source
            </Button>
          </a>
          <div className="flex justify-between items-center">
            <CoffeeButton />
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
