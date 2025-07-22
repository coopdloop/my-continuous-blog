import { BlogPost, TableOfContents } from './types/blog';

function generateId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

function extractTableOfContents(content: string): TableOfContents[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: TableOfContents[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = generateId(title);

        toc.push({
            id,
            title,
            level
        });
    }

    return toc;
}

function parseFrontmatter(content: string): {
  frontmatter: BlogPost['frontmatter'],
  content: string,
  tableOfContents: TableOfContents[]
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {} as BlogPost['frontmatter'],
      content,
      tableOfContents: []
    };
  }

  const frontmatterString = match[1];
  const restContent = content.slice(match[0].length);
  const frontmatter: Record<string, any> = {};

  // Parse frontmatter
  frontmatterString.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
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
    frontmatter.tags = frontmatter.tags.split(',').map((tag: string) => tag.trim());
  }

  // Extract table of contents
  const tableOfContents = extractTableOfContents(restContent);

  // Remove the original table of contents section from the content
  const contentWithoutTOC = restContent.replace(/## Table of Contents\n([\s\S]*?)---\n/, '');

  return {
    frontmatter: frontmatter as BlogPost['frontmatter'],
    content: contentWithoutTOC,
    tableOfContents
  };
}

const postFiles = import.meta.glob('./content/posts/*.md', { as: 'raw', eager: true });

export const posts: BlogPost[] = Object.entries(postFiles).map(([filepath, content]) => {
  const { frontmatter, content: postContent, tableOfContents } = parseFrontmatter(content as string);
  const slug = filepath.split('/').pop()?.replace('.md', '') || '';

  return {
    slug,
    frontmatter,
    content: postContent,
    tableOfContents
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
