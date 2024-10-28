import { BlogPost } from './types/blog';

function parseFrontmatter(content: string): { frontmatter: BlogPost['frontmatter'], content: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {} as BlogPost['frontmatter'], content };
    }

    const frontmatterString = match[1];
    const restContent = content.slice(match[0].length);

    const frontmatter: Record<string, any> = {};
    frontmatterString.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            // Remove surrounding quotes if present
            value = value.replace(/^["'](.*)["']$/, '$1');
            frontmatter[key.trim()] = value;
        }
    });

    // Handle nested image and authorImage
    if (frontmatter.image) {
        frontmatter.image = { url: frontmatter.image, alt: frontmatter.imageAlt || '' };
    }
    if (frontmatter.authorImage) {
        frontmatter.authorImage = { url: frontmatter.authorImage, alt: frontmatter.authorImageAlt || '' };
    }

    // Handle tags
    if (frontmatter.tags && typeof frontmatter.tags === 'string') {
        frontmatter.tags = frontmatter.tags.split(',').map(tag => tag.trim());
    }

    return { frontmatter: frontmatter as BlogPost['frontmatter'], content: restContent };
}

// Use import.meta.glob to load all .md files in the posts directory
const postFiles = import.meta.glob('./posts/*.md', { as: 'raw', eager: true });

export const posts: BlogPost[] = Object.entries(postFiles).map(([filepath, content]) => {
    const { frontmatter, content: postContent } = parseFrontmatter(content as string);
    const slug = filepath.split('/').pop()?.replace('.md', '') || '';

    return {
        slug,
        frontmatter,
        content: postContent
    };
}).sort((a, b) =>
    new Date(b.frontmatter.pubDate).getTime() - new Date(a.frontmatter.pubDate).getTime()
);

export function getAllPosts(): BlogPost[] {
    return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.find(post => post.slug === slug);
}
