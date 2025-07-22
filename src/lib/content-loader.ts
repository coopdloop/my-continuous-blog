import { BlogPost, BlogPostFrontmatter, TableOfContents } from '@/types/blog';

// Import all markdown files from content/posts
const modules = import.meta.glob('/src/content/posts/*.md', { eager: true, as: 'raw' });

interface MarkdownModule {
  [key: string]: string;
}

const markdownModules = modules as MarkdownModule;

function parseMarkdown(content: string): { frontmatter: BlogPostFrontmatter; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid markdown format: missing frontmatter');
  }

  const [, frontmatterText, markdownContent] = match;
  
  // Parse YAML frontmatter
  const frontmatter: any = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      
      if (key === 'tags') {
        frontmatter[key] = value.split(',').map(tag => tag.trim());
      } else if (key === 'pubDate') {
        frontmatter[key] = value;
      } else {
        frontmatter[key] = value;
      }
    }
  });

  // Ensure required fields
  const processedFrontmatter: BlogPostFrontmatter = {
    title: frontmatter.title || 'Untitled',
    pubDate: frontmatter.pubDate || new Date().toISOString().split('T')[0],
    description: frontmatter.description || '',
    ttr: frontmatter.ttr || '5 min',
    author: frontmatter.author || 'Cooper Wallace',
    authorImage: {
      url: frontmatter.authorImage || "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg",
      alt: frontmatter.authorImageAlt || frontmatter.author || 'Author'
    },
    image: {
      url: frontmatter.image || '/default-post-image.jpg',
      alt: frontmatter.imageAlt || frontmatter.title || 'Post image'
    },
    tags: frontmatter.tags || [],
    projectLink: frontmatter.projectLink
  };

  return { frontmatter: processedFrontmatter, content: markdownContent };
}

function generateTableOfContents(content: string): TableOfContents[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContents[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');

    toc.push({ id, title, level });
  }

  return toc;
}

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  Object.entries(markdownModules).forEach(([path, content]) => {
    try {
      const { frontmatter, content: markdownContent } = parseMarkdown(content);
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const tableOfContents = generateTableOfContents(markdownContent);

      posts.push({
        slug,
        frontmatter,
        content: markdownContent,
        tableOfContents
      });
    } catch (error) {
      console.error(`Error parsing markdown file ${path}:`, error);
    }
  });

  // Sort by publication date (newest first)
  return posts.sort((a, b) => 
    new Date(b.frontmatter.pubDate).getTime() - new Date(a.frontmatter.pubDate).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map(post => post.slug);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.frontmatter.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

export function getRecentPosts(limit: number = 5): BlogPost[] {
  const posts = getAllPosts();
  return posts.slice(0, limit);
}