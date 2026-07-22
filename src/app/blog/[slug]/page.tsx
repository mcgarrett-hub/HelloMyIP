import { PageShell } from "@/components/layout/site-chrome";
import { getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageShell activeHref="/blog" title={post.title}>
      <article className="blog-article space-y-4 text-[var(--foreground)]">
        <p className="text-sm text-[var(--muted)]">{post.date}</p>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
      <Link href="/blog" className="mt-8 inline-block text-sm font-semibold text-brand-600 hover:underline">
        ← All posts
      </Link>
    </PageShell>
  );
}
