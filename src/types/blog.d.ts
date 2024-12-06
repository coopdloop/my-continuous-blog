// src/types/blog.ts

export interface BlogPost {
    slug: string;
    frontmatter: BlogPostFrontmatter;
    content: string;
    tableOfContents: TableOfContents[];
}


export interface RecentSearch {
  term: string;
  timestamp: number;
}

export interface TableOfContents {
    id: string;
    title: string;
    level: number;
}

export interface Image {
    url: string;
    alt: string;
}

export interface BlogPostFrontmatter {
    title: string;
    pubDate: string;
    description: string;
    author: string;
    authorImage: Image;
    image: Image;
    tags: string[];
    ttr: string;
}
