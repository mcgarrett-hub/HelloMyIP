import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BLOG_POSTS } from "@/lib/constants";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = (typeof BLOG_POSTS)[number];
export type BlogPost = BlogPostMeta & { content: string };

export function getAllPosts(): BlogPostMeta[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { content, data } = matter(raw);
  const meta = BLOG_POSTS.find((p) => p.slug === slug);
  if (!meta) return null;
  return {
    ...meta,
    title: (data.title as string) ?? meta.title,
    excerpt: (data.excerpt as string) ?? meta.excerpt,
    date: (data.date as string) ?? meta.date,
    content,
  };
}
