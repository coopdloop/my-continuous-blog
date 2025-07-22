import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/lib/content-loader';
import { BlogPost } from '@/types/blog';
import { RecentPosts } from '../blog/RecentPosts';
import { Terminal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchedPosts = getAllPosts();
    setPosts(fetchedPosts.slice(0, 3));
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Technical Grid Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-black" />
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        {/* Binary Rain Effect */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500/30 text-xs font-mono select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            }}
            animate={{
              y: ["0vh", "110vh"],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
        {/* Glowing Circuit Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <div className="px-4 pt-14 pb-16">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="max-w-6xl mx-auto space-y-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              {/* Compact Hero Section */}
              <div className="text-center space-y-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Compact Terminal Window */}
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl">
                      {/* Terminal Header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50">
                        <div className="flex space-x-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400 text-xs">
                          <Terminal className="w-3 h-3" />
                          <span>devsec-cooper@terminal:~$</span>
                        </div>
                      </div>
                      {/* Terminal Content - Condensed */}
                      <div className="p-4 font-mono text-xs leading-relaxed">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.4 }}
                        >
                          <span className="text-green-400">$ whoami</span><br />
                          <span className="text-slate-300">DevSecOps Engineer | Cloud Security Architect</span><br /><br />

                          <span className="text-green-400">$ cat mission.txt</span><br />
                          <span className="text-cyan-300">
                            Building secure, scalable systems. Automating the critical.
                          </span><br /><br />

                          <motion.span
                            className="text-green-400"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            $ █
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Tech Stack Pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto"
                  >
                    {['Kubernetes', 'Docker', 'AWS', 'Python', 'Go', 'TypeScript'].map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.05 }}
                        className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full text-xs font-medium text-slate-300 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>



                {/* Blog Preview Section - Now the Main Focus */}
                <motion.div
                  className="relative pt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  {/* Enhanced Section Header */}
                  <div className="text-center mb-16">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="relative"
                    >
                      <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
                          Latest Posts
                        </span>
                      </h2>

                      {/* Glowing underline */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mx-auto max-w-xs mb-6"
                      />

                      <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
                        Deep dives into DevSecOps, cloud architecture, and cutting-edge engineering practices
                      </p>
                    </motion.div>

                    {/* Decorative circuit elements */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-purple-500/10 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-8 border border-cyan-500/10 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent blur-3xl" />
                  <RecentPosts posts={posts} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Code Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-500/20 text-xs font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {['{}', '[]', '()', '<>', '/>', '&&', '||', '=>'][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
