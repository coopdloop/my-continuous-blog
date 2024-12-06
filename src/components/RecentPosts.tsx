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
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold bg-clip-text dark:text-transparent bg-gradient-to-r from-amber-200 via-purple-400 to-amber-200">
                    Latest Insights
                </h2>
                <p className="mt-2">
                    Explore my most recent engineering discoveries
                </p>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.slice(0, 3).map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                    >
                        <Link to={`/post/${post.slug}`}>
                            <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                                <motion.img
                                    src={post.frontmatter.image.url}
                                    alt={post.frontmatter.image.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                                        <CalendarIcon className="w-4 h-4 text-amber-500" />
                                        <span>{new Date(post.frontmatter.pubDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200 group-hover:text-amber-300 transition-colors mb-2">
                                {post.frontmatter.title}
                            </h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                {post.frontmatter.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {post.frontmatter.tags.slice(0, 4).map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-amber-500/10 text-amber-300"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
};
