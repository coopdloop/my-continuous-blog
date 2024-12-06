import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/utils/markdown-loader';
import { BlogPost } from '@/types/blog';
import { RecentPosts } from './RecentPosts';
import { Star } from 'lucide-react';
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
        <div className="relative min-h-screen  overflow-hidden">
            {/* Ambient Space Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b " />
                {/* Planet */}
                <div className="absolute top-20 right-20 w-48 h-48 rounded-full  blur-sm" />
                {/* Stars */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </div>

            <div className="px-4 pt-14 pb-16">
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            className="max-w-4xl mx-auto space-y-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.2 }}
                        >
                            {/* Hero Section */}
                            <div className="text-center space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200">
                                            Engineering Expertise
                                        </span>
                                    </h1>
                                    <p className="text-lg md:text-xl  max-w-2xl mx-auto leading-relaxed">
                                        I build software at the edge of possibility.
                                        Where human ingenuity meets artificial intelligence
                                        to create systems of unprecedented capability.
                                    </p>
                                </motion.div>

                                {/* Divider */}
                                <motion.div
                                    className="flex items-center justify-center space-x-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                                    <Star className="w-4 h-4 dark:text-orange-500/50 text-yellow-400" />
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                                </motion.div>

                                {/* Blog Preview Section */}
                                <motion.div
                                    className="relative pt-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/5 to-transparent blur-3xl" />
                                    <RecentPosts posts={posts} />
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: Math.random() * 8 + 8,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-orange-500/20" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
