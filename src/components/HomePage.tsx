import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CalendarIcon, ClockIcon, UserIcon, SearchIcon } from 'lucide-react'
import { motion } from 'framer-motion';
import { getAllPosts } from '@/utils/markdown-loader';
import { BlogPost } from '@/types/blog';

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchedPosts = getAllPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post =>
            (selectedTags.length === 0 || selectedTags.every(tag => post.frontmatter.tags.includes(tag))) &&
            (post.frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.frontmatter.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPosts(filtered);
    }, [selectedTags, searchTerm, posts]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const allTags = Array.from(new Set(posts.flatMap(post => post.frontmatter.tags)));

    return (
        <div className="min-h-screen p-4 md:p-8">
            <motion.div
                className="max-w-7xl mx-auto space-y-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <header className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-primary tracking-tight">
                        My Security Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explore the latest in cyber security, from cutting-edge research to practical tips for staying safe online.
                    </p>
                </header>

                <div className="flex flex-col justify-between items-start gap-6">
                    <div className="relative w-full md:items-center">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full bg-background/50 backdrop-blur-sm border-primary/10"
                        />
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <p className="text-center w-full">Tags:</p>
                        <div className="w-full grid md:grid-cols-6 grid-cols-2 justify-center gap-2 md:h-min overflow-auto">
                            {allTags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors h-10"
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                >
                    {filteredPosts.map((post) => (
                        <motion.div
                            key={post.slug}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 }
                            }}
                        >
                            <Link to={`/post/${post.slug}`}>
                                <Card className="h-full hover:glow transition-all duration-300 bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden group">
                                    <CardHeader className="p-0">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={post.frontmatter.image.url}
                                                alt={post.frontmatter.image.alt}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                            <CardTitle className="absolute bottom-4 left-4 right-4 text-2xl font-bold text-primary z-10">
                                                {post.frontmatter.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <CardDescription className="text-muted-foreground">
                                            {post.frontmatter.description}
                                        </CardDescription>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{new Date(post.frontmatter.pubDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>{post.frontmatter.ttr}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex flex-col items-start space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <UserIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{post.frontmatter.author}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {post.frontmatter.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};
