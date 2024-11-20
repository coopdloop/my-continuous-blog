// src/types/blog.ts

export interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    pubDate: string;
    description: string;
    ttr: string;
    author: string;
    authorImage: {
      url: string;
      alt: string;
    };
    image: {
      url: string;
      alt: string;
    };
    tags: string[];
    projectLink?: string;
    [key: string]: any;
  };
  content: string;
}

export interface RecentSearch {
  term: string;
  timestamp: number;
}

