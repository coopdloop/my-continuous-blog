import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface RecentPostsProps {
    posts: BlogPost[];
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ posts }) => {
    return (
        <div className="relative py-4">
            {/* Posts Grid - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {posts.slice(0, 3).map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1.8 + index * 0.2, duration: 0.6 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group relative"
                    >
                        <Link to={`/post/${post.slug}`}>
                            {/* Enhanced Card with Glow Effect */}
                            <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                                {/* Image Section */}
                                <div className="relative h-52 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />
                                    <motion.img
                                        src={post.frontmatter.image.url}
                                        alt={post.frontmatter.image.alt}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Floating Date Badge */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="bg-purple-500/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-2">
                                            <CalendarIcon className="w-3 h-3 text-white" />
                                            <span className="text-white text-xs font-medium">
                                                {new Date(post.frontmatter.pubDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-3 line-clamp-2">
                                        {post.frontmatter.title}
                                    </h3>
                                    <p className="text-slate-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                                        {post.frontmatter.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {post.frontmatter.tags.slice(0, 3).map(tag => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 text-xs hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Read More Indicator */}
                                    <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                                        <span>Read More</span>
                                        <motion.div
                                            className="ml-2"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            →
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-xl" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
                />
            </div>
        </div>
    );
};
