import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from '@/components/NavBar';
import { HomePage } from '@/components/HomePage';
import { BlogPost } from '@/components/BlogPost';
import { AboutPage } from '@/components/AboutPage';
import { TagsPage } from '@/components/TagsPage';
import CoffeeWidget from './components/coffee/BuyMeACoffeeWidget';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 py-4 cyber-grid transition-all">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:slug" element={<BlogPost />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tags" element={<TagsPage />} />
            </Routes>
          </main>
          <footer className="bg-slate-800 border-t py-2 text-md flex flex-col gap-2 items-center">
            <div className="container mx-auto text-center">
              © 2024 Cooper Wallace. All rights reserved.
            </div>
            <a
              href='https://www.linkedin.com'
              target='_blank'
              className='flex gap-2'>
              <img src="/public/linkedin.png" className='w-6 h-6' alt='linkedin' />
              Linkedin
            </a>
            <a
              href='https://www.github.com'

              target='_blank'
              className='flex gap-2'>
              <img src="/public/github.png" className='w-6 h-6' alt='linkedin' />
              Github
            </a>

          </footer>
        </div>
        <CoffeeWidget />
      </Router>
    </ThemeProvider>
  );
}

export default App;
