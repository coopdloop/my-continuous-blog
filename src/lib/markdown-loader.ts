// import { BlogPost } from '@/types/blog';
import { getAllPosts, getPostBySlug } from '@/posts';

export { getAllPosts, getPostBySlug };

export function getAllPostSlugs(): string[] {
  return getAllPosts().map(post => post.slug);
}
