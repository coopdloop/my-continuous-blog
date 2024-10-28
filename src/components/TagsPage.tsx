import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllPosts } from '@/utils/markdown-loader';
import { BlogPost } from '@/types/blog';


export const TagsPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchedPosts = getAllPosts();
        setPosts(fetchedPosts);
    }, []);

    const allTags = Array.from(new Set(posts.flatMap(post => post.frontmatter.tags)));

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const filteredPosts = posts.filter(post =>
        selectedTags.length === 0 || selectedTags.every(tag => post.frontmatter.tags.includes(tag))
    );

    return (
        <div className="space-y-8">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {allTags.map(tag => (
                            <Badge
                                key={tag}
                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                className="cursor-pointer text-lg py-2 px-4"
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    {selectedTags.length > 0 && (
                        <Button variant="outline" onClick={() => setSelectedTags([])}>Clear All</Button>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">
                        {selectedTags.length > 0 ? 'Filtered Posts' : 'All Posts'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {filteredPosts.map(post => (
                            <li key={post.slug}>
                                <Link to={`/post/${post.slug}`} className="text-primary hover:underline">
                                    {post.frontmatter.title}
                                </Link>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {post.frontmatter.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};
