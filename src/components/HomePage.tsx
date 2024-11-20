import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllPosts } from '@/utils/markdown-loader';
import { BlogPost } from '@/types/blog';
import { RecentPosts } from './RecentPosts';

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const fetchedPosts = getAllPosts();
        setPosts(fetchedPosts.slice(0,3));
    }, []);

    return (
        <div className="relative">
            {/* Hero Section */}
            <div className="relative mb-16">

                {/* Ambient Effects */}
                <div className="absolute inset-0 -z-5">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
                </div>


                <div className="relative pb-4 px-4">
                    <motion.div
                        className="max-w-4xl mx-auto text-center space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-6xl md:text-7xl font-black"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-purple-400 to-amber-200">
                                Engineering Beyond Boundaries
                            </span>
                        </motion.h1>

                        <motion.div
                            className="prose prose-invert mx-auto max-w-2xl space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <p className="text-xl text-slate-300 leading-relaxed">
                                Welcome to a realm where engineering transcends the ordinary—where
                                visionaries manipulate the fabric of reality itself to forge
                                tomorrow's innovations.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                Like ancient astronomers who moved celestial bodies with mathematical precision,
                                today's engineering geniuses orchestrate complex systems into elegant solutions.
                                Here, we document this eternal dance between human ingenuity and technological possibilities.
                            </p>
                        </motion.div>

                        {/* Floating Elements */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Geometric shapes floating around */}
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: Math.random() * 5 + 5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 border border-amber-500/20 rounded-lg transform rotate-45"
                                        style={{
                                            background: `radial-gradient(circle at center, rgba(251,191,36,0.1) 0%, transparent 70%)`
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Posts Section */}
                <RecentPosts posts={posts} />
            </div>
        </div>
    );
};

export default HomePage;
